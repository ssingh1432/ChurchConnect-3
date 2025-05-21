import { useState } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const profileFormSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email({ message: "Valid email is required" }),
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().optional().refine(
    val => !val || val.length >= 6,
    { message: "Password must be at least 6 characters or empty" }
  ),
  confirmPassword: z.string().optional()
}).refine(data => !data.password || data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ProfileForm = z.infer<typeof profileFormSchema>;

const ProfilePage = () => {
  const { toast } = useToast();
  const { user, updateCurrentUser } = useAuth();
  
  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      username: user?.username || "",
      password: "",
      confirmPassword: "",
    },
  });

  // Mutation for updating profile
  const updateProfile = useMutation({
    mutationFn: (data: ProfileForm) => {
      return apiRequest("PATCH", `/api/users/${user?.id}`, data);
    },
    onSuccess: (data) => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
        variant: "default",
      });
      // Update auth context with new user data
      updateCurrentUser(data);
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProfileForm) => {
    // Remove confirmPassword as it's not needed for the API
    const { confirmPassword, ...profileData } = data;
    // If password is empty, remove it from the request
    if (!profileData.password) {
      delete profileData.password;
    }
    updateProfile.mutate(profileData);
  };

  // Get user activity - prayer requests, volunteer applications, donations
  const { data: prayerRequests, isLoading: loadingPrayers } = useQuery({
    queryKey: ["/api/prayer-requests/me"],
    enabled: !!user,
  });

  const { data: volunteerApplications, isLoading: loadingVolunteers } = useQuery({
    queryKey: ["/api/volunteers/me"],
    enabled: !!user,
  });

  const { data: donations, isLoading: loadingDonations } = useQuery({
    queryKey: ["/api/donations/me"],
    enabled: !!user,
  });

  return (
    <>
      <Helmet>
        <title>My Profile - Grace Community Church</title>
        <meta
          name="description"
          content="Manage your profile at Grace Community Church."
        />
      </Helmet>

      <main>
        {/* Header Section */}
        <section className="relative bg-slate-900 text-white py-16">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/70">
            <img
              src="https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1"
              alt="Profile background"
              className="w-full h-full object-cover mix-blend-overlay"
            />
          </div>
          <div className="container mx-auto px-4 relative z-10 flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row items-center gap-6"
            >
              <Avatar className="w-24 h-24 border-4 border-white">
                <AvatarFallback className="text-3xl">
                  {user?.firstName?.[0] || user?.username?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}` 
                    : user?.username || "My Profile"}
                </h1>
                <p className="text-xl">
                  Member since {user?.createdAt ? formatDate(user.createdAt) : "N/A"}
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Profile Content Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="mb-8">
                  <TabsTrigger value="profile">Profile Settings</TabsTrigger>
                  <TabsTrigger value="activity">My Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="firstName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>First Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="lastName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Last Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input {...field} type="email" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Username</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>New Password (leave blank to keep current)</FormLabel>
                                  <FormControl>
                                    <Input {...field} type="password" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="confirmPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Confirm New Password</FormLabel>
                                  <FormControl>
                                    <Input {...field} type="password" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="flex justify-end">
                            <Button 
                              type="submit" 
                              className="bg-purple-600 hover:bg-purple-700"
                              disabled={updateProfile.isPending}
                            >
                              {updateProfile.isPending ? "Saving..." : "Save Changes"}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="activity">
                  <div className="space-y-8">
                    <Card>
                      <CardContent className="p-6">
                        <h2 className="text-2xl font-bold mb-4">My Prayer Requests</h2>
                        {loadingPrayers ? (
                          <div className="space-y-4">
                            {[1, 2].map(i => (
                              <Skeleton key={i} className="h-16 w-full" />
                            ))}
                          </div>
                        ) : !prayerRequests || prayerRequests.length === 0 ? (
                          <p className="text-slate-600">You haven't submitted any prayer requests yet.</p>
                        ) : (
                          <div className="space-y-4">
                            {prayerRequests.map((prayer: any) => (
                              <div key={prayer.id} className="p-4 border rounded-md">
                                <div className="flex justify-between">
                                  <span className="font-medium">{formatDate(prayer.createdAt)}</span>
                                  {prayer.isAnswered && (
                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                      Answered
                                    </span>
                                  )}
                                </div>
                                <p className="mt-2">{prayer.request}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <h2 className="text-2xl font-bold mb-4">My Volunteer Applications</h2>
                        {loadingVolunteers ? (
                          <div className="space-y-4">
                            {[1, 2].map(i => (
                              <Skeleton key={i} className="h-16 w-full" />
                            ))}
                          </div>
                        ) : !volunteerApplications || volunteerApplications.length === 0 ? (
                          <p className="text-slate-600">You haven't submitted any volunteer applications yet.</p>
                        ) : (
                          <div className="space-y-4">
                            {volunteerApplications.map((volunteer: any) => (
                              <div key={volunteer.id} className="p-4 border rounded-md">
                                <div className="flex justify-between">
                                  <span className="font-medium">
                                    {volunteer.ministry} Ministry
                                  </span>
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    volunteer.isApproved 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {volunteer.isApproved ? 'Approved' : 'Pending'}
                                  </span>
                                </div>
                                <p className="mt-2 text-sm text-slate-600">
                                  Applied on {formatDate(volunteer.createdAt)}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <h2 className="text-2xl font-bold mb-4">My Donations</h2>
                        {loadingDonations ? (
                          <div className="space-y-4">
                            {[1, 2].map(i => (
                              <Skeleton key={i} className="h-16 w-full" />
                            ))}
                          </div>
                        ) : !donations || donations.length === 0 ? (
                          <p className="text-slate-600">You haven't made any donations yet.</p>
                        ) : (
                          <div className="space-y-4">
                            {donations.map((donation: any) => (
                              <div key={donation.id} className="p-4 border rounded-md">
                                <div className="flex justify-between">
                                  <span className="font-medium">
                                    ${donation.amount.toFixed(2)} - {donation.project || 'General Fund'}
                                  </span>
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    donation.status === 'completed' 
                                      ? 'bg-green-100 text-green-800' 
                                      : donation.status === 'pending'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                                  </span>
                                </div>
                                <p className="mt-2 text-sm text-slate-600">
                                  {donation.paymentMethod.charAt(0).toUpperCase() + donation.paymentMethod.slice(1).replace('-', ' ')} - 
                                  {' '}{formatDate(donation.createdAt)}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default ProfilePage;