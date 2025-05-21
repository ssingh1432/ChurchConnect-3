import { useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { Donation } from "@shared/schema";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Mail, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock,
  Download
} from "lucide-react";

const paymentStatusOptions = [
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "completed", label: "Completed", color: "bg-green-100 text-green-800" },
  { value: "failed", label: "Failed", color: "bg-red-100 text-red-800" },
  { value: "refunded", label: "Refunded", color: "bg-blue-100 text-blue-800" },
];

const DonationManager = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch donations
  const { data: donations, isLoading } = useQuery<Donation[]>({
    queryKey: ["/api/donations"],
  });

  // Filter donations by status if not "all"
  const filteredDonations = selectedStatus === "all"
    ? donations
    : donations?.filter(donation => donation.status === selectedStatus);

  // Update donation status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ donationId, status }: { donationId: number; status: string }) => {
      return apiRequest("PATCH", `/api/donations/${donationId}/status`, { status });
    },
    onSuccess: () => {
      toast({
        title: "Status Updated",
        description: "The donation status has been updated successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/donations"] });
      setUpdateStatusDialogOpen(false);
      setSelectedDonation(null);
      setNewStatus("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "There was an error updating the donation status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleUpdateStatus = (donation: Donation) => {
    setSelectedDonation(donation);
    setNewStatus(donation.status);
    setUpdateStatusDialogOpen(true);
  };

  const confirmUpdateStatus = () => {
    if (selectedDonation && newStatus) {
      updateStatusMutation.mutate({ donationId: selectedDonation.id, status: newStatus });
    }
  };

  // Status badge styling
  const getStatusBadgeStyle = (status: string): string => {
    const statusOption = paymentStatusOptions.find(option => option.value === status);
    return statusOption?.color || "bg-slate-100 text-slate-800";
  };

  // Group donations by payment method for statistics
  const getPaymentMethodStats = () => {
    if (!donations) return [];
    
    const methodCounts: Record<string, number> = {};
    const methodAmounts: Record<string, number> = {};
    
    donations.forEach(donation => {
      const method = donation.paymentMethod;
      if (!methodCounts[method]) {
        methodCounts[method] = 0;
        methodAmounts[method] = 0;
      }
      methodCounts[method]++;
      methodAmounts[method] += donation.amount;
    });
    
    return Object.keys(methodCounts).map(method => ({
      method,
      count: methodCounts[method],
      amount: methodAmounts[method]
    }));
  };

  // Calculate total donations by status
  const getTotalsByStatus = () => {
    if (!donations) return {};
    
    const totals: Record<string, { count: number, amount: number }> = {};
    
    donations.forEach(donation => {
      const status = donation.status;
      if (!totals[status]) {
        totals[status] = { count: 0, amount: 0 };
      }
      totals[status].count++;
      totals[status].amount += donation.amount;
    });
    
    return totals;
  };

  // Get payment method icon
  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "credit-card":
        return <DollarSign className="h-4 w-4 text-purple-600" />;
      case "paypal":
        return <DollarSign className="h-4 w-4 text-blue-600" />;
      case "bank-transfer":
        return <DollarSign className="h-4 w-4 text-green-600" />;
      default:
        return <DollarSign className="h-4 w-4 text-slate-600" />;
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "refunded":
        return <Download className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-slate-600" />;
    }
  };

  // Calculate total amounts and counts
  const totalAmount = donations?.reduce((sum, donation) => sum + donation.amount, 0) || 0;
  const completedAmount = donations?.filter(d => d.status === "completed").reduce((sum, donation) => sum + donation.amount, 0) || 0;
  const statusTotals = getTotalsByStatus();
  const paymentMethodStats = getPaymentMethodStats();

  return (
    <>
      <Helmet>
        <title>Donation Management - Grace Community Church</title>
      </Helmet>

      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Donation Management</h1>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Donations</p>
                  <p className="text-3xl font-bold mt-1">
                    {isLoading ? (
                      <Skeleton className="h-9 w-24" />
                    ) : (
                      `$${totalAmount.toFixed(2)}`
                    )}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {isLoading ? (
                      <Skeleton className="h-4 w-16" />
                    ) : (
                      `${donations?.length || 0} transactions`
                    )}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Completed</p>
                  <p className="text-3xl font-bold mt-1">
                    {isLoading ? (
                      <Skeleton className="h-9 w-24" />
                    ) : (
                      `$${completedAmount.toFixed(2)}`
                    )}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {isLoading ? (
                      <Skeleton className="h-4 w-16" />
                    ) : (
                      `${statusTotals.completed?.count || 0} transactions`
                    )}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
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
                      <Skeleton className="h-9 w-24" />
                    ) : (
                      `$${(statusTotals.pending?.amount || 0).toFixed(2)}`
                    )}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {isLoading ? (
                      <Skeleton className="h-4 w-16" />
                    ) : (
                      `${statusTotals.pending?.count || 0} transactions`
                    )}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Payment Methods</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {isLoading ? (
                      <Skeleton className="h-6 w-full" />
                    ) : (
                      paymentMethodStats.map(stat => (
                        <div key={stat.method} className="flex items-center bg-slate-100 px-2 py-1 rounded text-xs">
                          {getPaymentMethodIcon(stat.method)}
                          <span className="ml-1 capitalize">{stat.method.replace('-', ' ')}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Donations List */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle>Donations</CardTitle>
            <CardDescription>
              Manage and track all donations received
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs value={selectedStatus} onValueChange={setSelectedStatus} className="space-y-4">
              <TabsList className="flex-wrap">
                <TabsTrigger value="all">All Donations</TabsTrigger>
                {paymentStatusOptions.map(status => (
                  <TabsTrigger key={status.value} value={status.value} className="flex items-center gap-1">
                    {getStatusIcon(status.value)}
                    <span>{status.label}</span>
                    {statusTotals[status.value]?.count > 0 && (
                      <Badge variant="outline" className="ml-1 h-5 px-1 text-xs">
                        {statusTotals[status.value]?.count}
                      </Badge>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value={selectedStatus} className="space-y-4">
                {isLoading ? (
                  <div className="space-y-4">
                    {Array(5).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : !filteredDonations || filteredDonations.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-lg">
                    <p className="text-slate-500">No donations found with the selected status</p>
                  </div>
                ) : (
                  <div className="overflow-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b bg-slate-50 text-left text-xs font-medium text-slate-500">
                          <th className="px-4 py-3">Donor</th>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Amount</th>
                          <th className="px-4 py-3">Payment Method</th>
                          <th className="px-4 py-3">Frequency</th>
                          <th className="px-4 py-3">Purpose</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDonations.map(donation => (
                          <tr key={donation.id} className="border-b text-sm hover:bg-slate-50">
                            <td className="px-4 py-3">
                              <div>
                                <p className="font-medium">
                                  {donation.name || "Anonymous"}
                                </p>
                                {donation.email && (
                                  <a 
                                    href={`mailto:${donation.email}`} 
                                    className="text-xs text-slate-500 flex items-center hover:text-slate-700"
                                  >
                                    <Mail className="h-3 w-3 mr-1" />
                                    {donation.email}
                                  </a>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-slate-500">
                              {formatDate(donation.createdAt)}
                            </td>
                            <td className="px-4 py-3 font-medium">
                              ${donation.amount.toFixed(2)}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                {getPaymentMethodIcon(donation.paymentMethod)}
                                <span className="ml-1 capitalize text-slate-600">
                                  {donation.paymentMethod.replace('-', ' ')}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-slate-600 capitalize">
                              {donation.frequency || "One-time"}
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                              {donation.project || "General Fund"}
                            </td>
                            <td className="px-4 py-3">
                              <Badge className={getStatusBadgeStyle(donation.status)}>
                                {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleUpdateStatus(donation)}
                              >
                                Update Status
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Update Status Dialog */}
        <Dialog open={updateStatusDialogOpen} onOpenChange={setUpdateStatusDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Donation Status</DialogTitle>
              <DialogDescription>
                Change the status of this donation to reflect its current state.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="mb-4 space-y-1">
                <p className="text-sm font-medium text-slate-700">
                  ${selectedDonation?.amount.toFixed(2)} - {selectedDonation?.name || "Anonymous"}
                </p>
                <p className="text-xs text-slate-500">
                  {selectedDonation?.project || "General Fund"} ({selectedDonation?.paymentMethod.replace('-', ' ')})
                </p>
                <p className="text-xs text-slate-500">
                  Submitted on {selectedDonation ? formatDate(selectedDonation.createdAt) : ""}
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={newStatus}
                  onValueChange={setNewStatus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentStatusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center">
                          {getStatusIcon(option.value)}
                          <span className="ml-2">{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setUpdateStatusDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={confirmUpdateStatus}
                className="bg-purple-600 hover:bg-purple-700"
                disabled={updateStatusMutation.isPending || newStatus === selectedDonation?.status}
              >
                {updateStatusMutation.isPending ? "Updating..." : "Update Status"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default DonationManager;