import { motion } from "framer-motion";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

const Hero = () => {
  const { data: siteContent, isLoading } = useQuery({
    queryKey: ['/api/site-contents/home/hero'],
  });

  // Parse content if available, otherwise use defaults
  const content = siteContent
    ? JSON.parse(siteContent.content)
    : {
        title: "Welcome to Grace Community Church",
        subtitle: "A place to find faith, family, and community.",
        image: "https://images.unsplash.com/photo-1514896856000-91cb6de818e0"
      };

  return (
    <section className="relative bg-slate-900 text-white">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/70">
        {!isLoading && (
          <img
            src={content.image}
            alt="Church building"
            className="w-full h-full object-cover mix-blend-overlay"
          />
        )}
      </div>
      <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {content.title}
          </h1>
          <p className="text-xl mb-8">{content.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/visit" className="church-button">
              Visit This Sunday
            </Link>
            <Link href="/sermons" className="church-button-outline">
              Watch Sermons
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
