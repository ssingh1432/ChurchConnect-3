import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "wouter";

const VisitPage = () => {
  const { data: serviceTimesContent, isLoading: loadingTimes } = useQuery({
    queryKey: ['/api/site-contents/services/times'],
  });

  const { data: contactInfo, isLoading: loadingContact } = useQuery({
    queryKey: ['/api/site-contents/contact/info'],
  });

  // Parse content if available, otherwise use defaults
  const serviceContent = serviceTimesContent
    ? JSON.parse(serviceTimesContent.content)
    : {
        sunday: "9:00 AM & 11:00 AM",
        youth: "Fridays at 6:30 PM",
        bibleStudy: "Wednesdays at 7:00 PM"
      };

  const contactContent = contactInfo
    ? JSON.parse(contactInfo.content)
    : {
        address: "123 Church Street, Cityville, State 12345",
        phone: "(123) 456-7890",
        email: "info@gracechurch.org",
        officeHours: "Mon-Fri, 9 AM - 5 PM"
      };

  // Prepare address for Google Maps embed
  const mapAddress = encodeURIComponent(contactContent.address);

  return (
    <>
      <Helmet>
        <title>Visit Us - Grace Community Church</title>
        <meta
          name="description"
          content="Plan your visit to Grace Community Church. Find service times, directions, and what to expect when you join us for worship."
        />
      </Helmet>

      <main>
        {/* Hero Section */}
        <section className="relative bg-slate-900 text-white py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/70">
            <img
              src="https://images.unsplash.com/photo-1514896856000-91cb6de818e0"
              alt="Church building"
              className="w-full h-full object-cover mix-blend-overlay"
            />
          </div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Plan Your Visit</h1>
              <p className="text-xl max-w-3xl mx-auto">
                We'd love to have you join us for worship. Here's everything you
                need to know before your first visit.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Service Times Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-2">Service Times</h2>
                <div className="w-20 h-1 bg-purple-600 mx-auto mb-6"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {/* Sunday Services */}
                <motion.div
                  className="bg-slate-50 p-6 rounded-lg text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-church text-purple-600 text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Sunday Services</h3>
                  {loadingTimes ? (
                    <Skeleton className="h-5 w-32 mx-auto" />
                  ) : (
                    <p className="text-slate-700">{serviceContent.sunday}</p>
                  )}
                </motion.div>

                {/* Youth Service */}
                <motion.div
                  className="bg-slate-50 p-6 rounded-lg text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-users text-purple-600 text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Youth Service</h3>
                  {loadingTimes ? (
                    <Skeleton className="h-5 w-32 mx-auto" />
                  ) : (
                    <p className="text-slate-700">{serviceContent.youth}</p>
                  )}
                </motion.div>

                {/* Bible Study */}
                <motion.div
                  className="bg-slate-50 p-6 rounded-lg text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-book-open text-purple-600 text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Bible Study</h3>
                  {loadingTimes ? (
                    <Skeleton className="h-5 w-32 mx-auto" />
                  ) : (
                    <p className="text-slate-700">{serviceContent.bibleStudy}</p>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Location Section */}
        <section className="py-16 bg-slate-100">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-2">How to Find Us</h2>
                <div className="w-20 h-1 bg-purple-600 mx-auto mb-6"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-xl font-bold mb-4">Our Location</h3>
                  {loadingContact ? (
                    <div className="space-y-3">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-2/3" />
                      <Skeleton className="h-5 w-1/2" />
                    </div>
                  ) : (
                    <>
                      <p className="text-slate-700 mb-4">
                        {contactContent.address}
                      </p>
                      <p className="text-slate-700 mb-6">
                        <strong>Phone:</strong> {contactContent.phone}
                      </p>
                    </>
                  )}
                  <div className="flex gap-4">
                    <a
                      href={`https://maps.google.com/?q=${mapAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium transition-colors inline-flex items-center"
                    >
                      <i className="fas fa-directions mr-2"></i> Get Directions
                    </a>
                    <Link 
                      href="/contact"
                      className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-md font-medium transition-colors inline-flex items-center"
                    >
                      <i className="fas fa-envelope mr-2"></i> Contact Us
                    </Link>
                  </div>
                </div>

                <div className="h-72 md:h-80 rounded-md overflow-hidden shadow-md">
                  {/* Google Maps embed */}
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${mapAddress}`}
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What to Expect Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-2">What to Expect</h2>
                <div className="w-20 h-1 bg-purple-600 mx-auto mb-6"></div>
                <p className="text-slate-600">
                  We want you to feel comfortable when you visit us for the
                  first time. Here's what you can expect when you arrive.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205"
                    alt="Worship service"
                    className="rounded-lg shadow-md w-full h-64 object-cover"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-xl font-bold mb-4">Our Sunday Service</h3>
                  <p className="text-slate-700 mb-4">
                    Our worship services typically last about 90 minutes. We
                    begin with contemporary worship music led by our worship
                    team, followed by a relevant, Bible-based message from our
                    pastor.
                  </p>
                  <p className="text-slate-700">
                    We offer children's programs for all ages during the service,
                    and our friendly greeters will help direct you when you
                    arrive.
                  </p>
                </motion.div>
              </div>

              <div className="bg-slate-50 rounded-lg p-6 md:p-8">
                <h3 className="text-xl font-bold mb-4">Frequently Asked Questions</h3>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>What should I wear?</AccordionTrigger>
                    <AccordionContent>
                      We have no dress code. Some people come in suits, others in
                      jeans. Wear whatever makes you comfortable!
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Where do I park?</AccordionTrigger>
                    <AccordionContent>
                      We have a large parking lot with designated visitor
                      parking near the main entrance. Our parking team will help
                      direct you.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>What about my kids?</AccordionTrigger>
                    <AccordionContent>
                      We have safe, fun children's programs for all ages during
                      our services. You can check your children in at the
                      Children's Welcome Center when you arrive.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>
                      Will I be asked to give money?
                    </AccordionTrigger>
                    <AccordionContent>
                      As our guest, you are not expected to give. The offering
                      time is for our regular attendees who consider Grace their
                      church home.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-5">
                    <AccordionTrigger>
                      How do I meet people and get connected?
                    </AccordionTrigger>
                    <AccordionContent>
                      Visit our Welcome Center after the service where our team
                      can help you learn about small groups, volunteer
                      opportunities, and upcoming events.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-purple-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">We Can't Wait to Meet You!</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join us this Sunday for a meaningful worship experience. We're
              saving a seat for you!
            </p>
            <Link
              href="/contact"
              className="bg-white text-purple-700 hover:bg-slate-100 px-8 py-3 rounded-md font-medium transition-colors inline-block"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </main>
    </>
  );
};

export default VisitPage;
