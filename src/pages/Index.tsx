import { Helmet } from 'react-helmet-async';
import PremiumBackground3D from '@/components/PremiumBackground3D';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>TLC Studios REWIND | Time Travel Photography</title>
        <meta name="description" content="Step into history with TLC Studios REWIND. Create AI-generated portraits across legendary eras." />
      </Helmet>

      <div className="min-h-screen relative overflow-hidden">
        <PremiumBackground3D />
      </div>
    </>
  );
};

export default Index;
