import { Link } from "wouter";
import { motion } from "framer-motion";

const CTASection = () => {
  return (
    <section className="py-16 bg-slate-900 text-white relative">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 to-purple-900/80">
        <img
          src="https://images.unsplash.com/photo-1536736085916-ef1b6108e90a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Church congregation"
          className="w-full h-full object-cover mix-blend-overlay"
        />
      </div>
      <motion.div
        className="container mx-auto px-4 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            "For where two or three gather in my name, there am I with them."
          </h2>
          <p className="text-xl mb-8 opacity-90">Matthew 18:20</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/visit"
              className="bg-white text-slate-900 hover:bg-slate-100 px-6 py-3 rounded-md font-medium transition-colors"
            >
              Join Us This Sunday
            </Link>
            <Link
              href="/visit"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              Plan Your Visit
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CTASection;
