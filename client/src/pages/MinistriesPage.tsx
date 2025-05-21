import { useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { Ministry } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const MinistriesPage = () => {
  const { data: ministries, isLoading } = useQuery<Ministry[]>({
    queryKey: ["/api/ministries"],
  });

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Extract unique categories
  const categories = ministries
    ? Array.from(new Set(ministries.map((ministry) => ministry.title.split(" ")[0])))
    : [];

  // Filter ministries by category if selected
  const filteredMinistries = selectedCategory
    ? ministries?.filter((ministry) => ministry.title.includes(selectedCategory))
    : ministries;

  return (
    <>
      <Helmet>
        <title>Ministries - Grace Community Church</title>
        <meta
          name="description"
          content="Explore our various ministries at Grace Community Church and find out how you can get involved and serve."
        />
      </Helmet>

      <main>
        {/* Hero Section */}
        <section className="relative bg-slate-900 text-white py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/70">
            <img
              src="https://images.unsplash.com/photo-1511632765486-a01980e01a18"
              alt="Church ministry"
              className="w-full h-full object-cover mix-blend-overlay"
            />
          </div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Ministries</h1>
              <p className="text-xl max-w-3xl mx-auto">
                Discover how you can get involved, grow in faith, and serve
                others through our various ministries.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Ministries Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            {/* Filter Categories */}
            {categories.length > 0 && (
              <div className="mb-12 flex flex-wrap justify-center gap-2">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  onClick={() => setSelectedCategory(null)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  All Ministries
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    className={
                      selectedCategory === category
                        ? "bg-purple-600 hover:bg-purple-700"
                        : ""
                    }
                  >
                    {category}
                  </Button>
                ))}
              </div>
            )}

            {isLoading ? (
              <MinistriesLoading />
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCategory || "all"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {filteredMinistries && filteredMinistries.length > 0 ? (
                    filteredMinistries.map((ministry) => (
                      <MinistryCard key={ministry.id} ministry={ministry} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <p className="text-slate-600">
                        No ministries found. {selectedCategory && "Try another category or"}{" "}
                        <Button
                          variant="link"
                          onClick={() => setSelectedCategory(null)}
                          className="text-purple-600 p-0"
                        >
                          view all ministries
                        </Button>
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </section>

        {/* Join a Ministry CTA */}
        <section className="py-16 bg-slate-100">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Serve?</h2>
            <p className="text-slate-700 mb-8 max-w-3xl mx-auto">
              We believe everyone has been gifted by God to serve in some
              capacity. Join one of our ministry teams and make a difference!
            </p>
            <Link
              href="/volunteer"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-md font-medium transition-colors inline-block"
            >
              Volunteer Today
            </Link>
          </div>
        </section>
      </main>
    </>
  );
};

const MinistryCard = ({ ministry }: { ministry: Ministry }) => {
  return (
    <motion.div
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all group"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={ministry.imageUrl || "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d"}
          alt={ministry.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end">
          <h3 className="text-white text-2xl font-bold p-6">{ministry.title}</h3>
        </div>
      </div>
      <div className="p-6">
        <p className="text-slate-700 mb-6">{ministry.description}</p>
        {ministry.schedule && (
          <div className="mb-6">
            <h4 className="font-semibold text-slate-900 mb-2">Schedule:</h4>
            <p className="text-slate-700">{ministry.schedule}</p>
          </div>
        )}
        <div className="flex justify-between items-center">
          <Link
            href={`/ministries/${ministry.id}`}
            className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium transition-colors"
          >
            Learn More
            <i className="fas fa-arrow-right ml-2"></i>
          </Link>
          <Link
            href="/volunteer"
            className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Get Involved
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const MinistriesLoading = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
          <div className="relative h-64 overflow-hidden">
            <Skeleton className="w-full h-full" />
          </div>
          <div className="p-6">
            <Skeleton className="h-6 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-6" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MinistriesPage;
