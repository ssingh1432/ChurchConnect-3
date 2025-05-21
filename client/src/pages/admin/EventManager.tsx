import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { Event, InsertEvent } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPin, Clock, PlusCircle, Pencil, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Event categories
const eventCategories = [
  "worship-service",
  "bible-study",
  "prayer-meeting",
  "youth",
  "children",
  "outreach",
  "missions",
  "community",
  "fellowship",
  "special",
  "holiday",
  "conference",
  "workshop",
  "other"
];

// Extended schema with validation
const eventFormSchema = z.object({
  title: z.string().min(2, { message: "Title is required" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  category: z.string().min(1, { message: "Category is required" }),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  location: z.string().min(2, { message: "Location is required" }),
  imageUrl: z.string().url({ message: "Must be a valid URL" }).nullable().optional(),
}).refine(data => data.endDate >= data.startDate, {
  message: "End date must be after or equal to start date",
  path: ["endDate"],
});

type EventForm = z.infer<typeof eventFormSchema>;

const EventManager = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Today's date for filtering upcoming/past events
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Fetch events
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  // Filter events by date
  const upcomingEvents = events?.filter(event => new Date(event.startDate) >= today) || [];
  const pastEvents = events?.filter(event => new Date(event.startDate) < today) || [];

  // Form for adding new events
  const addForm = useForm<EventForm>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      startDate: new Date(),
      endDate: new Date(),
      location: "",
      imageUrl: "",
    },
  });

  // Form for editing events
  const editForm = useForm<EventForm>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      startDate: new Date(),
      endDate: new Date(),
      location: "",
      imageUrl: "",
    },
  });

  // Add event mutation
  const addEventMutation = useMutation({
    mutationFn: (data: EventForm) => {
      return apiRequest("POST", "/api/events", data);
    },
    onSuccess: () => {
      toast({
        title: "Event Added",
        description: "The event has been added successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      setIsAddDialogOpen(false);
      addForm.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "There was an error adding the event. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Edit event mutation
  const editEventMutation = useMutation({
    mutationFn: (data: EventForm & { id: number }) => {
      const { id, ...updateData } = data;
      return apiRequest("PATCH", `/api/events/${id}`, updateData);
    },
    onSuccess: () => {
      toast({
        title: "Event Updated",
        description: "The event has been updated successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      setIsEditDialogOpen(false);
      setSelectedEvent(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "There was an error updating the event. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest("DELETE", `/api/events/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Event Deleted",
        description: "The event has been deleted successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      setIsDeleteDialogOpen(false);
      setSelectedEvent(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "There was an error deleting the event. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle form submissions
  const onAddSubmit = (data: EventForm) => {
    addEventMutation.mutate(data);
  };

  const onEditSubmit = (data: EventForm) => {
    if (selectedEvent) {
      editEventMutation.mutate({ ...data, id: selectedEvent.id });
    }
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    editForm.reset({
      title: event.title,
      description: event.description,
      category: event.category,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
      location: event.location,
      imageUrl: event.imageUrl,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (event: Event) => {
    setSelectedEvent(event);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedEvent) {
      deleteEventMutation.mutate(selectedEvent.id);
    }
  };

  // Format time for display
  const formatEventTime = (startDate: Date, endDate: Date): string => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const sameDay = start.getDate() === end.getDate() && 
                     start.getMonth() === end.getMonth() && 
                     start.getFullYear() === end.getFullYear();
    
    if (sameDay) {
      return `${formatDate(start)} • ${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return `${formatDate(start)} - ${formatDate(end)}`;
    }
  };

  // Get category badge styling
  const getCategoryStyle = (category: string): string => {
    const categories: {[key: string]: string} = {
      "worship-service": "bg-purple-100 text-purple-800",
      "bible-study": "bg-blue-100 text-blue-800",
      "prayer-meeting": "bg-teal-100 text-teal-800",
      "youth": "bg-orange-100 text-orange-800",
      "children": "bg-pink-100 text-pink-800",
      "outreach": "bg-green-100 text-green-800",
      "missions": "bg-red-100 text-red-800",
      "fellowship": "bg-amber-100 text-amber-800",
      "special": "bg-indigo-100 text-indigo-800",
      "holiday": "bg-emerald-100 text-emerald-800",
    };

    return categories[category.toLowerCase()] || "bg-slate-100 text-slate-800";
  };

  return (
    <>
      <Helmet>
        <title>Event Management - Grace Community Church</title>
      </Helmet>

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Event Management</h1>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Event
          </Button>
        </div>
        
        {/* Event statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Events</p>
                  <p className="text-3xl font-bold mt-1">
                    {isLoading ? <Skeleton className="h-9 w-12" /> : events?.length || 0}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <CalendarIcon className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Upcoming Events</p>
                  <p className="text-3xl font-bold mt-1">
                    {isLoading ? <Skeleton className="h-9 w-12" /> : upcomingEvents.length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Past Events</p>
                  <p className="text-3xl font-bold mt-1">
                    {isLoading ? <Skeleton className="h-9 w-12" /> : pastEvents.length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                  <CalendarIcon className="h-6 w-6 text-slate-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              // Loading skeletons
              Array(3).fill(0).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-video bg-slate-100">
                    <Skeleton className="h-full w-full" />
                  </div>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent className="pb-2">
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : upcomingEvents.length === 0 ? (
              <div className="col-span-full text-center py-8 bg-slate-50 rounded-lg">
                <p className="text-slate-500">No upcoming events scheduled</p>
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddDialogOpen(true)}
                  className="mt-4"
                >
                  Add your first event
                </Button>
              </div>
            ) : (
              upcomingEvents.map(event => (
                <Card key={event.id} className="overflow-hidden flex flex-col">
                  <div className="bg-slate-100 aspect-video relative">
                    {event.imageUrl ? (
                      <img 
                        src={event.imageUrl} 
                        alt={event.title} 
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Event";
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <CalendarIcon className="h-12 w-12 mb-2" />
                        <p className="text-sm">No image</p>
                      </div>
                    )}
                    <Badge 
                      className={`absolute top-3 right-3 ${getCategoryStyle(event.category)}`}
                    >
                      {event.category.replace(/-/g, ' ')}
                    </Badge>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <CardDescription className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatEventTime(event.startDate, event.endDate)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2 flex-grow">
                    <div className="flex items-start mb-3">
                      <MapPin className="h-4 w-4 text-slate-400 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-slate-600">{event.location}</p>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-3">{event.description}</p>
                  </CardContent>
                  <CardFooter className="border-t bg-slate-50 p-2 mt-auto">
                    <div className="flex space-x-2 w-full justify-end">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(event)}>
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(event)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Past Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map(event => (
                <Card key={event.id} className="overflow-hidden flex flex-col opacity-80 hover:opacity-100 transition-opacity">
                  <div className="bg-slate-100 aspect-video relative">
                    {event.imageUrl ? (
                      <img 
                        src={event.imageUrl} 
                        alt={event.title} 
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Event";
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <CalendarIcon className="h-12 w-12 mb-2" />
                        <p className="text-sm">No image</p>
                      </div>
                    )}
                    <Badge 
                      className={`absolute top-3 right-3 ${getCategoryStyle(event.category)}`}
                    >
                      {event.category.replace(/-/g, ' ')}
                    </Badge>
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                      <Badge className="bg-slate-800 text-white">Past Event</Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <CardDescription className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatEventTime(event.startDate, event.endDate)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2 flex-grow">
                    <div className="flex items-start mb-3">
                      <MapPin className="h-4 w-4 text-slate-400 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-slate-600">{event.location}</p>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-3">{event.description}</p>
                  </CardContent>
                  <CardFooter className="border-t bg-slate-50 p-2 mt-auto">
                    <div className="flex space-x-2 w-full justify-end">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(event)}>
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(event)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Add Event Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
              <DialogDescription>
                Create a new event for the church calendar.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...addForm}>
              <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-6">
                <FormField
                  control={addForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter event title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={field.value}
                          onChange={field.onChange}
                        >
                          <option value="">Select a category</option>
                          {eventCategories.map((category) => (
                            <option key={category} value={category}>
                              {category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ')}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={addForm.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date & Time</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={
                                  "w-full pl-3 text-left font-normal " +
                                  (!field.value && "text-muted-foreground")
                                }
                              >
                                {field.value ? (
                                  formatDate(field.value)
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        {/* Time picker - for simplicity, using native time input */}
                        <div className="mt-2">
                          <Input
                            type="time"
                            value={field.value ? new Date(field.value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : ''}
                            onChange={(e) => {
                              const [hours, minutes] = e.target.value.split(':');
                              const newDate = new Date(field.value);
                              newDate.setHours(parseInt(hours), parseInt(minutes));
                              field.onChange(newDate);
                            }}
                            className="w-full"
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={addForm.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date & Time</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={
                                  "w-full pl-3 text-left font-normal " +
                                  (!field.value && "text-muted-foreground")
                                }
                              >
                                {field.value ? (
                                  formatDate(field.value)
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        {/* Time picker */}
                        <div className="mt-2">
                          <Input
                            type="time"
                            value={field.value ? new Date(field.value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : ''}
                            onChange={(e) => {
                              const [hours, minutes] = e.target.value.split(':');
                              const newDate = new Date(field.value);
                              newDate.setHours(parseInt(hours), parseInt(minutes));
                              field.onChange(newDate);
                            }}
                            className="w-full"
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={addForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Event location" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Event description" 
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="URL for event image" 
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value || null)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-purple-600 hover:bg-purple-700"
                    disabled={addEventMutation.isPending}
                  >
                    {addEventMutation.isPending ? "Adding..." : "Add Event"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Edit Event Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
              <DialogDescription>
                Update event details for {selectedEvent?.title}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-6">
                <FormField
                  control={editForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter event title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={field.value}
                          onChange={field.onChange}
                        >
                          <option value="">Select a category</option>
                          {eventCategories.map((category) => (
                            <option key={category} value={category}>
                              {category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ')}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={editForm.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date & Time</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={
                                  "w-full pl-3 text-left font-normal " +
                                  (!field.value && "text-muted-foreground")
                                }
                              >
                                {field.value ? (
                                  formatDate(field.value)
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        {/* Time picker */}
                        <div className="mt-2">
                          <Input
                            type="time"
                            value={field.value ? new Date(field.value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : ''}
                            onChange={(e) => {
                              const [hours, minutes] = e.target.value.split(':');
                              const newDate = new Date(field.value);
                              newDate.setHours(parseInt(hours), parseInt(minutes));
                              field.onChange(newDate);
                            }}
                            className="w-full"
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date & Time</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={
                                  "w-full pl-3 text-left font-normal " +
                                  (!field.value && "text-muted-foreground")
                                }
                              >
                                {field.value ? (
                                  formatDate(field.value)
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        {/* Time picker */}
                        <div className="mt-2">
                          <Input
                            type="time"
                            value={field.value ? new Date(field.value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : ''}
                            onChange={(e) => {
                              const [hours, minutes] = e.target.value.split(':');
                              const newDate = new Date(field.value);
                              newDate.setHours(parseInt(hours), parseInt(minutes));
                              field.onChange(newDate);
                            }}
                            className="w-full"
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={editForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Event location" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Event description" 
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="URL for event image" 
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value || null)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-purple-600 hover:bg-purple-700"
                    disabled={editEventMutation.isPending}
                  >
                    {editEventMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the event "{selectedEvent?.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDelete}
                disabled={deleteEventMutation.isPending}
              >
                {deleteEventMutation.isPending ? "Deleting..." : "Delete Event"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default EventManager;