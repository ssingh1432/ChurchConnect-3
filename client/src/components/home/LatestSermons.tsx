import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Sermon } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";

const LatestSermons = () => {
  const { data: sermons, isLoading } = useQuery<Sermon[]>({
    queryKey: ["/api/sermons"],
  });

  if (isLoading) {
    return <SermonsLoading />;
  }

  // Get latest sermon if available
  const latestSermon = sermons && sermons.length > 0 ? sermons[0] : null;
  
  // Get rest of sermons for list (skip latest, get next 4)
  const recentSermons = sermons?.slice(1, 5) || [];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Latest Sermons</h2>
          <p className="text-slate-600 max-w-3xl mx-auto">
            Listen to or watch our recent messages and grow in your faith.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Featured Sermon */}
          {latestSermon ? (
            <FeaturedSermon sermon={latestSermon} />
          ) : (
            <div className="bg-slate-100 rounded-lg p-8 text-center">
              <p className="text-slate-600">No sermons available at this time.</p>
            </div>
          )}

          {/* Sermon List */}
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-bold text-lg">Recent Messages</h3>
            </div>

            {recentSermons.length > 0 ? (
              <ul className="divide-y divide-slate-200">
                {recentSermons.map((sermon) => (
                  <SermonListItem key={sermon.id} sermon={sermon} />
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center">
                <p className="text-slate-600">No recent messages available.</p>
              </div>
            )}

            <div className="p-4 border-t border-slate-200">
              <Link
                href="/sermons"
                className="text-purple-600 hover:text-purple-800 font-medium flex items-center justify-center"
              >
                View All Sermons
                <i className="fas fa-arrow-right ml-2"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeaturedSermon = ({ sermon }: { sermon: Sermon }) => {
  return (
    <motion.div
      className="bg-slate-100 rounded-lg overflow-hidden shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="aspect-w-16 aspect-h-9 bg-slate-800 relative">
        {sermon.thumbnailUrl ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={sermon.thumbnailUrl}
              alt={sermon.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
              <a
                href={sermon.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
              >
                <i className="fas fa-play text-white text-xl"></i>
              </a>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-slate-700 flex items-center justify-center">
            <i className="fas fa-volume-up text-4xl text-slate-400"></i>
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold">{sermon.title}</h3>
          <span className="bg-slate-200 text-slate-700 px-2 py-1 rounded text-xs">
            Latest
          </span>
        </div>
        <p className="text-slate-600 mb-3">
          {sermon.speaker} • {formatDate(sermon.date)}
        </p>
        <p className="text-slate-700 mb-4">{sermon.description}</p>
        <div className="flex space-x-3">
          {sermon.videoUrl && (
            <a
              href={sermon.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-purple-600 hover:text-purple-800 transition-colors"
            >
              <i className="fas fa-video mr-1"></i> Watch
            </a>
          )}
          {sermon.audioUrl && (
            <a
              href={sermon.audioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-purple-600 hover:text-purple-800 transition-colors"
            >
              <i className="fas fa-headphones mr-1"></i> Listen
            </a>
          )}
          {sermon.notesUrl && (
            <a
              href={sermon.notesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-purple-600 hover:text-purple-800 transition-colors"
            >
              <i className="fas fa-file-alt mr-1"></i> Notes
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const SermonListItem = ({ sermon }: { sermon: Sermon }) => {
  return (
    <motion.li
      className="p-4 hover:bg-slate-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex">
        <div className="mr-4 flex-shrink-0">
          <div className="bg-slate-200 rounded-md w-16 h-16 flex items-center justify-center text-slate-700">
            <i className="fas fa-volume-up text-xl"></i>
          </div>
        </div>
        <div>
          <h4 className="font-semibold">{sermon.title}</h4>
          <p className="text-slate-600 text-sm mb-1">
            {sermon.speaker} • {formatDate(sermon.date)}
          </p>
          <div className="flex space-x-3 text-sm">
            {sermon.audioUrl && (
              <a
                href={sermon.audioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-800"
              >
                <i className="fas fa-play mr-1"></i> Listen
              </a>
            )}
            {sermon.audioUrl && (
              <a
                href={sermon.audioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-800"
              >
                <i className="fas fa-download mr-1"></i> Download
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.li>
  );
};

const SermonsLoading = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Latest Sermons</h2>
          <p className="text-slate-600 max-w-3xl mx-auto">
            Listen to or watch our recent messages and grow in your faith.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Featured Sermon Loading */}
          <div className="bg-slate-100 rounded-lg overflow-hidden shadow-md">
            <div className="aspect-w-16 aspect-h-9 bg-slate-800">
              <Skeleton className="w-full h-full" />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-5 w-16 rounded" />
              </div>
              <Skeleton className="h-4 w-1/2 mb-3" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              <div className="flex space-x-3">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          </div>

          {/* Sermon List Loading */}
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-bold text-lg">Recent Messages</h3>
            </div>

            <ul className="divide-y divide-slate-200">
              {[1, 2, 3, 4].map((i) => (
                <li key={i} className="p-4">
                  <div className="flex">
                    <div className="mr-4 flex-shrink-0">
                      <Skeleton className="w-16 h-16 rounded-md" />
                    </div>
                    <div className="w-full">
                      <Skeleton className="h-5 w-3/4 mb-1" />
                      <Skeleton className="h-4 w-1/2 mb-1" />
                      <div className="flex space-x-3">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestSermons;
