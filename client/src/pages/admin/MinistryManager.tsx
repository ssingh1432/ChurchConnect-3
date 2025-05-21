import { useState } from "react";
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
import { PlusCircle, Pencil, Trash2 } from "lucide-react";

// Extended schema with validation
const ministryFormSchema = z.object({
  title: z.string().min(2, { message: "Title is required" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  imageUrl: z.string().optional(),
  schedule: z.string().optional(),
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
      imageUrl: ministry.imageUrl || "",
      schedule: ministry.schedule || "",
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

        {/* Ministry List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isLoading ? (
            // Loading skeletons
            Array(4).fill(0).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-0">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-24 w-full mb-4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))
          ) : !ministries || ministries.length === 0 ? (
            <div className="col-span-2 text-center py-12">
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
              <Card key={ministry.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle>{ministry.title}</CardTitle>
                  {ministry.schedule && (
                    <CardDescription>
                      Schedule: {ministry.schedule}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 mb-4 line-clamp-3">{ministry.description}</p>
                  {ministry.imageUrl && (
                    <div className="aspect-video overflow-hidden rounded-md bg-slate-100 mt-2">
                      <img 
                        src={ministry.imageUrl} 
                        alt={ministry.title} 
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Ministry+Image";
                        }}
                      />
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t bg-slate-50 flex justify-end space-x-2 p-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(ministry)}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(ministry)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
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
                Create a new ministry for the church.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...addForm}>
              <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-6">
                <FormField
                  control={addForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ministry Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter ministry title" />
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
                          rows={4}
                        />
                      </FormControl>
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
                        <Input {...field} placeholder="E.g., Sundays at 9:30 AM" />
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
                        <Input {...field} placeholder="URL for ministry image" />
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
                Update the ministry details.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-6">
                <FormField
                  control={editForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ministry Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter ministry title" />
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
                          rows={4}
                        />
                      </FormControl>
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
                        <Input {...field} placeholder="E.g., Sundays at 9:30 AM" />
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
                        <Input {...field} placeholder="URL for ministry image" />
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