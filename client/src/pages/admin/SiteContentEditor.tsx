import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { SiteContent, InsertSiteContent } from "@shared/schema";
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PlusCircle,
  Pencil,
  FileText,
  HomeIcon,
  User,
  Clock,
  MapPin,
  Phone,
  Edit,
  LayoutTemplate,
  Layers,
  Heart
} from "lucide-react";

// Define content sections
const contentSections = [
  { id: "home", label: "Home Page", icon: <HomeIcon className="h-4 w-4" /> },
  { id: "about", label: "About Us", icon: <User className="h-4 w-4" /> },
  { id: "services", label: "Service Times", icon: <Clock className="h-4 w-4" /> },
  { id: "contact", label: "Contact Info", icon: <Phone className="h-4 w-4" /> },
  { id: "footer", label: "Footer", icon: <LayoutTemplate className="h-4 w-4" /> },
  { id: "misc", label: "Miscellaneous", icon: <Layers className="h-4 w-4" /> },
];

const siteContentSchema = z.object({
  section: z.string().min(1, { message: "Section is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  content: z.string().min(1, { message: "Content is required" }),
  description: z.string().optional(),
});

type SiteContentForm = z.infer<typeof siteContentSchema>;

const SiteContentEditor = () => {
  const [selectedSection, setSelectedSection] = useState<string>("home");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<SiteContent | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch site contents
  const { data: allSiteContents, isLoading: loadingAll } = useQuery<SiteContent[]>({
    queryKey: ["/api/site-contents"],
  });

  // Filter contents by section
  const sectionContents = allSiteContents?.filter(content => content.section === selectedSection) || [];

  // Form for editing content
  const editForm = useForm<SiteContentForm>({
    resolver: zodResolver(siteContentSchema),
    defaultValues: {
      section: "",
      name: "",
      content: "",
      description: "",
    },
  });

  // Form for adding new content
  const addForm = useForm<SiteContentForm>({
    resolver: zodResolver(siteContentSchema),
    defaultValues: {
      section: selectedSection,
      name: "",
      content: "",
      description: "",
    },
  });

  // Update when selected section changes
  useEffect(() => {
    addForm.setValue("section", selectedSection);
  }, [selectedSection, addForm]);

  // Update content mutation
  const updateContentMutation = useMutation({
    mutationFn: (data: SiteContentForm) => {
      return apiRequest("POST", "/api/site-contents", data);
    },
    onSuccess: () => {
      toast({
        title: "Content Updated",
        description: "The site content has been updated successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/site-contents"] });
      setIsEditDialogOpen(false);
      setSelectedContent(null);
      editForm.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "There was an error updating the content. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Add content mutation
  const addContentMutation = useMutation({
    mutationFn: (data: SiteContentForm) => {
      return apiRequest("POST", "/api/site-contents", data);
    },
    onSuccess: () => {
      toast({
        title: "Content Added",
        description: "The new site content has been added successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/site-contents"] });
      setIsAddDialogOpen(false);
      addForm.reset({
        section: selectedSection,
        name: "",
        content: "",
        description: "",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "There was an error adding the content. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (content: SiteContent) => {
    setSelectedContent(content);
    editForm.reset({
      section: content.section,
      name: content.name,
      content: content.content,
      description: content.description || "",
    });
    setIsEditDialogOpen(true);
  };

  const onEditSubmit = (data: SiteContentForm) => {
    updateContentMutation.mutate(data);
  };

  const onAddSubmit = (data: SiteContentForm) => {
    addContentMutation.mutate(data);
  };

  // Helper function to parse JSON content if needed
  const formatContentPreview = (content: string): string => {
    try {
      // If content is JSON, we'll display a message
      JSON.parse(content);
      return "[Complex structured content]";
    } catch (e) {
      // If it's not JSON, just show the first 100 characters
      return content.length > 100 ? content.substring(0, 100) + "..." : content;
    }
  };

  // Get the appropriate icon for content based on its name
  const getContentIcon = (name: string) => {
    if (name.includes("hero")) return <Layers className="h-4 w-4" />;
    if (name.includes("text") || name.includes("description")) return <FileText className="h-4 w-4" />;
    if (name.includes("address") || name.includes("location")) return <MapPin className="h-4 w-4" />;
    if (name.includes("time") || name.includes("schedule")) return <Clock className="h-4 w-4" />;
    if (name.includes("contact")) return <Phone className="h-4 w-4" />;
    if (name.includes("about")) return <User className="h-4 w-4" />;
    if (name.includes("mission") || name.includes("vision") || name.includes("values")) return <Heart className="h-4 w-4" />;
    return <Edit className="h-4 w-4" />;
  };

  return (
    <>
      <Helmet>
        <title>Site Content Editor - Grace Community Church</title>
      </Helmet>

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Site Content Editor</h1>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Content
          </Button>
        </div>

        <p className="text-slate-500 mb-6">
          Manage website content such as hero sections, text blocks, contact information, and more.
          Changes made here will be reflected on the live website immediately.
        </p>

        <Tabs value={selectedSection} onValueChange={setSelectedSection} className="space-y-6">
          <TabsList className="flex-wrap">
            {contentSections.map(section => (
              <TabsTrigger key={section.id} value={section.id} className="flex items-center">
                {section.icon}
                <span className="ml-2">{section.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {contentSections.map(section => (
            <TabsContent key={section.id} value={section.id}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loadingAll ? (
                  // Loading skeleton
                  Array(3).fill(0).map((_, i) => (
                    <Card key={i}>
                      <CardHeader>
                        <Skeleton className="h-5 w-2/3 mb-1" />
                        <Skeleton className="h-4 w-1/2" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-24 w-full" />
                      </CardContent>
                    </Card>
                  ))
                ) : sectionContents.length === 0 ? (
                  <div className="col-span-full">
                    <Card className="bg-slate-50">
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <p className="text-slate-500 mb-4">No content found for this section</p>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsAddDialogOpen(true)}
                        >
                          Add your first content item
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  sectionContents.map(content => (
                    <Card key={`${content.section}-${content.name}`}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center">
                              {getContentIcon(content.name)}
                              <span className="ml-2 capitalize">{content.name.replace(/_/g, ' ')}</span>
                            </CardTitle>
                            {content.description && (
                              <CardDescription>{content.description}</CardDescription>
                            )}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEdit(content)}
                            title="Edit this content"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-slate-700">
                          <p>{formatContentPreview(content.content)}</p>
                        </div>
                        <div className="text-xs text-slate-500 mt-4">
                          Last updated: {formatDate(content.updatedAt)}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Edit Content Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Content</DialogTitle>
              <DialogDescription>
                Update website content for {selectedContent?.section}/{selectedContent?.name}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={editForm.control}
                    name="section"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Section</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                          disabled
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select section" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {contentSections.map(section => (
                              <SelectItem key={section.id} value={section.id}>
                                <div className="flex items-center">
                                  {section.icon}
                                  <span className="ml-2">{section.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The website section this content belongs to
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content Name</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                        <FormDescription>
                          Unique identifier for this content
                        </FormDescription>
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
                        <Input {...field} placeholder="Brief description of this content" />
                      </FormControl>
                      <FormDescription>
                        Internal description to help identify the purpose of this content
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Enter content here" 
                          rows={10}
                        />
                      </FormControl>
                      <FormDescription>
                        For complex content, use JSON format for structured data
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
                    disabled={updateContentMutation.isPending}
                  >
                    {updateContentMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Add Content Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Content</DialogTitle>
              <DialogDescription>
                Create new website content for your church website
              </DialogDescription>
            </DialogHeader>
            
            <Form {...addForm}>
              <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={addForm.control}
                    name="section"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Section</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select section" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {contentSections.map(section => (
                              <SelectItem key={section.id} value={section.id}>
                                <div className="flex items-center">
                                  {section.icon}
                                  <span className="ml-2">{section.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The website section this content belongs to
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={addForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., hero_text, contact_info" />
                        </FormControl>
                        <FormDescription>
                          Unique identifier for this content (use lowercase with underscores)
                        </FormDescription>
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
                        <Input {...field} placeholder="Brief description of this content" />
                      </FormControl>
                      <FormDescription>
                        Internal description to help identify the purpose of this content
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Enter content here" 
                          rows={10}
                        />
                      </FormControl>
                      <FormDescription>
                        For complex content, use JSON format (e.g., {`{"title": "Welcome", "text": "Hello!"}`})
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
                    disabled={addContentMutation.isPending}
                  >
                    {addContentMutation.isPending ? "Adding..." : "Add Content"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default SiteContentEditor;