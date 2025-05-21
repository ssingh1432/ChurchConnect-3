import { useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { Sermon } from "@shared/schema";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

const SermonsPage = () => {
  const { data: sermons, isLoading } = useQuery<Sermon[]>({
    queryKey: ["/api/sermons"],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // Extract unique topics
  const topics = sermons
    ? Array.from(new Set(sermons.map((sermon) => sermon.topic).filter(Boolean)))
    : [];

  // Filter sermons by search term and topic
  const filteredSermons = sermons
    ? sermons.filter((sermon) => {
        const searchMatch = searchTerm
          ? sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sermon.speaker.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (sermon.description && 
              sermon.description.toLowerCase().includes(searchTerm.toLowerCase()))
          : true;
        
        const topicMatch = selectedTopic
          ? sermon.topic === selectedTopic
          : true;
        
        return searchMatch && topicMatch;
      })
    : [];

  return (
    <>
      <Helmet>
        <title>Sermons - Grace Community Church</title>
        <meta
          name="description"
          content="Watch and listen to sermons from Grace Community Church. Grow in your faith through biblical teaching and spiritual insights."
        />
      </Helmet>

      <main>
        {/* Hero Section */}
        <section className="relative bg-slate-900 text-white py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/70">
            <img
              src="https://pixabay.com/get/ge0e32189521a4c088b905d34ed7f94d0eab28932398db6aa3766862f4d4070af6c91b5ba3b65f96dbf4d9948f8e63a596dd3a6470542a1b4fa9bd64e60c04793_1280.jpg"
              alt="Church service"
              className="w-full h-full object-cover mix-blend-overlay"
            />
          </div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Sermons</h1>
              <p className="text-xl max-w-3xl mx-auto">
                Listen to or watch our messages to grow in your faith through
                biblical teaching and spiritual insights.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Sermons Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Sidebar - Search and Filters */}
              <div className="md:w-1/3 lg:w-1/4 space-y-8">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search sermons..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Topic Filter */}
                <div className="border rounded-md p-4">
                  <h3 className="font-semibold mb-3">Filter by Topic</h3>
                  <div className="space-y-2">
                    {topics.map((topic) => (
                      <div key={topic} className="flex items-center">
                        <input
                          type="radio"
                          id={topic}
                          name="topic"
                          className="mr-2"
                          checked={selectedTopic === topic}
                          onChange={() => setSelectedTopic(topic)}
                        />
                        <label htmlFor={topic}>{topic}</label>
                      </div>
                    ))}
                  </div>
                  {selectedTopic && (
                    <Button
                      variant="link"
                      onClick={() => setSelectedTopic(null)}
                      className="mt-2 p-0 h-auto text-sm text-purple-600"
                    >
                      Clear topic filter
                    </Button>
                  )}
                </div>

                {/* Latest Series Banner */}
                <div className="bg-purple-100 rounded-md p-4 text-center">
                  <h3 className="font-bold text-purple-800 mb-2">Latest Series</h3>
                  <p className="text-purple-700 mb-4 text-sm">
                    "Finding Peace in Troubled Times"
                  </p>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    View Series
                  </Button>
                </div>
              </div>

              {/* Right Content - Sermons */}
              <div className="md:w-2/3 lg:w-3/4">
                {isLoading ? (
                  <SermonsLoading />
                ) : (
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="mb-6">
                      <TabsTrigger value="all">All Sermons</TabsTrigger>
                      <TabsTrigger value="video">Video</TabsTrigger>
                      <TabsTrigger value="audio">Audio</TabsTrigger>
                    </TabsList>
                    <TabsContent value="all">
                      <SermonList sermons={filteredSermons} />
                    </TabsContent>
                    <TabsContent value="video">
                      <SermonList 
                        sermons={filteredSermons.filter(sermon => sermon.videoUrl)} 
                      />
                    </TabsContent>
                    <TabsContent value="audio">
                      <SermonList 
                        sermons={filteredSermons.filter(sermon => sermon.audioUrl)}
                      />
                    </TabsContent>
                  </Tabs>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

const SermonList = ({ sermons }: { sermons: Sermon[] }) => {
  if (sermons.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-md">
        <h3 className="text-xl font-medium text-slate-800 mb-2">
          No sermons found
        </h3>
        <p className="text-slate-600">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {sermons.map((sermon) => (
        <SermonCard key={sermon.id} sermon={sermon} />
      ))}
    </div>
  );
};

const SermonCard = ({ sermon }: { sermon: Sermon }) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 lg:w-1/4 bg-slate-100">
            {sermon.thumbnailUrl ? (
              <div className="relative aspect-video md:h-full">
                <img
                  src={sermon.thumbnailUrl}
                  alt={sermon.title}
                  className="w-full h-full object-cover"
                />
                {sermon.videoUrl && (
                  <a
                    href={sermon.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center bg-slate-900/40 hover:bg-slate-900/60 transition-colors"
                  >
                    <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
                      <i className="fas fa-play text-white text-xl"></i>
                    </div>
                  </a>
                )}
              </div>
            ) : (
              <div className="aspect-video md:h-full bg-slate-200 flex items-center justify-center">
                <i className="fas fa-volume-up text-4xl text-slate-400"></i>
              </div>
            )}
          </div>
          <div className="p-6 md:w-2/3 lg:w-3/4">
            <h3 className="text-xl font-bold mb-1">{sermon.title}</h3>
            <p className="text-slate-600 mb-3">
              {sermon.speaker} • {formatDate(sermon.date)}
              {sermon.topic && (
                <span className="ml-2 inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                  {sermon.topic}
                </span>
              )}
            </p>
            {sermon.description && (
              <p className="text-slate-700 mb-4">{sermon.description}</p>
            )}
            <div className="flex flex-wrap gap-3">
              {sermon.videoUrl && (
                <a
                  href={sermon.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors"
                >
                  <i className="fas fa-video mr-1"></i> Watch
                </a>
              )}
              {sermon.audioUrl && (
                <a
                  href={sermon.audioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors"
                >
                  <i className="fas fa-headphones mr-1"></i> Listen
                </a>
              )}
              {sermon.notesUrl && (
                <a
                  href={sermon.notesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors"
                >
                  <i className="fas fa-file-alt mr-1"></i> Notes
                </a>
              )}
              {sermon.audioUrl && (
                <a
                  href={sermon.audioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors"
                >
                  <i className="fas fa-download mr-1"></i> Download
                </a>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SermonsLoading = () => {
  return (
    <div className="grid grid-cols-1 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 lg:w-1/4">
                <Skeleton className="aspect-video md:h-full" />
              </div>
              <div className="p-6 md:w-2/3 lg:w-3/4">
                <Skeleton className="h-6 w-3/4 mb-1" />
                <Skeleton className="h-4 w-1/2 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="flex gap-3">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SermonsPage;
