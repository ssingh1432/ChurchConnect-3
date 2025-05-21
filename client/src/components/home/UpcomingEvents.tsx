import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Event } from "@shared/schema";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const UpcomingEvents = () => {
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  if (isLoading) {
    return <EventsLoading />;
  }

  // Take the first 3 events if available
  const upcomingEvents = events?.slice(0, 3) || [];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Upcoming Events</h2>
          <p className="text-slate-600 max-w-3xl mx-auto">
            Join us for these upcoming opportunities for worship, fellowship, and
            service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-slate-600">No upcoming events at this time. Check back later!</p>
            </div>
          )}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/events"
            className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium transition-colors"
          >
            View All Events
            <i className="fas fa-arrow-right ml-2"></i>
          </Link>
        </div>
      </div>
    </section>
  );
};

const EventCard = ({ event }: { event: Event }) => {
  const date = new Date(event.startDate);
  const month = date.toLocaleString("default", { month: "short" }).toUpperCase();
  const day = date.getDate();
  
  const startTime = new Date(event.startDate).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  const endTime = new Date(event.endDate).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

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
        <Link
          href={`/events/${event.id}`}
          className="block text-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          Learn More
        </Link>
      </div>
    </motion.div>
  );
};

const EventsLoading = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Upcoming Events</h2>
          <p className="text-slate-600 max-w-3xl mx-auto">
            Join us for these upcoming opportunities for worship, fellowship, and
            service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Skeleton className="w-full h-48" />
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Skeleton className="h-7 w-40 mb-1" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                  <Skeleton className="h-16 w-14 rounded" />
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
      </div>
    </section>
  );
};

export default UpcomingEvents;
