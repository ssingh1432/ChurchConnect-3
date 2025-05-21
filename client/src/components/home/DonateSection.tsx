import { Link } from "wouter";
import { motion } from "framer-motion";

const DonateSection = () => {
  return (
    <section className="py-16 bg-slate-900 text-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-2">Support Our Mission</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Your generous giving helps us spread the Gospel and serve our
            community. We offer multiple convenient ways to give.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* One-Time Gift */}
            <motion.div
              className="bg-slate-800 p-6 rounded-lg"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-16 h-16 bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-hand-holding-heart text-purple-400 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-2">One-Time Gift</h3>
              <p className="text-slate-300 mb-4">
                Support our church with a one-time donation of any amount.
              </p>
              <Link
                href="/donate"
                className="block text-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                Give Now
              </Link>
            </motion.div>

            {/* Recurring Giving */}
            <motion.div
              className="bg-slate-800 p-6 rounded-lg"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-16 h-16 bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-sync-alt text-purple-400 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-2">Recurring Giving</h3>
              <p className="text-slate-300 mb-4">
                Schedule automatic donations on a weekly or monthly basis.
              </p>
              <Link
                href="/donate"
                className="block text-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                Set Up Recurring
              </Link>
            </motion.div>

            {/* Special Giving */}
            <motion.div
              className="bg-slate-800 p-6 rounded-lg"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-16 h-16 bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-gift text-purple-400 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-2">Special Projects</h3>
              <p className="text-slate-300 mb-4">
                Support specific initiatives like building fund or missions.
              </p>
              <Link
                href="/donate"
                className="block text-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                View Projects
              </Link>
            </motion.div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <span className="px-4 py-2 bg-slate-800 rounded-md flex items-center">
              <i className="fab fa-paypal text-xl mr-2"></i> PayPal
            </span>
            <span className="px-4 py-2 bg-slate-800 rounded-md flex items-center">
              <i className="fab fa-google text-xl mr-2"></i> Google Pay
            </span>
            <span className="px-4 py-2 bg-slate-800 rounded-md flex items-center">
              <i className="fas fa-money-bill-wave text-xl mr-2"></i> Esewa
            </span>
            <span className="px-4 py-2 bg-slate-800 rounded-md flex items-center">
              <i className="fas fa-university text-xl mr-2"></i> Bank Transfer
            </span>
          </div>

          <p className="text-slate-300 mb-6">
            "Each of you should give what you have decided in your heart to
            give, not reluctantly or under compulsion, for God loves a cheerful
            giver." <br />
            <span className="italic">- 2 Corinthians 9:7</span>
          </p>

          <Link
            href="/donate"
            className="bg-white text-slate-900 hover:bg-slate-100 px-6 py-3 rounded-md font-medium transition-colors inline-block"
          >
            Learn More About Giving
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default DonateSection;
