import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Ministry } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { truncateText } from "@/lib/utils";

const MinistriesSection = () => {
  const { data: ministries, isLoading } = useQuery<Ministry[]>({
    queryKey: ["/api/ministries"],
  });

  if (isLoading) {
    return <MinistriesLoading />;
  }

  // Take the first 3 ministries if available
  const featuredMinistries = ministries?.slice(0, 3) || [];

  return (
    <section className="py-16 bg-slate-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Our Ministries</h2>
          <p className="text-slate-600 max-w-3xl mx-auto">
            Discover how you can get involved, grow in faith, and serve others
            through our various ministries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredMinistries.length > 0 ? (
            featuredMinistries.map((ministry) => (
              <MinistryCard key={ministry.id} ministry={ministry} />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-slate-600">No ministries found. Check back later!</p>
            </div>
          )}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/ministries"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-medium transition-colors inline-block"
          >
            View All Ministries
          </Link>
        </div>
      </div>
    </section>
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
      <div className="relative h-48 overflow-hidden">
        <img
          src={ministry.imageUrl || "https://images.unsplash.com/photo-1560541919-eb5c2da6a5a3"}
          alt={ministry.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent flex items-end">
          <h3 className="text-white text-xl font-bold p-6">{ministry.title}</h3>
        </div>
      </div>
      <div className="p-6">
        <p className="text-slate-700 mb-4">
          {truncateText(ministry.description, 120)}
        </p>
        <Link
          href={`/ministries/${ministry.id}`}
          className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium transition-colors"
        >
          Learn More
          <i className="fas fa-arrow-right ml-2"></i>
        </Link>
      </div>
    </motion.div>
  );
};

const MinistriesLoading = () => {
  return (
    <section className="py-16 bg-slate-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Our Ministries</h2>
          <p className="text-slate-600 max-w-3xl mx-auto">
            Discover how you can get involved, grow in faith, and serve others
            through our various ministries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="relative h-48 overflow-hidden">
                <Skeleton className="w-full h-full" />
              </div>
              <div className="p-6">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MinistriesSection;
