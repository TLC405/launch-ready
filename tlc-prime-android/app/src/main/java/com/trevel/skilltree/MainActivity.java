package com.trevel.skilltree;
import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.graphics.Color;
import android.view.View;
import android.webkit.*;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.TextView;
import java.io.InputStream;
import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.ArrayList;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.OutputStream;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.database.Cursor;
import android.os.Build;
import android.provider.OpenableColumns;
import org.json.JSONArray;
import org.json.JSONObject;

public class MainActivity extends Activity {
  private WebView w, pw;
  private FrameLayout root;
  private LinearLayout pv;
  private View full;
  private WebChromeClient.CustomViewCallback fullCb;
  private ValueCallback<Uri[]> fileCb;
  private static final int PICK = 7, PICK_NATIVE = 8;
  // v3.7 Share to TLC Prime: items wait here until the page pulls them with Native.takeShared()
  private final JSONArray shared = new JSONArray();
  private volatile String busy = "";
  private volatile boolean pageReady = false;
  private static final String BASE = "https://skilltree.app/";

  @Override protected void onCreate(Bundle b) {
    super.onCreate(b);
    getWindow().setStatusBarColor(Color.parseColor("#07091a"));
    getWindow().setNavigationBarColor(Color.parseColor("#0d1130"));
    w = new WebView(this);
    WebSettings s = w.getSettings();
    s.setJavaScriptEnabled(true); s.setDomStorageEnabled(true); s.setDatabaseEnabled(true);
    s.setMediaPlaybackRequiresUserGesture(false);
    s.setAllowFileAccess(false); s.setAllowContentAccess(true); s.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
    s.setUserAgentString(s.getUserAgentString().replace("; wv", "").replace("Version/4.0 ", ""));
    CookieManager.getInstance().setAcceptCookie(true);
    CookieManager.getInstance().setAcceptThirdPartyCookies(w, true);
    w.setBackgroundColor(Color.parseColor("#07091a"));
    w.setWebChromeClient(chrome());
    w.setWebViewClient(new WebViewClient() {
      @Override public void onPageFinished(WebView v, String url) { pageReady = true; notifyJs(); }
      @Override public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest r) {
        String u = r.getUrl().toString();
        if (u.startsWith(BASE)) return false;
        if (!r.isForMainFrame()) {
          // v3.6 inline tutorial embeds: Instagram pages may load inside their in-card frame only.
          // Anything else a frame tries (app-open intents, store links, other sites) is swallowed.
          String sc = r.getUrl().getScheme() == null ? "" : r.getUrl().getScheme();
          String h = r.getUrl().getHost() == null ? "" : r.getUrl().getHost();
          return !(sc.startsWith("http") && (h.endsWith("instagram.com") || h.endsWith("cdninstagram.com") || h.endsWith("facebook.com") || h.endsWith("fbcdn.net")));
        }
        // No external links: Instagram reels open in the in-app player, everything else is blocked.
        java.util.regex.Matcher m = java.util.regex.Pattern.compile("instagram\\.com/(?:[\\w.]+/)?(?:reel|reels|p)/([\\w-]+)").matcher(u);
        if (m.find()) openPlayer(m.group(1));
        return true;
      }
      @Override public WebResourceResponse shouldInterceptRequest(WebView v, WebResourceRequest r) {
        return local(r.getUrl().toString());
      }
    });
    root = new FrameLayout(this);
    root.addView(w, new FrameLayout.LayoutParams(-1, -1));
    setContentView(root);
    w.addJavascriptInterface(new Object() {
      @JavascriptInterface public void playReel(final String code) { runOnUiThread(() -> openPlayer(code)); }
      @JavascriptInterface public boolean isApp() { return true; }
      @JavascriptInterface public String takeShared() { synchronized (shared) { String o = shared.toString(); while (shared.length() > 0) shared.remove(0); return o; } }
      @JavascriptInterface public String shareBusy() { return busy; }
      @JavascriptInterface public void pickVideo() { runOnUiThread(() -> {
        Intent i = new Intent(Intent.ACTION_GET_CONTENT); i.addCategory(Intent.CATEGORY_OPENABLE); i.setType("video/*");
        try { startActivityForResult(Intent.createChooser(i, "Pick a video"), PICK_NATIVE); }
        catch (Exception e) { push(err("No app on this phone can pick a video: " + e)); }
      }); }
      @JavascriptInterface public void copy(String t) { runOnUiThread(() -> {
        try { ((ClipboardManager) getSystemService(CLIPBOARD_SERVICE)).setPrimaryClip(ClipData.newPlainText("TLC Prime diagnostics", t)); } catch (Exception e) {}
      }); }
      @JavascriptInterface public void release(String name) { if (name != null && name.matches("[\\w.-]+")) new File(sharedDir(), name).delete(); }
      @JavascriptInterface public String info() {
        String wv = "?";
        try { if (Build.VERSION.SDK_INT >= 26) { android.content.pm.PackageInfo p = WebView.getCurrentWebViewPackage(); if (p != null) wv = p.packageName + " " + p.versionName; } } catch (Exception e) {}
        return Build.MANUFACTURER + " " + Build.MODEL + " · Android " + Build.VERSION.RELEASE + " (SDK " + Build.VERSION.SDK_INT + ") · WebView " + wv + " · app 3.8 (14)";
      }
      @JavascriptInterface public void setBars(final boolean light) { runOnUiThread(() -> {
        getWindow().setStatusBarColor(Color.parseColor(light ? "#eaf4ff" : "#07091a"));
        getWindow().setNavigationBarColor(Color.parseColor(light ? "#ffffff" : "#0d1130"));
        int f = light ? (View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | 0x10) : 0;
        if (full == null) getWindow().getDecorView().setSystemUiVisibility(f);
        w.setBackgroundColor(Color.parseColor(light ? "#f7f3e8" : "#07091a"));
      }); }
    }, "Native");
    cleanShared();
    w.loadDataWithBaseURL(BASE, readAsset("app.html"), "text/html", "utf-8", null);
    handleShare(getIntent());
  }

  @Override protected void onNewIntent(Intent i) { super.onNewIntent(i); setIntent(i); handleShare(i); }

  // ---------- v3.7 Share to TLC Prime
  private void handleShare(Intent in) {
    if (in == null) return;
    String act = in.getAction();
    if (!Intent.ACTION_SEND.equals(act) && !Intent.ACTION_SEND_MULTIPLE.equals(act)) return;
    ArrayList<Uri> uris = new ArrayList<>();
    try {
      if (Intent.ACTION_SEND.equals(act)) { Uri u = in.getParcelableExtra(Intent.EXTRA_STREAM); if (u != null) uris.add(u); }
      else { ArrayList<Uri> l = in.getParcelableArrayListExtra(Intent.EXTRA_STREAM); if (l != null) for (Uri u : l) if (u != null) uris.add(u); }
    } catch (Exception e) {}
    ClipData cd = in.getClipData();
    if (uris.isEmpty() && cd != null) for (int k = 0; k < cd.getItemCount(); k++) { Uri u = cd.getItemAt(k).getUri(); if (u != null) uris.add(u); }
    String text = in.getStringExtra(Intent.EXTRA_TEXT);
    if (text == null && cd != null && cd.getItemCount() > 0 && cd.getItemAt(0).getText() != null) text = cd.getItemAt(0).getText().toString();
    in.setAction("consumed"); // a rotation or fold must not import it twice
    if (!uris.isEmpty()) copyAsync(uris, "share");
    else if (text != null) {
      try { JSONObject o = new JSONObject(); o.put("type", "text"); o.put("text", text); String sub = in.getStringExtra(Intent.EXTRA_SUBJECT); if (sub != null) o.put("subject", sub); push(o); } catch (Exception e) {}
    } else push(err("The share had no video or link in it."));
  }

  private void copyAsync(final ArrayList<Uri> uris, final String from) {
    busy = uris.size() > 1 ? uris.size() + " videos" : "video";
    if (pageReady) runOnUiThread(() -> w.evaluateJavascript("window.stShareBusy&&stShareBusy(" + JSONObject.quote(busy) + ")", null));
    new Thread(() -> {
      int n = 0;
      for (Uri u : uris) {
        String name = "video.mp4", mime = null; long size = -1;
        try {
          mime = getContentResolver().getType(u);
          Cursor c = getContentResolver().query(u, new String[]{OpenableColumns.DISPLAY_NAME, OpenableColumns.SIZE}, null, null, null);
          if (c != null) { if (c.moveToFirst()) { int a = c.getColumnIndex(OpenableColumns.DISPLAY_NAME), b = c.getColumnIndex(OpenableColumns.SIZE); if (a >= 0 && c.getString(a) != null) name = c.getString(a); if (b >= 0 && !c.isNull(b)) size = c.getLong(b); } c.close(); }
        } catch (Exception e) {}
        if (mime != null && !mime.startsWith("video/") && !mime.equals("application/octet-stream")) { push(err("Only videos can be analyzed (that was " + mime + ").")); continue; }
        String ext = name.lastIndexOf('.') > 0 ? name.substring(name.lastIndexOf('.')).replaceAll("[^\\w.]", "") : ".mp4";
        String file = System.currentTimeMillis() + "_" + (n++) + (ext.length() > 1 && ext.length() < 7 ? ext : ".mp4");
        File out = new File(sharedDir(), file);
        try (InputStream is = getContentResolver().openInputStream(u); OutputStream os = new FileOutputStream(out)) {
          if (is == null) throw new Exception("could not open the shared file");
          byte[] buf = new byte[1 << 16]; int k; long tot = 0;
          while ((k = is.read(buf)) > 0) { os.write(buf, 0, k); tot += k; if (tot > 2000L * 1024 * 1024) throw new Exception("video is over 2 GB"); }
          JSONObject o = new JSONObject();
          o.put("type", "video"); o.put("url", BASE + "shared/" + file); o.put("name", name); o.put("mime", mime == null ? "video/mp4" : mime); o.put("size", tot); o.put("from", from);
          push(o);
        } catch (Exception e) { out.delete(); push(err("Could not copy the video: " + e.getMessage())); }
      }
      busy = "";
      notifyJs();
    }).start();
  }

  private JSONObject err(String m) { JSONObject o = new JSONObject(); try { o.put("type", "error"); o.put("msg", m); } catch (Exception e) {} return o; }
  private void push(JSONObject o) { synchronized (shared) { shared.put(o); } notifyJs(); }
  private void notifyJs() { if (!pageReady) return; runOnUiThread(() -> w.evaluateJavascript("window.stShare&&stShare()", null)); }
  private File sharedDir() { File d = new File(getCacheDir(), "shared"); if (!d.exists()) d.mkdirs(); return d; }
  private void cleanShared() { try { File[] fs = sharedDir().listFiles(); if (fs != null) for (File f : fs) if (System.currentTimeMillis() - f.lastModified() > 6L * 3600 * 1000) f.delete(); } catch (Exception e) {} }

  private WebResourceResponse local(String u) {
    boolean lib = u.startsWith(BASE + "lib/"), sh = u.startsWith(BASE + "shared/");
    if (!lib && !sh) return null;
    String path = u.substring(BASE.length()).split("[?#]")[0];
    HashMap<String, String> h = new HashMap<>(); h.put("Access-Control-Allow-Origin", "*");
    try {
      InputStream in; long len = -1;
      if (sh) {
        String name = path.substring("shared/".length());
        if (!name.matches("[\\w.-]+")) return notFound(h);
        File f = new File(sharedDir(), name); if (!f.exists()) return notFound(h);
        in = new FileInputStream(f); len = f.length(); h.put("Cache-Control", "no-store");
      } else {
        if (path.contains("..")) return notFound(h);
        in = getAssets().open(path); h.put("Cache-Control", "max-age=31536000");
      }
      String mime = path.endsWith(".js") ? "application/javascript" : path.endsWith(".json") ? "application/json" : path.endsWith(".wasm") ? "application/wasm"
        : path.endsWith(".jpg") ? "image/jpeg" : path.endsWith(".mp4") || path.endsWith(".m4v") ? "video/mp4" : path.endsWith(".webm") ? "video/webm" : path.endsWith(".mov") ? "video/quicktime" : sh ? "video/mp4" : "application/octet-stream";
      if (len >= 0) h.put("Content-Length", String.valueOf(len));
      return new WebResourceResponse(mime, mime.startsWith("application/j") ? "utf-8" : null, 200, "OK", h, in);
    } catch (Exception e) { return notFound(h); }
  }
  private WebResourceResponse notFound(HashMap<String, String> h) {
    return new WebResourceResponse("text/plain", "utf-8", 404, "Not Found", h, new java.io.ByteArrayInputStream(new byte[0]));
  }

  private WebChromeClient chrome() {
    return new WebChromeClient() {
      @Override public void onShowCustomView(View v, CustomViewCallback cb) {
        if (full != null) { cb.onCustomViewHidden(); return; }
        full = v; fullCb = cb; root.addView(v, new FrameLayout.LayoutParams(-1, -1));
        getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
      }
      @Override public void onHideCustomView() { exitFull(); }
      @Override public boolean onShowFileChooser(WebView v, ValueCallback<Uri[]> cb, FileChooserParams p) {
        if (fileCb != null) fileCb.onReceiveValue(null);
        fileCb = cb;
        Intent i = new Intent(Intent.ACTION_GET_CONTENT);
        i.addCategory(Intent.CATEGORY_OPENABLE); i.setType("video/*");
        try { startActivityForResult(Intent.createChooser(i, "Pick a video"), PICK); }
        catch (Exception e) { fileCb = null; cb.onReceiveValue(null); }
        return true;
      }
    };
  }

  @Override protected void onActivityResult(int req, int res, Intent data) {
    Uri u = null;
    if (res == RESULT_OK && data != null) {
      u = data.getData();
      if (u == null && data.getClipData() != null && data.getClipData().getItemCount() > 0) u = data.getClipData().getItemAt(0).getUri();
    }
    if (req == PICK_NATIVE) {
      // v3.7: picked videos take the same path as shared ones (copied into the app, then read by the analyzer)
      if (u != null) { ArrayList<Uri> l = new ArrayList<>(); l.add(u); copyAsync(l, "picker"); }
      return;
    }
    if (req == PICK) {
      if (fileCb != null) { fileCb.onReceiveValue(u != null ? new Uri[]{u} : null); fileCb = null; }
      return;
    }
    super.onActivityResult(req, res, data);
  }

  private void openPlayer(String code) {
    if (!code.matches("[A-Za-z0-9_-]+")) return;
    if (pv == null) {
      pv = new LinearLayout(this); pv.setOrientation(LinearLayout.VERTICAL); pv.setBackgroundColor(Color.BLACK);
      TextView bar = new TextView(this);
      bar.setText("\u2715  BACK TO TRAINING"); bar.setTextColor(Color.parseColor("#ffd400")); bar.setTextSize(15);
      bar.setTypeface(android.graphics.Typeface.create("sans-serif-black", android.graphics.Typeface.BOLD_ITALIC));
      bar.setPadding(44, 40, 44, 40); bar.setBackgroundColor(Color.parseColor("#0d1130"));
      bar.setOnClickListener(v -> closePlayer());
      pw = new WebView(this);
      WebSettings ps = pw.getSettings();
      ps.setJavaScriptEnabled(true); ps.setDomStorageEnabled(true); ps.setMediaPlaybackRequiresUserGesture(false);
      ps.setUserAgentString(w.getSettings().getUserAgentString());
      CookieManager.getInstance().setAcceptThirdPartyCookies(pw, true);
      pw.setBackgroundColor(Color.BLACK);
      pw.setWebChromeClient(chrome());
      pw.setWebViewClient(new WebViewClient() {
        @Override public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest r) {
          String sc = r.getUrl().getScheme() == null ? "" : r.getUrl().getScheme();
          String h = r.getUrl().getHost() == null ? "" : r.getUrl().getHost();
          // Stay inside the app: only Instagram/Meta web pages load; app-open, intent and store links are swallowed.
          if (sc.startsWith("http") && (h.endsWith("instagram.com") || h.endsWith("facebook.com") || h.endsWith("fbcdn.net") || h.endsWith("cdninstagram.com"))) return false;
          return true;
        }
        @Override public void onPageFinished(WebView v, String url) {
          // hide "open in app" banners and footers so the reel fills the screen
          v.evaluateJavascript("(function(){var s=document.createElement('style');s.textContent='[href*=\"apps.apple\"],[href*=\"play.google\"],[href^=\"intent:\"],[href^=\"instagram:\"]{display:none!important}';document.head&&document.head.appendChild(s)})()", null);
        }
      });
      pv.addView(bar, new LinearLayout.LayoutParams(-1, -2));
      pv.addView(pw, new LinearLayout.LayoutParams(-1, 0, 1f));
      root.addView(pv, new FrameLayout.LayoutParams(-1, -1));
    }
    pv.setVisibility(View.VISIBLE);
    pw.loadUrl("https://www.instagram.com/reel/" + code + "/");
  }

  private void closePlayer() {
    if (pv != null) { pw.loadUrl("about:blank"); pv.setVisibility(View.GONE); CookieManager.getInstance().flush(); }
  }

  private void exitFull() {
    if (full == null) return;
    root.removeView(full); full = null;
    getWindow().getDecorView().setSystemUiVisibility(0);
    if (fullCb != null) { fullCb.onCustomViewHidden(); fullCb = null; }
  }

  private String readAsset(String n) {
    try { InputStream in = getAssets().open(n); ByteArrayOutputStream o = new ByteArrayOutputStream(); byte[] buf = new byte[8192]; int k; while ((k = in.read(buf)) > 0) o.write(buf, 0, k); in.close(); return o.toString("UTF-8"); }
    catch (Exception e) { return "<h1>Load error</h1>"; }
  }

  @Override public void onBackPressed() {
    if (full != null) { exitFull(); return; }
    if (pv != null && pv.getVisibility() == View.VISIBLE) {
      if (pw.canGoBack() && pw.getUrl() != null && !pw.getUrl().contains("/reel/")) pw.goBack(); else closePlayer();
      return;
    }
    w.evaluateJavascript("(function(){return window.onBack?onBack():0})()", v -> { if ("0".equals(v)) MainActivity.super.onBackPressed(); });
  }
}