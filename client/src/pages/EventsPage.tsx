import { useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { Event } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate, formatTime } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Grid3x3, List } from "lucide-react";

const EventsPage = () => {
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Extract unique categories
  const categories = events
    ? Array.from(new Set(events.map((event) => event.category)))
    : [];

  // Filter events by category and date
  const filteredEvents = events
    ? events.filter((event) => {
        const categoryMatch = selectedCategory
          ? event.category === selectedCategory
          : true;
        
        const dateMatch = selectedDate
          ? new Date(event.startDate).toDateString() === selectedDate.toDateString()
          : true;
        
        return categoryMatch && dateMatch;
      })
    : [];

  // Group events by date for calendar view
  const eventsByDate = filteredEvents.reduce((acc, event) => {
    const date = new Date(event.startDate).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  // Function to clear all filters
  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedDate(undefined);
  };

  return (
    <>
      <Helmet>
        <title>Events - Grace Community Church</title>
        <meta
          name="description"
          content="Check out our upcoming events at Grace Community Church. Join us for worship services, community gatherings, and special programs."
        />
      </Helmet>

      <main>
        {/* Hero Section */}
        <section className="relative bg-slate-900 text-white py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/70">
            <img
              src="https://images.unsplash.com/photo-1531058020387-3be344556be6"
              alt="Church event"
              className="w-full h-full object-cover mix-blend-overlay"
            />
          </div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Upcoming Events</h1>
              <p className="text-xl max-w-3xl mx-auto">
                Join us for these upcoming opportunities for worship, fellowship,
                and service in our community.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Events Filter and Calendar Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Sidebar - Filters and Calendar */}
              <div className="md:w-1/3 lg:w-1/4 space-y-8">
                {/* View Toggle */}
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Events</h2>
                  <div className="flex bg-slate-100 rounded-md p-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className={viewMode === "grid" ? "bg-white shadow" : ""}
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className={viewMode === "list" ? "bg-white shadow" : ""}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Category Filter */}
                <div className="border rounded-md p-4">
                  <h3 className="font-semibold mb-3">Filter by Category</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center">
                        <input
                          type="radio"
                          id={category}
                          name="category"
                          className="mr-2"
                          checked={selectedCategory === category}
                          onChange={() => setSelectedCategory(category)}
                        />
                        <label htmlFor={category}>{category}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Calendar */}
                <div className="border rounded-md p-4">
                  <h3 className="font-semibold mb-3">Filter by Date</h3>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </div>

                {/* Clear Filters */}
                {(selectedCategory || selectedDate) && (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>

              {/* Right Content - Events */}
              <div className="md:w-2/3 lg:w-3/4">
                {isLoading ? (
                  <EventsLoading viewMode={viewMode} />
                ) : (
                  <Tabs defaultValue="upcoming" className="w-full">
                    <TabsList className="mb-6">
                      <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                      <TabsTrigger value="past">Past Events</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upcoming">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`${viewMode}-${selectedCategory}-${selectedDate?.toString()}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {filteredEvents.length === 0 ? (
                            <div className="text-center py-12 bg-slate-50 rounded-md">
                              <h3 className="text-xl font-medium text-slate-800 mb-2">
                                No events found
                              </h3>
                              <p className="text-slate-600 mb-4">
                                {selectedCategory || selectedDate
                                  ? "Try adjusting your filters"
                                  : "Check back soon for upcoming events"}
                              </p>
                              {(selectedCategory || selectedDate) && (
                                <Button
                                  variant="outline"
                                  onClick={clearFilters}
                                >
                                  Clear Filters
                                </Button>
                              )}
                            </div>
                          ) : viewMode === "grid" ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {filteredEvents.map((event) => (
                                <EventCard key={event.id} event={event} />
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {Object.keys(eventsByDate).map((date) => (
                                <div key={date}>
                                  <h3 className="font-bold text-slate-800 mb-3">
                                    {new Date(date).toLocaleDateString("en-US", {
                                      weekday: "long",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </h3>
                                  <div className="space-y-3">
                                    {eventsByDate[date].map((event) => (
                                      <EventListItem key={event.id} event={event} />
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </TabsContent>
                    <TabsContent value="past">
                      <div className="text-center py-12 bg-slate-50 rounded-md">
                        <h3 className="text-xl font-medium text-slate-800 mb-2">
                          Past Events Archive
                        </h3>
                        <p className="text-slate-600">
                          This feature is coming soon
                        </p>
                      </div>
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

const EventCard = ({ event }: { event: Event }) => {
  const date = new Date(event.startDate);
  const month = date.toLocaleString("default", { month: "short" }).toUpperCase();
  const day = date.getDate();

  const startTime = formatTime(event.startDate);
  const endTime = formatTime(event.endDate);

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {event.imageUrl && (
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold mb-1">{event.title}</h3>
            <p className="text-slate-600">{event.category}</p>
          </div>
          <div className="bg-slate-100 p-2 rounded text-center min-w-[60px]">
            <span className="block text-sm font-bold">{month}</span>
            <span className="block text-xl font-bold">{day}</span>
          </div>
        </div>
        <p className="text-slate-700 mb-4">{event.description}</p>
        <div className="flex items-center text-slate-600 text-sm mb-4">
          <i className="fas fa-clock mr-2"></i> {startTime} - {endTime}
        </div>
        <div className="flex items-center text-slate-600 text-sm mb-6">
          <i className="fas fa-map-marker-alt mr-2"></i> {event.location}
        </div>
        <Button className="w-full bg-purple-600 hover:bg-purple-700">
          Learn More
        </Button>
      </div>
    </motion.div>
  );
};

const EventListItem = ({ event }: { event: Event }) => {
  const startTime = formatTime(event.startDate);
  const endTime = formatTime(event.endDate);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex flex-col md:flex-row gap-4">
        <div className="md:w-1/4">
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-24 md:h-full object-cover rounded-md"
            />
          ) : (
            <div className="w-full h-24 bg-slate-200 rounded-md flex items-center justify-center">
              <i className="fas fa-calendar text-slate-400 text-3xl"></i>
            </div>
          )}
        </div>
        <div className="md:w-3/4">
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-2">
            <h3 className="text-lg font-bold">{event.title}</h3>
            <span className="text-sm text-slate-500 md:text-right md:whitespace-nowrap">
              {startTime} - {endTime}
            </span>
          </div>
          <p className="text-slate-600 text-sm mb-2">
            <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs mr-2">
              {event.category}
            </span>
            <i className="fas fa-map-marker-alt mx-1"></i> {event.location}
          </p>
          <p className="text-slate-700 text-sm mb-3 line-clamp-2">
            {event.description}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="text-purple-600 border-purple-600 hover:bg-purple-50"
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const EventsLoading = ({ viewMode }: { viewMode: "grid" | "list" }) => {
  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
            <Skeleton className="w-full h-48" />
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Skeleton className="h-6 w-32 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-14 w-14 rounded" />
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-4 w-2/3 mb-6" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  } else {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <Skeleton className="h-6 w-48 mb-3" />
            <div className="space-y-3">
              {[1, 2].map((j) => (
                <Card key={j}>
                  <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                    <div className="md:w-1/4">
                      <Skeleton className="w-full h-24 rounded-md" />
                    </div>
                    <div className="md:w-3/4">
                      <div className="flex flex-col md:flex-row justify-between md:items-center mb-2">
                        <Skeleton className="h-5 w-40 mb-1 md:mb-0" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-4 w-40 mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-3" />
                      <Skeleton className="h-8 w-24 rounded-md" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
};

export default EventsPage;
