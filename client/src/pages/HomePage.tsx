import { Helmet } from "react-helmet";
import Hero from "@/components/home/Hero";
import ServiceTimes from "@/components/home/ServiceTimes";
import UpcomingEvents from "@/components/home/UpcomingEvents";
import MinistriesSection from "@/components/home/MinistriesSection";
import LatestSermons from "@/components/home/LatestSermons";
import CTASection from "@/components/home/CTASection";
import BlogSection from "@/components/home/BlogSection";
import PrayerRequestSection from "@/components/home/PrayerRequestSection";
import ConnectSection from "@/components/home/ConnectSection";
import DonateSection from "@/components/home/DonateSection";

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Bishram Ekata Mandali - A Place of Faith, Family & Community</title>
        <meta 
          name="description" 
          content="Welcome to Grace Community Church. Join us for worship, fellowship, and spiritual growth. Sunday services at 9:00 AM & 11:00 AM."
        />
        <meta property="og:title" content="Grace Community Church" />
        <meta property="og:description" content="A place of faith, family, and community." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <main>
        <Hero />
        <ServiceTimes />
        <UpcomingEvents />
        <MinistriesSection />
        <LatestSermons />
        <CTASection />
        <BlogSection />
        <PrayerRequestSection />
        <ConnectSection />
        <DonateSection />
      </main>
    </>
  );
};

export default HomePage;
