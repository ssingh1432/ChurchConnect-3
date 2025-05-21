import { useState } from "react";
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
import { CalendarIcon, PlusCircle, Pencil, Trash2, PlayCircle, FileText, FileAudio } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Extended schema with validation
const sermonFormSchema = z.object({
  title: z.string().min(2, { message: "Title is required" }),
  description: z.string().optional(),
  speaker: z.string().min(2, { message: "Speaker name is required" }),
  date: z.date({ required_error: "Date is required" }),
  topic: z.string().optional(),
  videoUrl: z.string().optional(),
  audioUrl: z.string().optional(),
  notesUrl: z.string().optional(),
  thumbnailUrl: z.string().optional(),
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
      description: sermon.description || "",
      speaker: sermon.speaker,
      date: new Date(sermon.date),
      topic: sermon.topic || "",
      videoUrl: sermon.videoUrl || "",
      audioUrl: sermon.audioUrl || "",
      notesUrl: sermon.notesUrl || "",
      thumbnailUrl: sermon.thumbnailUrl || "",
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

        {/* Sermon List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isLoading ? (
            // Loading skeletons
            Array(4).fill(0).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-0">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-16 w-full mb-4" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : !sermons || sermons.length === 0 ? (
            <div className="col-span-2 text-center py-12">
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
              <Card key={sermon.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="line-clamp-1">{sermon.title}</CardTitle>
                      <CardDescription>
                        {formatDate(sermon.date)} • {sermon.speaker}
                      </CardDescription>
                    </div>
                    {sermon.topic && (
                      <span className="inline-block px-2 py-1 bg-slate-100 text-slate-800 text-xs rounded-full">
                        {sermon.topic}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {sermon.description && (
                    <p className="text-slate-700 mb-4 line-clamp-2">{sermon.description}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    {sermon.videoUrl && (
                      <a 
                        href={sermon.videoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-2 py-1 bg-red-50 text-red-600 text-xs rounded hover:bg-red-100"
                      >
                        <PlayCircle className="h-3 w-3 mr-1" />
                        Video
                      </a>
                    )}
                    {sermon.audioUrl && (
                      <a 
                        href={sermon.audioUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded hover:bg-blue-100"
                      >
                        <FileAudio className="h-3 w-3 mr-1" />
                        Audio
                      </a>
                    )}
                    {sermon.notesUrl && (
                      <a 
                        href={sermon.notesUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-2 py-1 bg-green-50 text-green-600 text-xs rounded hover:bg-green-100"
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Notes
                      </a>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-slate-50 flex justify-end space-x-2 p-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(sermon)}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(sermon)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
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
                Add a new sermon with details and media links.
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
                          <Input {...field} placeholder="Speaker name" />
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
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={
                                  "w-full pl-3 text-left font-normal"
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
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Sermon description" 
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
                      <FormLabel>Topic/Category (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="E.g., Faith, Prayer, Love" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={addForm.control}
                    name="videoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Video URL (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Link to sermon video" />
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
                        <FormLabel>Audio URL (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Link to sermon audio" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={addForm.control}
                    name="notesUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes URL (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Link to sermon notes" />
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
                        <FormLabel>Thumbnail URL (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Link to sermon thumbnail" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                          <Input {...field} placeholder="Speaker name" />
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
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={
                                  "w-full pl-3 text-left font-normal"
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
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Sermon description" 
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
                      <FormLabel>Topic/Category (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="E.g., Faith, Prayer, Love" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={editForm.control}
                    name="videoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Video URL (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Link to sermon video" />
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
                        <FormLabel>Audio URL (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Link to sermon audio" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={editForm.control}
                    name="notesUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes URL (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Link to sermon notes" />
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
                        <FormLabel>Thumbnail URL (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Link to sermon thumbnail" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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