import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { username, password } = await req.json();

    // Validate input
    if (!username || !password) {
      console.log('Missing username or password');
      return new Response(
        JSON.stringify({ success: false, error: 'Missing credentials' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get admin credentials from environment (server-side only)
    const adminUsername = Deno.env.get('ADMIN_USERNAME');
    const adminPassword = Deno.env.get('ADMIN_PASSWORD');

    if (!adminUsername || !adminPassword) {
      console.error('Admin credentials not configured in environment');
      return new Response(
        JSON.stringify({ success: false, error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate credentials server-side
    if (username !== adminUsername || password !== adminPassword) {
      console.log('Invalid admin credentials attempt');
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid credentials' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Credentials valid - now check if user is authenticated
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      // No auth header means user wants to verify credentials without being logged in
      // This is allowed for the quick access feature
      console.log('Admin credentials verified (no user session)');
      return new Response(
        JSON.stringify({ success: true, authenticated: false }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // User is authenticated - grant admin role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Create client with user's auth to get their ID
    const supabaseAuth = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser();
    
    if (userError || !user) {
      console.log('Failed to get user from auth header');
      return new Response(
        JSON.stringify({ success: true, authenticated: false }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use service role to grant admin (bypasses RLS)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user already has admin role
    const { data: existingRole } = await supabaseAdmin
      .from('user_roles')
      .select('id')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (!existingRole) {
      // Grant admin role
      const { error: insertError } = await supabaseAdmin
        .from('user_roles')
        .insert({ user_id: user.id, role: 'admin' });

      if (insertError) {
        console.error('Failed to insert admin role:', insertError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to grant admin role' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      console.log(`Admin role granted to user ${user.id}`);
    } else {
      console.log(`User ${user.id} already has admin role`);
    }

    return new Response(
      JSON.stringify({ success: true, authenticated: true, userId: user.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in verify-admin function:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
