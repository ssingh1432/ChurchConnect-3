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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { PrayerRequest } from "@shared/schema";

const prayerRequestSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  request: z.string().min(10, { message: "Prayer request must be at least 10 characters" }),
  isPrivate: z.boolean().default(false),
});

type PrayerRequestForm = z.infer<typeof prayerRequestSchema>;

const PrayerRequestPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user's prayer requests if authenticated
  const { data: userPrayerRequests, isLoading: loadingUserRequests } = useQuery<PrayerRequest[]>({
    queryKey: ["/api/prayer-requests/me"],
    enabled: isAuthenticated,
  });

  const form = useForm<PrayerRequestForm>({
    resolver: zodResolver(prayerRequestSchema),
    defaultValues: {
      name: user?.firstName && user?.lastName 
        ? `${user.firstName} ${user.lastName}` 
        : user?.firstName || user?.username || "",
      email: user?.email || "",
      request: "",
      isPrivate: false,
    },
  });

  // Mutation for submitting prayer request
  const submitPrayerRequest = useMutation({
    mutationFn: (data: PrayerRequestForm) => {
      return apiRequest("POST", "/api/prayer-requests", data);
    },
    onSuccess: () => {
      toast({
        title: "Prayer Request Submitted",
        description: "Thank you for sharing your prayer request. Our team will be praying for you.",
        variant: "default",
      });
      form.reset({
        name: user?.firstName && user?.lastName 
          ? `${user.firstName} ${user.lastName}` 
          : user?.firstName || user?.username || "",
        email: user?.email || "",
        request: "",
        isPrivate: false,
      });
      // Refresh user prayer requests if authenticated
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ["/api/prayer-requests/me"] });
      }
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your prayer request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PrayerRequestForm) => {
    submitPrayerRequest.mutate(data);
  };

  return (
    <>
      <Helmet>
        <title>Prayer Requests - Grace Community Church</title>
        <meta
          name="description"
          content="Submit your prayer requests to Grace Community Church. Our prayer team is committed to praying for your needs."
        />
      </Helmet>

      <main>
        {/* Hero Section */}
        <section className="relative bg-slate-900 text-white py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/70">
            <img
              src="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9"
              alt="Person praying"
              className="w-full h-full object-cover mix-blend-overlay"
            />
          </div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Prayer Requests</h1>
              <p className="text-xl max-w-3xl mx-auto">
                Share your prayer needs with our church family. We believe in the
                power of prayer and are committed to lifting your requests to God.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Prayer Request Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              {isAuthenticated ? (
                <Tabs defaultValue="submit" className="w-full">
                  <TabsList className="mb-8">
                    <TabsTrigger value="submit">Submit Request</TabsTrigger>
                    <TabsTrigger value="my-requests">My Requests</TabsTrigger>
                  </TabsList>
                  <TabsContent value="submit">
                    <PrayerRequestForm 
                      form={form} 
                      onSubmit={onSubmit} 
                      isSubmitting={submitPrayerRequest.isPending} 
                    />
                  </TabsContent>
                  <TabsContent value="my-requests">
                    <UserPrayerRequests 
                      prayerRequests={userPrayerRequests} 
                      isLoading={loadingUserRequests} 
                    />
                  </TabsContent>
                </Tabs>
              ) : (
                <PrayerRequestForm 
                  form={form} 
                  onSubmit={onSubmit} 
                  isSubmitting={submitPrayerRequest.isPending} 
                />
              )}
            </div>
          </div>
        </section>

        {/* Scripture and Encouragement Section */}
        <section className="py-16 bg-slate-100">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">The Power of Prayer</h2>
              <div className="mb-8 italic text-slate-700 text-lg">
                "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus."
                <p className="mt-2 font-normal text-base">— Philippians 4:6-7</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-hands-praying text-purple-600"></i>
                  </div>
                  <h3 className="font-bold mb-2">Confidentiality</h3>
                  <p className="text-slate-600 text-sm">
                    Your prayer requests marked as private will only be seen by our pastoral team.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-users text-purple-600"></i>
                  </div>
                  <h3 className="font-bold mb-2">Prayer Team</h3>
                  <p className="text-slate-600 text-sm">
                    We have a dedicated team that prays for each request throughout the week.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-calendar-check text-purple-600"></i>
                  </div>
                  <h3 className="font-bold mb-2">Weekly Prayer</h3>
                  <p className="text-slate-600 text-sm">
                    Join us for our prayer meeting every Wednesday at 7:00 PM.
                  </p>
                </div>
              </div>
              <div className="text-slate-700">
                <p>
                  If you have an emergency prayer need, please call our office at (123) 456-7890.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

interface PrayerRequestFormProps {
  form: any;
  onSubmit: (data: PrayerRequestForm) => void;
  isSubmitting: boolean;
}

const PrayerRequestForm = ({ form, onSubmit, isSubmitting }: PrayerRequestFormProps) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-6">Submit Your Prayer Request</h2>
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

            <FormField
              control={form.control}
              name="request"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-medium">Prayer Request</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Share your prayer request here..."
                      className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPrivate"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Keep this request private (only seen by pastoral team)
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Prayer Request"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </motion.div>
  );
};

interface UserPrayerRequestsProps {
  prayerRequests?: PrayerRequest[];
  isLoading: boolean;
}

const UserPrayerRequests = ({ prayerRequests, isLoading }: UserPrayerRequestsProps) => {
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
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!prayerRequests || prayerRequests.length === 0) {
    return (
      <div className="text-center py-10 bg-slate-50 rounded-lg">
        <h3 className="text-xl font-medium text-slate-800 mb-2">
          No Prayer Requests Yet
        </h3>
        <p className="text-slate-600 mb-6">
          You haven't submitted any prayer requests yet.
        </p>
        <Button variant="outline" onClick={() => document.querySelector('[data-value="submit"]')?.click()}>
          Submit a Prayer Request
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Your Prayer Requests</h2>
      {prayerRequests.map((request) => (
        <Card key={request.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-lg">{request.name}</h3>
              <div className="flex items-center space-x-2">
                {request.isPrivate && (
                  <span className="bg-slate-200 text-slate-700 px-2 py-1 rounded text-xs">
                    Private
                  </span>
                )}
                {request.isAnswered && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    Answered
                  </span>
                )}
              </div>
            </div>
            <p className="text-slate-600 text-sm mb-2">
              Submitted on {formatDate(request.createdAt)}
            </p>
            <p className="text-slate-700">{request.request}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PrayerRequestPage;
