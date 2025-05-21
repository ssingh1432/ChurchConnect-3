import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { Ministry, InsertMinistry } from "@shared/schema";
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
import { PlusCircle, Pencil, Trash2, Users, Clock } from "lucide-react";

// Extended schema with validation
const ministryFormSchema = z.object({
  title: z.string().min(2, { message: "Title is required" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  imageUrl: z.string().url({ message: "Must be a valid URL" }).nullable().optional(),
  schedule: z.string().nullable().optional(),
});

type MinistryForm = z.infer<typeof ministryFormSchema>;

const MinistryManager = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMinistry, setSelectedMinistry] = useState<Ministry | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch ministries
  const { data: ministries, isLoading } = useQuery<Ministry[]>({
    queryKey: ["/api/ministries"],
  });

  // Form for adding new ministries
  const addForm = useForm<MinistryForm>({
    resolver: zodResolver(ministryFormSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      schedule: "",
    },
  });

  // Form for editing ministries
  const editForm = useForm<MinistryForm>({
    resolver: zodResolver(ministryFormSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      schedule: "",
    },
  });

  // Add ministry mutation
  const addMinistryMutation = useMutation({
    mutationFn: (data: MinistryForm) => {
      return apiRequest("POST", "/api/ministries", data);
    },
    onSuccess: () => {
      toast({
        title: "Ministry Added",
        description: "The ministry has been added successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/ministries"] });
      setIsAddDialogOpen(false);
      addForm.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "There was an error adding the ministry. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Edit ministry mutation
  const editMinistryMutation = useMutation({
    mutationFn: (data: MinistryForm & { id: number }) => {
      const { id, ...updateData } = data;
      return apiRequest("PATCH", `/api/ministries/${id}`, updateData);
    },
    onSuccess: () => {
      toast({
        title: "Ministry Updated",
        description: "The ministry has been updated successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/ministries"] });
      setIsEditDialogOpen(false);
      setSelectedMinistry(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "There was an error updating the ministry. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete ministry mutation
  const deleteMinistryMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest("DELETE", `/api/ministries/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Ministry Deleted",
        description: "The ministry has been deleted successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/ministries"] });
      setIsDeleteDialogOpen(false);
      setSelectedMinistry(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "There was an error deleting the ministry. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle form submissions
  const onAddSubmit = (data: MinistryForm) => {
    addMinistryMutation.mutate(data);
  };

  const onEditSubmit = (data: MinistryForm) => {
    if (selectedMinistry) {
      editMinistryMutation.mutate({ ...data, id: selectedMinistry.id });
    }
  };

  const handleEdit = (ministry: Ministry) => {
    setSelectedMinistry(ministry);
    editForm.reset({
      title: ministry.title,
      description: ministry.description,
      imageUrl: ministry.imageUrl,
      schedule: ministry.schedule,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (ministry: Ministry) => {
    setSelectedMinistry(ministry);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedMinistry) {
      deleteMinistryMutation.mutate(selectedMinistry.id);
    }
  };

  // Helper to truncate long descriptions
  const truncateDescription = (text: string, maxLength = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <>
      <Helmet>
        <title>Ministry Management - Grace Community Church</title>
      </Helmet>

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Ministry Management</h1>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Ministry
          </Button>
        </div>
        
        {/* Ministry statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Ministries</p>
                  <p className="text-3xl font-bold mt-1">
                    {isLoading ? <Skeleton className="h-9 w-12" /> : ministries?.length || 0}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ministries List */}
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
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            ))
          ) : !ministries || ministries.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-500 mb-4">No ministries found</p>
              <Button 
                variant="outline" 
                onClick={() => setIsAddDialogOpen(true)}
              >
                Add your first ministry
              </Button>
            </div>
          ) : (
            ministries.map(ministry => (
              <Card key={ministry.id} className="overflow-hidden flex flex-col">
                <div className="aspect-video bg-slate-100 relative overflow-hidden">
                  {ministry.imageUrl ? (
                    <img 
                      src={ministry.imageUrl} 
                      alt={ministry.title} 
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Ministry";
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                      <Users className="h-12 w-12 mb-2" />
                      <p className="text-sm">No image</p>
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{ministry.title}</CardTitle>
                  {ministry.schedule && (
                    <CardDescription className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {ministry.schedule}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="pb-3 flex-grow">
                  <p className="text-sm text-slate-600">
                    {truncateDescription(ministry.description)}
                  </p>
                </CardContent>
                <CardFooter className="border-t bg-slate-50 p-2 mt-auto">
                  <div className="flex space-x-2 w-full justify-end">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(ministry)}>
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(ministry)}
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

        {/* Add Ministry Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Ministry</DialogTitle>
              <DialogDescription>
                Create a new ministry area for the church website.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...addForm}>
              <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-6">
                <FormField
                  control={addForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ministry Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter ministry name" />
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
                          placeholder="Ministry description" 
                          rows={5}
                        />
                      </FormControl>
                      <FormDescription>
                        Describe what this ministry does, who it's for, and how to get involved.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="schedule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meeting Schedule (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="e.g., Sundays at 9:30 AM" 
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value || null)}
                        />
                      </FormControl>
                      <FormDescription>
                        When does this ministry typically meet?
                      </FormDescription>
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
                          placeholder="URL for ministry image" 
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value || null)}
                        />
                      </FormControl>
                      <FormDescription>
                        A photo representing this ministry
                      </FormDescription>
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
                    disabled={addMinistryMutation.isPending}
                  >
                    {addMinistryMutation.isPending ? "Adding..." : "Add Ministry"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Edit Ministry Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Ministry</DialogTitle>
              <DialogDescription>
                Update ministry details for {selectedMinistry?.title}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-6">
                <FormField
                  control={editForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ministry Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter ministry name" />
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
                          placeholder="Ministry description" 
                          rows={5}
                        />
                      </FormControl>
                      <FormDescription>
                        Describe what this ministry does, who it's for, and how to get involved.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="schedule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meeting Schedule (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="e.g., Sundays at 9:30 AM" 
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value || null)}
                        />
                      </FormControl>
                      <FormDescription>
                        When does this ministry typically meet?
                      </FormDescription>
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
                          placeholder="URL for ministry image" 
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value || null)}
                        />
                      </FormControl>
                      <FormDescription>
                        A photo representing this ministry
                      </FormDescription>
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
                    disabled={editMinistryMutation.isPending}
                  >
                    {editMinistryMutation.isPending ? "Saving..." : "Save Changes"}
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
                Are you sure you want to delete the ministry "{selectedMinistry?.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDelete}
                disabled={deleteMinistryMutation.isPending}
              >
                {deleteMinistryMutation.isPending ? "Deleting..." : "Delete Ministry"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default MinistryManager;