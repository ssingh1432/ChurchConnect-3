import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { Sermon, InsertSermon } from "@shared/schema";
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
import { CalendarIcon, PlusCircle, Pencil, Trash2, Video, FileText, PlayCircle, Headphones } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Sermon topic/categories
const sermonTopics = [
  "faith",
  "prayer",
  "worship",
  "family",
  "relationships",
  "discipleship",
  "evangelism",
  "leadership",
  "holy-spirit",
  "salvation",
  "missions",
  "biblical-studies",
  "special-events",
  "testimonies",
  "other"
];

// Extended schema with validation
const sermonFormSchema = z.object({
  title: z.string().min(2, { message: "Title is required" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }).nullable().optional(),
  speaker: z.string().min(2, { message: "Speaker name is required" }),
  date: z.date({ required_error: "Please select a date" }),
  topic: z.string().min(1, { message: "Topic is required" }).nullable().optional(),
  videoUrl: z.string().url({ message: "Must be a valid URL" }).nullable().optional(),
  audioUrl: z.string().url({ message: "Must be a valid URL" }).nullable().optional(),
  notesUrl: z.string().url({ message: "Must be a valid URL" }).nullable().optional(),
  thumbnailUrl: z.string().url({ message: "Must be a valid URL" }).nullable().optional(),
});

type SermonForm = z.infer<typeof sermonFormSchema>;

const SermonManager = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSermon, setSelectedSermon] = useState<Sermon | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch sermons
  const { data: sermons, isLoading } = useQuery<Sermon[]>({
    queryKey: ["/api/sermons"],
  });

  // Form for adding new sermons
  const addForm = useForm<SermonForm>({
    resolver: zodResolver(sermonFormSchema),
    defaultValues: {
      title: "",
      description: "",
      speaker: "",
      date: new Date(),
      topic: "",
      videoUrl: "",
      audioUrl: "",
      notesUrl: "",
      thumbnailUrl: "",
    },
  });

  // Form for editing sermons
  const editForm = useForm<SermonForm>({
    resolver: zodResolver(sermonFormSchema),
    defaultValues: {
      title: "",
      description: "",
      speaker: "",
      date: new Date(),
      topic: "",
      videoUrl: "",
      audioUrl: "",
      notesUrl: "",
      thumbnailUrl: "",
    },
  });

  // Add sermon mutation
  const addSermonMutation = useMutation({
    mutationFn: (data: SermonForm) => {
      return apiRequest("POST", "/api/sermons", data);
    },
    onSuccess: () => {
      toast({
        title: "Sermon Added",
        description: "The sermon has been added successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/sermons"] });
      setIsAddDialogOpen(false);
      addForm.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "There was an error adding the sermon. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Edit sermon mutation
  const editSermonMutation = useMutation({
    mutationFn: (data: SermonForm & { id: number }) => {
      const { id, ...updateData } = data;
      return apiRequest("PATCH", `/api/sermons/${id}`, updateData);
    },
    onSuccess: () => {
      toast({
        title: "Sermon Updated",
        description: "The sermon has been updated successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/sermons"] });
      setIsEditDialogOpen(false);
      setSelectedSermon(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "There was an error updating the sermon. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete sermon mutation
  const deleteSermonMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest("DELETE", `/api/sermons/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Sermon Deleted",
        description: "The sermon has been deleted successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/sermons"] });
      setIsDeleteDialogOpen(false);
      setSelectedSermon(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "There was an error deleting the sermon. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle form submissions
  const onAddSubmit = (data: SermonForm) => {
    addSermonMutation.mutate(data);
  };

  const onEditSubmit = (data: SermonForm) => {
    if (selectedSermon) {
      editSermonMutation.mutate({ ...data, id: selectedSermon.id });
    }
  };

  const handleEdit = (sermon: Sermon) => {
    setSelectedSermon(sermon);
    editForm.reset({
      title: sermon.title,
      description: sermon.description,
      speaker: sermon.speaker,
      date: new Date(sermon.date),
      topic: sermon.topic,
      videoUrl: sermon.videoUrl,
      audioUrl: sermon.audioUrl,
      notesUrl: sermon.notesUrl,
      thumbnailUrl: sermon.thumbnailUrl,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (sermon: Sermon) => {
    setSelectedSermon(sermon);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedSermon) {
      deleteSermonMutation.mutate(selectedSermon.id);
    }
  };

  // Check if sermon has media
  const hasMedia = (sermon: Sermon): boolean => {
    return !!(sermon.videoUrl || sermon.audioUrl || sermon.notesUrl);
  };

  return (
    <>
      <Helmet>
        <title>Sermon Management - Grace Community Church</title>
      </Helmet>

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Sermon Management</h1>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Sermon
          </Button>
        </div>
        
        {/* Sermon statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Sermons</p>
                  <p className="text-3xl font-bold mt-1">
                    {isLoading ? <Skeleton className="h-9 w-12" /> : sermons?.length || 0}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <PlayCircle className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">With Video</p>
                  <p className="text-3xl font-bold mt-1">
                    {isLoading ? (
                      <Skeleton className="h-9 w-12" />
                    ) : (
                      sermons?.filter(sermon => sermon.videoUrl).length || 0
                    )}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <Video className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">With Audio</p>
                  <p className="text-3xl font-bold mt-1">
                    {isLoading ? (
                      <Skeleton className="h-9 w-12" />
                    ) : (
                      sermons?.filter(sermon => sermon.audioUrl).length || 0
                    )}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Headphones className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sermon List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeletons
            Array(6).fill(0).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-video bg-slate-100">
                  <Skeleton className="h-full w-full" />
                </div>
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="pb-3">
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))
          ) : !sermons || sermons.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-500 mb-4">No sermons found</p>
              <Button 
                variant="outline" 
                onClick={() => setIsAddDialogOpen(true)}
              >
                Add your first sermon
              </Button>
            </div>
          ) : (
            sermons.map(sermon => (
              <Card key={sermon.id} className="overflow-hidden flex flex-col">
                <div className="aspect-video bg-slate-100 flex items-center justify-center relative">
                  {sermon.thumbnailUrl ? (
                    <img 
                      src={sermon.thumbnailUrl} 
                      alt={sermon.title} 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Sermon";
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <PlayCircle className="h-12 w-12 mb-2" />
                      <p className="text-sm">No thumbnail</p>
                    </div>
                  )}
                  {sermon.videoUrl && (
                    <a 
                      href={sermon.videoUrl} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <div className="bg-white rounded-full p-3">
                        <PlayCircle className="h-8 w-8 text-purple-600" />
                      </div>
                    </a>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{sermon.title}</CardTitle>
                      <CardDescription>
                        {sermon.speaker} • {formatDate(sermon.date)}
                      </CardDescription>
                    </div>
                    {sermon.topic && (
                      <Badge variant="outline" className="capitalize">
                        {sermon.topic.replace('-', ' ')}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pb-3 flex-grow">
                  {sermon.description && (
                    <p className="text-sm text-slate-600 line-clamp-3">
                      {sermon.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {sermon.videoUrl && (
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
                        <Video className="h-3 w-3 mr-1" />
                        Video
                      </Badge>
                    )}
                    {sermon.audioUrl && (
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                        <Headphones className="h-3 w-3 mr-1" />
                        Audio
                      </Badge>
                    )}
                    {sermon.notesUrl && (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                        <FileText className="h-3 w-3 mr-1" />
                        Notes
                      </Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-slate-50 p-2 mt-auto">
                  <div className="flex space-x-2 w-full justify-end">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(sermon)}>
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(sermon)}
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

        {/* Add Sermon Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Sermon</DialogTitle>
              <DialogDescription>
                Create a new sermon recording or message for the church website.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...addForm}>
              <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-6">
                <FormField
                  control={addForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sermon Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter sermon title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={addForm.control}
                    name="speaker"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Speaker</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Pastor's name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={addForm.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Sermon Date</FormLabel>
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
                              disabled={(date) => date > new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={addForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Brief description of the sermon" 
                          value={field.value || ""}
                          onChange={event => field.onChange(event.target.value || null)}
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic/Category</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={field.value || ""}
                          onChange={event => field.onChange(event.target.value || null)}
                        >
                          <option value="">Select a topic</option>
                          {sermonTopics.map((topic) => (
                            <option key={topic} value={topic}>
                              {topic.charAt(0).toUpperCase() + topic.slice(1).replace('-', ' ')}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Media Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={addForm.control}
                      name="videoUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Video URL</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="YouTube or Vimeo link" 
                              value={field.value || ""}
                              onChange={event => field.onChange(event.target.value || null)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={addForm.control}
                      name="audioUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Audio URL</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Audio file link" 
                              value={field.value || ""}
                              onChange={event => field.onChange(event.target.value || null)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={addForm.control}
                      name="notesUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes URL</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="PDF or document link" 
                              value={field.value || ""}
                              onChange={event => field.onChange(event.target.value || null)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={addForm.control}
                      name="thumbnailUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Thumbnail URL</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Image URL" 
                              value={field.value || ""}
                              onChange={event => field.onChange(event.target.value || null)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-purple-600 hover:bg-purple-700"
                    disabled={addSermonMutation.isPending}
                  >
                    {addSermonMutation.isPending ? "Adding..." : "Add Sermon"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Edit Sermon Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Sermon</DialogTitle>
              <DialogDescription>
                Update the sermon details and media links.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-6">
                <FormField
                  control={editForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sermon Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter sermon title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={editForm.control}
                    name="speaker"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Speaker</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Pastor's name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Sermon Date</FormLabel>
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
                              disabled={(date) => date > new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={editForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Brief description of the sermon" 
                          value={field.value || ""}
                          onChange={event => field.onChange(event.target.value || null)}
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic/Category</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={field.value || ""}
                          onChange={event => field.onChange(event.target.value || null)}
                        >
                          <option value="">Select a topic</option>
                          {sermonTopics.map((topic) => (
                            <option key={topic} value={topic}>
                              {topic.charAt(0).toUpperCase() + topic.slice(1).replace('-', ' ')}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Media Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={editForm.control}
                      name="videoUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Video URL</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="YouTube or Vimeo link" 
                              value={field.value || ""}
                              onChange={event => field.onChange(event.target.value || null)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={editForm.control}
                      name="audioUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Audio URL</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Audio file link" 
                              value={field.value || ""}
                              onChange={event => field.onChange(event.target.value || null)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={editForm.control}
                      name="notesUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes URL</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="PDF or document link" 
                              value={field.value || ""}
                              onChange={event => field.onChange(event.target.value || null)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={editForm.control}
                      name="thumbnailUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Thumbnail URL</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Image URL" 
                              value={field.value || ""}
                              onChange={event => field.onChange(event.target.value || null)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-purple-600 hover:bg-purple-700"
                    disabled={editSermonMutation.isPending}
                  >
                    {editSermonMutation.isPending ? "Saving..." : "Save Changes"}
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
                Are you sure you want to delete the sermon "{selectedSermon?.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDelete}
                disabled={deleteSermonMutation.isPending}
              >
                {deleteSermonMutation.isPending ? "Deleting..." : "Delete Sermon"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default SermonManager;