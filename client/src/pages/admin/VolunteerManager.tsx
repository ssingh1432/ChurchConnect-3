import { useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { Volunteer } from "@shared/schema";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  CheckCircle, 
  Phone, 
  Calendar, 
  Users, 
  XCircle, 
  Mail,
  Clock 
} from "lucide-react";

const VolunteerManager = () => {
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch volunteer applications
  const { data: volunteers, isLoading } = useQuery<Volunteer[]>({
    queryKey: ["/api/volunteers"],
  });

  // Filter volunteer applications by status
  const pendingVolunteers = volunteers?.filter(volunteer => !volunteer.isApproved) || [];
  const approvedVolunteers = volunteers?.filter(volunteer => volunteer.isApproved) || [];

  // Approve volunteer application mutation
  const approveVolunteerMutation = useMutation({
    mutationFn: (volunteerId: number) => {
      return apiRequest("PATCH", `/api/volunteers/${volunteerId}/approve`, { isApproved: true });
    },
    onSuccess: () => {
      toast({
        title: "Volunteer Approved",
        description: "The volunteer application has been approved.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/volunteers"] });
      setIsApproveDialogOpen(false);
      setSelectedVolunteer(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "There was an error approving the volunteer. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleApprove = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
    setIsApproveDialogOpen(true);
  };

  const confirmApprove = () => {
    if (selectedVolunteer) {
      approveVolunteerMutation.mutate(selectedVolunteer.id);
    }
  };

  // Ministry badge background colors
  const getMinistryColor = (ministry: string): string => {
    const colors: {[key: string]: string} = {
      "worship": "bg-blue-100 text-blue-800",
      "children": "bg-pink-100 text-pink-800",
      "youth": "bg-indigo-100 text-indigo-800",
      "hospitality": "bg-amber-100 text-amber-800",
      "media": "bg-purple-100 text-purple-800",
      "missions": "bg-green-100 text-green-800",
      "prayer": "bg-red-100 text-red-800",
      "outreach": "bg-cyan-100 text-cyan-800",
    };

    return colors[ministry.toLowerCase()] || "bg-slate-100 text-slate-800";
  };

  // Volunteer card component
  const VolunteerCard = ({ volunteer }: { volunteer: Volunteer }) => (
    <Card key={volunteer.id} className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{volunteer.name}</CardTitle>
            <CardDescription>
              Applied on {formatDate(volunteer.createdAt)}
            </CardDescription>
          </div>
          <div>
            <Badge className={getMinistryColor(volunteer.ministry)}>
              {volunteer.ministry}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="text-sm font-medium text-slate-500 mb-1">Contact Information</h4>
            <div className="space-y-1">
              <p className="text-sm flex items-center text-slate-700">
                <Mail className="h-3 w-3 mr-2" />
                <a href={`mailto:${volunteer.email}`} className="hover:underline">
                  {volunteer.email}
                </a>
              </p>
              {volunteer.phone && (
                <p className="text-sm flex items-center text-slate-700">
                  <Phone className="h-3 w-3 mr-2" />
                  <a href={`tel:${volunteer.phone}`} className="hover:underline">
                    {volunteer.phone}
                  </a>
                </p>
              )}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-slate-500 mb-1">Availability</h4>
            <p className="text-sm flex items-center text-slate-700">
              <Clock className="h-3 w-3 mr-2" />
              {volunteer.availability || "Not specified"}
            </p>
          </div>
        </div>
        
        {volunteer.experience && (
          <div className="mb-2">
            <h4 className="text-sm font-medium text-slate-500 mb-1">Experience & Skills</h4>
            <p className="text-sm text-slate-700 whitespace-pre-wrap">{volunteer.experience}</p>
          </div>
        )}

        {volunteer.isApproved && (
          <div className="mt-4 flex items-center text-green-600">
            <CheckCircle className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Approved Volunteer</span>
          </div>
        )}
      </CardContent>
      {!volunteer.isApproved && (
        <CardFooter className="border-t bg-slate-50 p-2">
          <div className="ml-auto">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={() => handleApprove(volunteer)}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Approve
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );

  return (
    <>
      <Helmet>
        <title>Volunteer Management - Grace Community Church</title>
      </Helmet>

      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Volunteer Management</h1>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Applications</p>
                  <p className="text-3xl font-bold mt-1">
                    {isLoading ? (
                      <Skeleton className="h-9 w-12" />
                    ) : (
                      volunteers?.length || 0
                    )}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-slate-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Pending Approval</p>
                  <p className="text-3xl font-bold mt-1">
                    {isLoading ? (
                      <Skeleton className="h-9 w-12" />
                    ) : (
                      pendingVolunteers.length
                    )}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Approved Volunteers</p>
                  <p className="text-3xl font-bold mt-1">
                    {isLoading ? (
                      <Skeleton className="h-9 w-12" />
                    ) : (
                      approvedVolunteers.length
                    )}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Volunteer Applications Tabs */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending" className="relative">
              Pending
              {pendingVolunteers.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                  {pendingVolunteers.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="all">All Volunteers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="space-y-4">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-56 w-full" />
              ))
            ) : pendingVolunteers.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="rounded-full bg-green-100 p-3 mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900">All Caught Up!</h3>
                  <p className="text-slate-500 mt-1">
                    There are no pending volunteer applications to review.
                  </p>
                </CardContent>
              </Card>
            ) : (
              pendingVolunteers.map(volunteer => (
                <VolunteerCard key={volunteer.id} volunteer={volunteer} />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="approved" className="space-y-4">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-56 w-full" />
              ))
            ) : approvedVolunteers.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-slate-500">
                    No volunteers have been approved yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              approvedVolunteers.map(volunteer => (
                <VolunteerCard key={volunteer.id} volunteer={volunteer} />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="all" className="space-y-4">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-56 w-full" />
              ))
            ) : !volunteers || volunteers.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-slate-500">
                    No volunteer applications have been submitted yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              volunteers.map(volunteer => (
                <VolunteerCard key={volunteer.id} volunteer={volunteer} />
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Approve Volunteer Dialog */}
        <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve Volunteer Application</DialogTitle>
              <DialogDescription>
                Confirm approval of volunteer application from {selectedVolunteer?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="bg-slate-50 p-4 rounded-lg mb-4">
                <p className="font-medium">
                  Ministry: <span className="font-normal">{selectedVolunteer?.ministry}</span>
                </p>
                {selectedVolunteer?.availability && (
                  <p className="font-medium mt-2">
                    Availability: <span className="font-normal">{selectedVolunteer?.availability}</span>
                  </p>
                )}
                {selectedVolunteer?.experience && (
                  <p className="font-medium mt-2">
                    Experience: 
                    <span className="font-normal block mt-1 text-slate-700">{selectedVolunteer?.experience}</span>
                  </p>
                )}
              </div>
              <p className="text-sm text-slate-500">
                Approving a volunteer will allow them to serve in their requested ministry area and notify them of their approval status.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={confirmApprove}
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={approveVolunteerMutation.isPending}
              >
                {approveVolunteerMutation.isPending ? "Processing..." : "Approve Volunteer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default VolunteerManager;