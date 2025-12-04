import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import EraGallery from "@/components/EraGallery";
import HowItWorks from "@/components/HowItWorks";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>TLC Studios REWIND | Time Travel Photography</title>
        <meta
          name="description"
          content="Step into history with TLC Studios REWIND. Create AI-generated portraits of yourself across legendary eras."
        />
      </Helmet>

      <main className="min-h-screen bg-background relative">
        {/* Ambient Animated Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>

        <Navbar />
        <Hero />
        <EraGallery />
        <HowItWorks />
        <CTA />
        <Footer />
      </main>
    </>
  );
};

export default Index;
