import { useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { PrayerRequest } from "@shared/schema";
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
import { CheckCircle, Lock, Mail } from "lucide-react";

const PrayerRequestManager = () => {
  const [isAnswerDialogOpen, setIsAnswerDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<PrayerRequest | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch prayer requests
  const { data: prayerRequests, isLoading } = useQuery<PrayerRequest[]>({
    queryKey: ["/api/prayer-requests"],
  });

  // Filter prayer requests by status
  const pendingRequests = prayerRequests?.filter(request => !request.isAnswered) || [];
  const answeredRequests = prayerRequests?.filter(request => request.isAnswered) || [];

  // Mark prayer request as answered mutation
  const markAnsweredMutation = useMutation({
    mutationFn: (requestId: number) => {
      return apiRequest("PATCH", `/api/prayer-requests/${requestId}/answer`, { isAnswered: true });
    },
    onSuccess: () => {
      toast({
        title: "Prayer Request Updated",
        description: "The prayer request has been marked as answered.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/prayer-requests"] });
      setIsAnswerDialogOpen(false);
      setSelectedRequest(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "There was an error updating the prayer request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleMarkAnswered = (request: PrayerRequest) => {
    setSelectedRequest(request);
    setIsAnswerDialogOpen(true);
  };

  const confirmMarkAnswered = () => {
    if (selectedRequest) {
      markAnsweredMutation.mutate(selectedRequest.id);
    }
  };

  // Prayer request card component to avoid repetition
  const PrayerRequestCard = ({ request }: { request: PrayerRequest }) => (
    <Card key={request.id} className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{request.name}</CardTitle>
            <CardDescription>
              Submitted on {formatDate(request.createdAt)}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            {request.isPrivate && (
              <Badge variant="outline" className="flex items-center gap-1 text-amber-700 bg-amber-50">
                <Lock className="h-3 w-3" />
                Private
              </Badge>
            )}
            {request.isAnswered && (
              <Badge className="bg-green-100 text-green-800">
                Answered
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-slate-700 whitespace-pre-wrap">{request.request}</p>
        <div className="mt-4">
          <a 
            href={`mailto:${request.email}`} 
            className="text-sm text-slate-500 hover:text-slate-700 flex items-center"
          >
            <Mail className="h-3 w-3 mr-1" />
            {request.email}
          </a>
        </div>
      </CardContent>
      {!request.isAnswered && (
        <CardFooter className="border-t bg-slate-50 p-2">
          <div className="ml-auto">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={() => handleMarkAnswered(request)}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Mark as Answered
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );

  return (
    <>
      <Helmet>
        <title>Prayer Request Management - Grace Community Church</title>
      </Helmet>

      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Prayer Request Management</h1>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Requests</p>
                  <p className="text-3xl font-bold mt-1">
                    {isLoading ? (
                      <Skeleton className="h-9 w-12" />
                    ) : (
                      prayerRequests?.length || 0
                    )}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                  <span className="text-slate-600 text-xl">🙏</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Pending</p>
                  <p className="text-3xl font-bold mt-1">
                    {isLoading ? (
                      <Skeleton className="h-9 w-12" />
                    ) : (
                      pendingRequests.length
                    )}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <span className="text-amber-600 text-xl">⏳</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Answered</p>
                  <p className="text-3xl font-bold mt-1">
                    {isLoading ? (
                      <Skeleton className="h-9 w-12" />
                    ) : (
                      answeredRequests.length
                    )}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 text-xl">✓</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Prayer Request Tabs */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending" className="relative">
              Pending
              {pendingRequests.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                  {pendingRequests.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="answered">Answered</TabsTrigger>
            <TabsTrigger value="all">All Requests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="space-y-4">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))
            ) : pendingRequests.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="rounded-full bg-green-100 p-3 mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900">All Caught Up!</h3>
                  <p className="text-slate-500 mt-1">
                    There are no pending prayer requests to address.
                  </p>
                </CardContent>
              </Card>
            ) : (
              pendingRequests.map(request => (
                <PrayerRequestCard key={request.id} request={request} />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="answered" className="space-y-4">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))
            ) : answeredRequests.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-slate-500">
                    No answered prayer requests yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              answeredRequests.map(request => (
                <PrayerRequestCard key={request.id} request={request} />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="all" className="space-y-4">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))
            ) : !prayerRequests || prayerRequests.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-slate-500">
                    No prayer requests have been submitted yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              prayerRequests.map(request => (
                <PrayerRequestCard key={request.id} request={request} />
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Mark as Answered Dialog */}
        <Dialog open={isAnswerDialogOpen} onOpenChange={setIsAnswerDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Mark Prayer Request as Answered</DialogTitle>
              <DialogDescription>
                Are you confirming that this prayer request has been answered?
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="bg-slate-50 p-4 rounded-lg mb-4">
                <p className="font-medium">Request from {selectedRequest?.name}:</p>
                <p className="mt-2 text-slate-700">{selectedRequest?.request}</p>
              </div>
              <p className="text-sm text-slate-500">
                Marking a prayer request as answered will move it to the answered section and notify the person who submitted it.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAnswerDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={confirmMarkAnswered}
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={markAnsweredMutation.isPending}
              >
                {markAnsweredMutation.isPending ? "Processing..." : "Confirm Answer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default PrayerRequestManager;