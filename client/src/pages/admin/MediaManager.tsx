import { useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { MediaAsset } from "@shared/schema";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Image, FileIcon, Video, File, Upload, Trash2, Copy, ExternalLink } from "lucide-react";

const mediaTypes = [
  { value: "image", label: "Images", icon: <Image className="h-4 w-4" /> },
  { value: "video", label: "Videos", icon: <Video className="h-4 w-4" /> },
  { value: "document", label: "Documents", icon: <FileIcon className="h-4 w-4" /> },
  { value: "audio", label: "Audio", icon: <File className="h-4 w-4" /> },
];

const MediaManager = () => {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadTags, setUploadTags] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch media assets
  const { data: mediaAssets, isLoading } = useQuery<MediaAsset[]>({
    queryKey: ["/api/media-assets"],
  });

  // Filter assets by type if not "all"
  const filteredAssets = selectedType === "all"
    ? mediaAssets
    : mediaAssets?.filter(asset => asset.type === selectedType);

  // Delete media asset mutation
  const deleteAssetMutation = useMutation({
    mutationFn: (assetId: number) => {
      return apiRequest("DELETE", `/api/media-assets/${assetId}`);
    },
    onSuccess: () => {
      toast({
        title: "Media Deleted",
        description: "The media asset has been deleted successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/media-assets"] });
      setDeleteDialogOpen(false);
      setSelectedAsset(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "There was an error deleting the media asset. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Upload media asset mutation (would use FormData in a real implementation)
  const uploadAssetMutation = useMutation({
    mutationFn: (data: { title: string, file: File, type: string, tags: string[] }) => {
      // In a real implementation, we would use FormData to upload the file to Cloudinary
      // For now, we'll simulate with a direct API request
      return apiRequest("POST", "/api/media-assets", {
        title: data.title,
        type: data.type,
        url: URL.createObjectURL(data.file), // This would be returned from Cloudinary in real implementation
        publicId: `demo_${Date.now()}`, // This would be from Cloudinary
        tags: data.tags
      });
    },
    onSuccess: () => {
      toast({
        title: "Media Uploaded",
        description: "The media asset has been uploaded successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/media-assets"] });
      setUploadDialogOpen(false);
      setUploadFile(null);
      setUploadTitle("");
      setUploadTags("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "There was an error uploading the media asset. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadFile(file);
      if (!uploadTitle) {
        // Set title based on filename if not already set
        setUploadTitle(file.name.split('.')[0]);
      }
    }
  };

  const handleUpload = () => {
    if (!uploadFile || !uploadTitle) {
      toast({
        title: "Validation Error",
        description: "Please provide a file and title for upload.",
        variant: "destructive",
      });
      return;
    }

    // Determine file type
    let type = "document";
    if (uploadFile.type.startsWith("image/")) {
      type = "image";
    } else if (uploadFile.type.startsWith("video/")) {
      type = "video";
    } else if (uploadFile.type.startsWith("audio/")) {
      type = "audio";
    }

    // Process tags
    const tags = uploadTags.split(',').map(tag => tag.trim()).filter(tag => tag);

    uploadAssetMutation.mutate({ title: uploadTitle, file: uploadFile, type, tags });
  };

  const handleDelete = (asset: MediaAsset) => {
    setSelectedAsset(asset);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedAsset) {
      deleteAssetMutation.mutate(selectedAsset.id);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Media URL copied to clipboard.",
      variant: "default",
    });
  };

  // Helper function to get icon for media type
  const getMediaTypeIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      case "audio":
        return <File className="h-4 w-4" />;
      default:
        return <FileIcon className="h-4 w-4" />;
    }
  };

  // Count assets by type
  const getAssetCounts = () => {
    if (!mediaAssets) return {};
    
    return mediaAssets.reduce((acc: Record<string, number>, asset) => {
      acc[asset.type] = (acc[asset.type] || 0) + 1;
      return acc;
    }, {});
  };

  const assetCounts = getAssetCounts();

  return (
    <>
      <Helmet>
        <title>Media Manager - Grace Community Church</title>
      </Helmet>

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Media Manager</h1>
          <Button 
            onClick={() => setUploadDialogOpen(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Media
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                <FileIcon className="h-5 w-5 text-slate-600" />
              </div>
              <p className="text-sm font-medium text-slate-500">Total Assets</p>
              <p className="text-2xl font-bold">
                {isLoading ? <Skeleton className="h-7 w-10" /> : mediaAssets?.length || 0}
              </p>
            </CardContent>
          </Card>
          
          {mediaTypes.map(type => (
            <Card key={type.value}>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                  {type.icon}
                </div>
                <p className="text-sm font-medium text-slate-500">{type.label}</p>
                <p className="text-2xl font-bold">
                  {isLoading ? <Skeleton className="h-7 w-10" /> : assetCounts[type.value] || 0}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Media Assets Browser */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle>Media Library</CardTitle>
            <CardDescription>
              Browse and manage uploaded media assets
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs value={selectedType} onValueChange={setSelectedType} className="space-y-4">
              <TabsList className="flex-wrap">
                <TabsTrigger value="all">All</TabsTrigger>
                {mediaTypes.map(type => (
                  <TabsTrigger key={type.value} value={type.value} className="flex items-center">
                    {type.icon}
                    <span className="ml-2">{type.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value={selectedType} className="space-y-4">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array(8).fill(0).map((_, i) => (
                      <Skeleton key={i} className="aspect-square w-full" />
                    ))}
                  </div>
                ) : !filteredAssets || filteredAssets.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-lg">
                    <p className="text-slate-500 mb-4">No media assets found</p>
                    <Button 
                      variant="outline" 
                      onClick={() => setUploadDialogOpen(true)}
                    >
                      Upload your first media
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {filteredAssets.map(asset => (
                      <Card key={asset.id} className="overflow-hidden">
                        <div className="aspect-square relative bg-slate-100 flex items-center justify-center">
                          {asset.type === 'image' ? (
                            <img 
                              src={asset.url} 
                              alt={asset.title} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://placehold.co/400?text=Image+Not+Found";
                              }}
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center">
                              {getMediaTypeIcon(asset.type)}
                              <p className="mt-2 text-sm text-slate-500">{asset.type}</p>
                            </div>
                          )}
                          
                          <div className="absolute top-2 right-2">
                            <Badge className="capitalize bg-slate-700 text-white">
                              {asset.type}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-3">
                          <h3 className="font-medium text-sm mb-1 truncate">{asset.title}</h3>
                          <p className="text-xs text-slate-500 mb-2">
                            Uploaded {formatDate(asset.uploadedAt)}
                          </p>
                          {asset.tags && asset.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {asset.tags.map((tag, i) => (
                                <Badge key={i} variant="outline" className="text-xs px-1 py-0">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="p-2 border-t bg-slate-50 flex justify-end space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => copyToClipboard(asset.url)}
                            title="Copy URL"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => window.open(asset.url, '_blank')}
                            title="Open"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(asset)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Upload Dialog */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Media</DialogTitle>
              <DialogDescription>
                Upload images, videos, or documents to your media library.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="file">Media File</Label>
                <div 
                  className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-slate-50 transition-colors ${
                    uploadFile ? 'border-purple-200 bg-purple-50' : 'border-slate-200'
                  }`}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  {uploadFile ? (
                    <div className="flex flex-col items-center">
                      {uploadFile.type.startsWith('image/') ? (
                        <img 
                          src={URL.createObjectURL(uploadFile)} 
                          alt="Preview" 
                          className="max-h-40 max-w-full mb-2 rounded" 
                        />
                      ) : (
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                          <FileIcon className="h-8 w-8 text-slate-400" />
                        </div>
                      )}
                      <p className="text-sm font-medium">{uploadFile.name}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {(uploadFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="h-10 w-10 text-slate-400 mb-2" />
                      <p className="text-sm font-medium">Click to upload or drag and drop</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Images, videos, documents (max 10MB)
                      </p>
                    </div>
                  )}
                  <input 
                    id="file-upload" 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileChange}
                    accept="image/*, video/*, audio/*, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  value={uploadTitle} 
                  onChange={(e) => setUploadTitle(e.target.value)} 
                  placeholder="Enter a title for this media"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input 
                  id="tags" 
                  value={uploadTags} 
                  onChange={(e) => setUploadTags(e.target.value)} 
                  placeholder="e.g., sermon, event, youth"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="button" 
                onClick={handleUpload}
                className="bg-purple-600 hover:bg-purple-700"
                disabled={uploadAssetMutation.isPending || !uploadFile}
              >
                {uploadAssetMutation.isPending ? "Uploading..." : "Upload"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Media Asset</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedAsset?.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {selectedAsset?.type === 'image' && (
                <div className="flex justify-center mb-4">
                  <img 
                    src={selectedAsset.url} 
                    alt={selectedAsset.title} 
                    className="max-h-40 rounded" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/400?text=Image+Not+Found";
                    }}
                  />
                </div>
              )}
              <p className="text-sm text-slate-500">
                This will permanently remove the file from your media library and any pages using this media may be affected.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDelete}
                disabled={deleteAssetMutation.isPending}
              >
                {deleteAssetMutation.isPending ? "Deleting..." : "Delete Media"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default MediaManager;