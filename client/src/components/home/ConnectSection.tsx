import { Link } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

const ConnectSection = () => {
  const { data: contactInfo } = useQuery({
    queryKey: ['/api/site-contents/contact/info'],
  });

  // Parse content if available, otherwise use defaults
  const content = contactInfo
    ? JSON.parse(contactInfo.content)
    : {
        address: "123 Church Street, Cityville, State 12345",
        phone: "(123) 456-7890",
        email: "info@gracechurch.org",
        officeHours: "Mon-Fri, 9 AM - 5 PM"
      };

  // Separate address into lines
  const addressLines = content.address.split(',');

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Connect With Us</h2>
          <p className="text-slate-600 max-w-3xl mx-auto">
            We'd love to hear from you and help you get involved in our church
            community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Visit Us */}
          <motion.div 
            className="text-center p-6 bg-slate-50 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-map-marker-alt text-purple-600 text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold mb-2">Visit Us</h3>
            <p className="text-slate-700 mb-4">
              {addressLines.map((line, index) => (
                <span key={index}>
                  {line.trim()}
                  {index < addressLines.length - 1 && <br />}
                </span>
              ))}
            </p>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(content.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-800 font-medium"
            >
              Get Directions
            </a>
          </motion.div>

          {/* Service Times */}
          <motion.div 
            className="text-center p-6 bg-slate-50 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-clock text-purple-600 text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold mb-2">Service Times</h3>
            <p className="text-slate-700 mb-4">
              Sunday Morning: 9:00 AM & 11:00 AM<br />
              Youth Service: Fridays at 6:30 PM<br />
              Bible Study: Wednesdays at 7:00 PM
            </p>
            <Link
              href="/visit"
              className="text-purple-600 hover:text-purple-800 font-medium"
            >
              Plan Your Visit
            </Link>
          </motion.div>

          {/* Contact Us */}
          <motion.div 
            className="text-center p-6 bg-slate-50 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-envelope text-purple-600 text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold mb-2">Contact Us</h3>
            <p className="text-slate-700 mb-4">
              Phone: {content.phone}<br />
              Email: {content.email}<br />
              Office Hours: {content.officeHours}
            </p>
            <Link
              href="/contact"
              className="text-purple-600 hover:text-purple-800 font-medium"
            >
              Send Message
            </Link>
          </motion.div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/contact"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-medium transition-colors inline-block"
          >
            View All Ways to Connect
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ConnectSection;
