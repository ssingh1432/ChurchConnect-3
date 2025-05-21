import { useState } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Donation } from "@shared/schema";

const donationFormSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  amount: z.string().min(1, { message: "Amount is required" }),
  frequency: z.string().min(1, { message: "Frequency is required" }),
  paymentMethod: z.string().min(1, { message: "Payment method is required" }),
  project: z.string().default("general"),
  notes: z.string().optional(),
});

type DonationForm = z.infer<typeof donationFormSchema>;

const DonatePage = () => {
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user's donations if authenticated
  const { data: userDonations, isLoading: loadingDonations } = useQuery<Donation[]>({
    queryKey: ["/api/donations/me"],
    enabled: isAuthenticated,
  });

  const form = useForm<DonationForm>({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      name: user?.firstName && user?.lastName 
        ? `${user.firstName} ${user.lastName}` 
        : user?.firstName || user?.username || "",
      email: user?.email || "",
      amount: "",
      frequency: "one-time",
      paymentMethod: "credit-card",
      project: "general",
      notes: "",
    },
  });

  // Mutation for submitting donation
  const submitDonation = useMutation({
    mutationFn: (data: DonationForm) => {
      return apiRequest("POST", "/api/donations", data);
    },
    onSuccess: () => {
      toast({
        title: "Donation Submitted",
        description: "Thank you for your generous donation!",
        variant: "default",
      });
      form.reset({
        name: user?.firstName && user?.lastName 
          ? `${user.firstName} ${user.lastName}` 
          : user?.firstName || user?.username || "",
        email: user?.email || "",
        amount: "",
        frequency: "one-time",
        paymentMethod: "credit-card",
        project: "general",
        notes: "",
      });
      // Refresh user donations if authenticated
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ["/api/donations/me"] });
      }
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "There was an error processing your donation. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: DonationForm) => {
    submitDonation.mutate(data);
  };

  return (
    <>
      <Helmet>
        <title>Donate - Grace Community Church</title>
        <meta
          name="description"
          content="Support the mission and ministries of Grace Community Church through your generous donations."
        />
      </Helmet>

      <main>
        {/* Hero Section */}
        <section className="relative bg-slate-900 text-white py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/70">
            <img
              src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6"
              alt="Giving hands"
              className="w-full h-full object-cover mix-blend-overlay"
            />
          </div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Give to Our Church</h1>
              <p className="text-xl max-w-3xl mx-auto">
                Your generosity enables our church to carry out its mission and
                support ministries that make a difference in our community and
                around the world.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Giving Options Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              {isAuthenticated ? (
                <Tabs defaultValue="donate" className="w-full">
                  <TabsList className="mb-8">
                    <TabsTrigger value="donate">Make a Donation</TabsTrigger>
                    <TabsTrigger value="history">Donation History</TabsTrigger>
                  </TabsList>
                  <TabsContent value="donate">
                    <DonationForm 
                      form={form} 
                      onSubmit={onSubmit} 
                      isSubmitting={submitDonation.isPending} 
                    />
                  </TabsContent>
                  <TabsContent value="history">
                    <DonationHistory 
                      donations={userDonations} 
                      isLoading={loadingDonations} 
                    />
                  </TabsContent>
                </Tabs>
              ) : (
                <DonationForm 
                  form={form} 
                  onSubmit={onSubmit} 
                  isSubmitting={submitDonation.isPending} 
                />
              )}
            </div>
          </div>
        </section>

        {/* Ways to Give Section */}
        <section className="py-16 bg-slate-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-2">Ways to Give</h2>
              <div className="w-20 h-1 bg-purple-600 mx-auto mb-6"></div>
              <p className="text-slate-600 max-w-3xl mx-auto">
                In addition to online giving, there are other ways you can financially support our church.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* In-Person */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-lg mb-3 text-purple-700">Sunday Service</h3>
                <p className="text-slate-700">
                  Drop your offering in the collection plate during our Sunday worship services.
                </p>
              </div>
              
              {/* Mail */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-lg mb-3 text-purple-700">Mail a Check</h3>
                <p className="text-slate-700">
                  Send your donation by mail to:<br />
                  123 Church Street<br />
                  Cityville, State 12345
                </p>
              </div>
              
              {/* Planned Giving */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-lg mb-3 text-purple-700">Planned Giving</h3>
                <p className="text-slate-700">
                  Consider including our church in your will or estate planning.
                  Contact us for more information.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Impact of Giving Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-2">Your Impact</h2>
              <div className="w-20 h-1 bg-purple-600 mx-auto mb-6"></div>
              <p className="text-slate-600 max-w-3xl mx-auto">
                Here's how your donations are making a difference in our community and beyond.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">30%</div>
                <p className="text-slate-700 font-medium">Church Operations</p>
                <p className="text-slate-600 text-sm">Facilities, utilities, and staff</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">25%</div>
                <p className="text-slate-700 font-medium">Ministry Programs</p>
                <p className="text-slate-600 text-sm">Children, youth, and adult ministries</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">25%</div>
                <p className="text-slate-700 font-medium">Community Outreach</p>
                <p className="text-slate-600 text-sm">Local assistance and community events</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">20%</div>
                <p className="text-slate-700 font-medium">Missions</p>
                <p className="text-slate-600 text-sm">Global and domestic mission support</p>
              </div>
            </div>

            <div className="text-center mt-12">
              <p className="italic text-slate-600 max-w-3xl mx-auto mb-4">
                "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."
              </p>
              <p className="text-slate-700">— 2 Corinthians 9:7</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

interface DonationFormProps {
  form: any;
  onSubmit: (data: DonationForm) => void;
  isSubmitting: boolean;
}

const DonationForm = ({ form, onSubmit, isSubmitting }: DonationFormProps) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-6">Make a Donation</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Your name"
                        className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Your email"
                        className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Amount ($)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Donation amount"
                        className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Frequency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="one-time">One Time</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="project"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Fund/Project</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select fund" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="general">General Fund</SelectItem>
                        <SelectItem value="missions">Missions</SelectItem>
                        <SelectItem value="building">Building Fund</SelectItem>
                        <SelectItem value="youth">Youth Ministry</SelectItem>
                        <SelectItem value="outreach">Community Outreach</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Payment Method</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="credit-card">Credit Card</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-medium">Notes (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Additional notes about your donation"
                      className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                  </FormControl>
                  <FormDescription>
                    Include any special instructions or notes for this donation.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Complete Donation"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </motion.div>
  );
};

interface DonationHistoryProps {
  donations?: Donation[];
  isLoading: boolean;
}

const DonationHistory = ({ donations, isLoading }: DonationHistoryProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-3">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-6 w-24" />
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!donations || donations.length === 0) {
    return (
      <div className="text-center py-10 bg-slate-50 rounded-lg">
        <h3 className="text-xl font-medium text-slate-800 mb-2">
          No Donation History
        </h3>
        <p className="text-slate-600 mb-6">
          You haven't made any donations yet.
        </p>
        <Button variant="outline" onClick={() => document.querySelector('[data-value="donate"]')?.click()}>
          Make a Donation
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Your Donation History</h2>
      {donations.map((donation) => (
        <Card key={donation.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg">${donation.amount.toFixed(2)}</h3>
                <p className="text-slate-600 text-sm">
                  {donation.category && donation.category.charAt(0).toUpperCase() + donation.category.slice(1)} Fund
                </p>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded text-xs ${
                  donation.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : donation.status === 'pending' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-slate-100 text-slate-800'
                }`}>
                  {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                </span>
                <p className="text-slate-600 text-sm mt-1">
                  {donation.frequency.charAt(0).toUpperCase() + donation.frequency.slice(1)}
                </p>
              </div>
            </div>
            <p className="text-slate-700 text-sm mb-1">
              Donated on {formatDate(donation.createdAt)}
            </p>
            {donation.notes && (
              <p className="text-slate-600 text-sm italic">
                Notes: {donation.notes}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DonatePage;