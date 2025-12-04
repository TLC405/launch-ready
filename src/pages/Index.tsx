import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import EraGallery from "@/components/EraGallery";
import HowItWorks from "@/components/HowItWorks";
import Gallery from "@/components/Gallery";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>TLC Studios Rewind | AI Time Travel Photography</title>
        <meta
          name="description"
          content="Step into history with TLC Studios Rewind. Create stunning AI-generated portraits of yourself in iconic moments from the 1900s to the 1970s."
        />
        <meta
          name="keywords"
          content="AI photography, vintage portraits, time travel photos, historic era portraits, AI photo generator"
        />
        <link rel="canonical" href="https://tlcstudios-rewind.com" />
      </Helmet>

      <main className="min-h-screen bg-background">
        <Navbar />
        <Hero />
        <EraGallery />
        <HowItWorks />
        <Gallery />
        <Testimonials />
        <Pricing />
        <CTA />
        <Footer />
      </main>
    </>
  );
};

export default Index;
