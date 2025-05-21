import { useState } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  phone: z.string().optional(),
  subject: z.string().min(2, { message: "Subject is required" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type ContactForm = z.infer<typeof contactFormSchema>;

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { data: contactInfo, isLoading } = useQuery({
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

  // Prepare address for Google Maps embed
  const mapAddress = encodeURIComponent(content.address);

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    try {
      // This would be a real API endpoint in a production app
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message Sent",
        description: "Thank you for contacting us. We'll respond to you soon!",
        variant: "default",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - Grace Community Church</title>
        <meta
          name="description"
          content="Get in touch with Grace Community Church. Contact information, location, and office hours."
        />
      </Helmet>

      <main>
        {/* Hero Section */}
        <section className="relative bg-slate-900 text-white py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/70">
            <img
              src="https://images.unsplash.com/photo-1556566229-f6eda1cb9e22"
              alt="Church interior"
              className="w-full h-full object-cover mix-blend-overlay"
            />
          </div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
              <p className="text-xl max-w-3xl mx-auto">
                We'd love to hear from you! Get in touch with us using the
                information below or send us a message.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Information Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {/* Address */}
                <motion.div
                  className="bg-slate-50 p-6 rounded-lg text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-map-marker-alt text-purple-600 text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Our Location</h3>
                  {isLoading ? (
                    <Skeleton className="h-12 w-4/5 mx-auto" />
                  ) : (
                    <p className="text-slate-700">{content.address}</p>
                  )}
                  <a
                    href={`https://maps.google.com/?q=${mapAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-purple-600 hover:text-purple-800 font-medium"
                  >
                    Get Directions
                  </a>
                </motion.div>

                {/* Contact Information */}
                <motion.div
                  className="bg-slate-50 p-6 rounded-lg text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-phone-alt text-purple-600 text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Contact Information</h3>
                  {isLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-1/2 mx-auto" />
                      <Skeleton className="h-5 w-2/3 mx-auto" />
                    </div>
                  ) : (
                    <>
                      <p className="text-slate-700 mb-2">
                        <strong>Phone:</strong> {content.phone}
                      </p>
                      <p className="text-slate-700">
                        <strong>Email:</strong> {content.email}
                      </p>
                    </>
                  )}
                  <a
                    href={`mailto:${content.email}`}
                    className="mt-4 inline-block text-purple-600 hover:text-purple-800 font-medium"
                  >
                    Email Us
                  </a>
                </motion.div>

                {/* Office Hours */}
                <motion.div
                  className="bg-slate-50 p-6 rounded-lg text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-clock text-purple-600 text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Office Hours</h3>
                  {isLoading ? (
                    <Skeleton className="h-5 w-2/3 mx-auto" />
                  ) : (
                    <p className="text-slate-700">{content.officeHours}</p>
                  )}
                </motion.div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Contact Form */}
                <div>
                  <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="Your email" type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="Your phone number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subject</FormLabel>
                              <FormControl>
                                <Input placeholder="Message subject" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Your message here..." 
                                className="min-h-[120px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="bg-purple-600 hover:bg-purple-700"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </Form>
                </div>

                {/* Map */}
                <div>
                  <h2 className="text-2xl font-bold mb-6">Our Location</h2>
                  <div className="h-96 rounded-lg overflow-hidden shadow-md">
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
          </div>
        </section>

        {/* Staff Contact Section */}
        <section className="py-16 bg-slate-100">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-2">Our Staff</h2>
                <div className="w-20 h-1 bg-purple-600 mx-auto mb-6"></div>
                <p className="text-slate-600">
                  Looking for someone specific? Here's how to reach our staff.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Pastor */}
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c"
                      alt="Pastor John Smith"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-bold">Pastor John Smith</h3>
                  <p className="text-purple-600 mb-3">Senior Pastor</p>
                  <p className="text-slate-700 text-sm mb-3">
                    pastor.john@gracechurch.org
                  </p>
                  <p className="text-slate-700 text-sm">
                    (123) 456-7890 ext. 101
                  </p>
                </div>

                {/* Worship Director */}
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2"
                      alt="Sarah Johnson"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-bold">Sarah Johnson</h3>
                  <p className="text-purple-600 mb-3">Worship Director</p>
                  <p className="text-slate-700 text-sm mb-3">
                    sarah@gracechurch.org
                  </p>
                  <p className="text-slate-700 text-sm">
                    (123) 456-7890 ext. 102
                  </p>
                </div>

                {/* Youth Pastor */}
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6"
                      alt="Michael Rodriguez"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-bold">Michael Rodriguez</h3>
                  <p className="text-purple-600 mb-3">Youth Pastor</p>
                  <p className="text-slate-700 text-sm mb-3">
                    michael@gracechurch.org
                  </p>
                  <p className="text-slate-700 text-sm">
                    (123) 456-7890 ext. 103
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default ContactPage;
