import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const AboutPage = () => {
  const { data: aboutContent, isLoading: loadingAbout } = useQuery({
    queryKey: ['/api/site-contents/about/content'],
  });

  const { data: leadershipData, isLoading: loadingLeadership } = useQuery({
    queryKey: ['/api/site-contents/about/leadership'],
  });

  // Parse content if available, otherwise use defaults
  const content = aboutContent
    ? JSON.parse(aboutContent.content)
    : {
        history: "Grace Community Church was founded in 1975 with a vision to serve the community and share the love of Christ.",
        mission: "To glorify God by making disciples who love God, grow in community, and reach out to the world.",
        vision: "To be a church that transforms lives, families, and communities with the Gospel of Jesus Christ."
      };

  // Parse leadership if available, otherwise use defaults
  const leadership = leadershipData
    ? JSON.parse(leadershipData.content)
    : [
        {
          name: "John Smith",
          title: "Senior Pastor",
          bio: "Pastor John has served our church for 15 years. He is passionate about teaching the Bible and equipping the saints for ministry.",
          image: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c"
        },
        {
          name: "Sarah Johnson",
          title: "Worship Director",
          bio: "Sarah leads our worship ministry with creativity and a deep love for God's presence. She has been on staff for 8 years.",
          image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2"
        },
        {
          name: "Michael Rodriguez",
          title: "Youth Pastor",
          bio: "Pastor Michael has a heart for helping young people grow in their faith. He has led our youth ministry for 5 years.",
          image: "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6"
        }
      ];

  return (
    <>
      <Helmet>
        <title>About Us - Grace Community Church</title>
        <meta 
          name="description" 
          content="Learn about our history, mission, vision, and leadership team at Grace Community Church."
        />
      </Helmet>

      <main>
        {/* Hero Section */}
        <section className="relative bg-slate-900 text-white py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/70">
            <img
              src="https://images.unsplash.com/photo-1470686165655-24d78765f471"
              alt="Church building"
              className="w-full h-full object-cover mix-blend-overlay"
            />
          </div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Our Church</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Get to know our history, mission, vision, and the people who make
              Grace Community Church a place to call home.
            </p>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-2">Our Story</h2>
                <div className="w-20 h-1 bg-purple-600 mx-auto mb-6"></div>
              </div>

              {loadingAbout ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                </div>
              ) : (
                <div className="prose prose-lg max-w-none">
                  <p className="mb-6">{content.history}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="py-16 bg-slate-100">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                <div className="w-16 h-1 bg-purple-600 mb-6"></div>
                {loadingAbout ? (
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-3/4" />
                  </div>
                ) : (
                  <p className="text-slate-700">{content.mission}</p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                <div className="w-16 h-1 bg-purple-600 mb-6"></div>
                {loadingAbout ? (
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-3/4" />
                  </div>
                ) : (
                  <p className="text-slate-700">{content.vision}</p>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Leadership Team Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-2">Our Leadership Team</h2>
              <div className="w-20 h-1 bg-purple-600 mx-auto mb-6"></div>
              <p className="text-slate-600 max-w-3xl mx-auto">
                Meet the dedicated individuals who lead and serve our church
                community with passion and purpose.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {loadingLeadership ? (
                // Loading skeletons
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow p-6">
                    <Skeleton className="h-48 w-48 rounded-full mx-auto mb-6" />
                    <Skeleton className="h-6 w-32 mx-auto mb-2" />
                    <Skeleton className="h-4 w-24 mx-auto mb-4" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-4/5 mx-auto" />
                    </div>
                  </div>
                ))
              ) : (
                // Display leadership team
                Array.isArray(leadership) && leadership.map((leader, index) => (
                  <motion.div
                    key={index}
                    className="bg-white rounded-lg shadow overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="w-full h-64 object-cover object-center"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-1">{leader.name}</h3>
                      <p className="text-purple-600 mb-4">{leader.title}</p>
                      <p className="text-slate-700">{leader.bio}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-slate-900 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-2">Our Core Values</h2>
              <div className="w-20 h-1 bg-purple-400 mx-auto mb-6"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <motion.div
                className="bg-slate-800 p-6 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-16 h-16 bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-book-open text-purple-400 text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-3 text-center">Biblical Teaching</h3>
                <p className="text-slate-300 text-center">
                  We are committed to the faithful teaching of God's Word as our ultimate authority.
                </p>
              </motion.div>

              <motion.div
                className="bg-slate-800 p-6 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="w-16 h-16 bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-hands-praying text-purple-400 text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-3 text-center">Authentic Worship</h3>
                <p className="text-slate-300 text-center">
                  We value heartfelt, Spirit-led worship that draws people closer to God.
                </p>
              </motion.div>

              <motion.div
                className="bg-slate-800 p-6 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="w-16 h-16 bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-users text-purple-400 text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-3 text-center">Community & Fellowship</h3>
                <p className="text-slate-300 text-center">
                  We believe spiritual growth happens best in the context of authentic relationships.
                </p>
              </motion.div>

              <motion.div
                className="bg-slate-800 p-6 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <div className="w-16 h-16 bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-hands-helping text-purple-400 text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-3 text-center">Compassionate Service</h3>
                <p className="text-slate-300 text-center">
                  We are called to demonstrate Christ's love through serving our community and world.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default AboutPage;
