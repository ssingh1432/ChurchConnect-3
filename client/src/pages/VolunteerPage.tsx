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
import { volunteerMinistries, availabilityOptions } from "@/lib/utils";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Volunteer } from "@shared/schema";

const volunteerFormSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  phone: z.string().optional(),
  ministry: z.string({ required_error: "Please select a ministry" }),
  availability: z.string().optional(),
  experience: z.string().optional(),
});

type VolunteerForm = z.infer<typeof volunteerFormSchema>;

const VolunteerPage = () => {
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user's volunteer applications if authenticated
  const { data: userVolunteers, isLoading: loadingUserVolunteers } = useQuery<Volunteer[]>({
    queryKey: ["/api/volunteers/me"],
    enabled: isAuthenticated,
  });

  const form = useForm<VolunteerForm>({
    resolver: zodResolver(volunteerFormSchema),
    defaultValues: {
      name: user?.firstName && user?.lastName 
        ? `${user.firstName} ${user.lastName}` 
        : user?.firstName || user?.username || "",
      email: user?.email || "",
      phone: "",
      ministry: "",
      availability: "",
      experience: "",
    },
  });

  // Mutation for submitting volunteer application
  const submitVolunteer = useMutation({
    mutationFn: (data: VolunteerForm) => {
      return apiRequest("POST", "/api/volunteers", data);
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: "Thank you for volunteering! Our team will contact you soon.",
        variant: "default",
      });
      form.reset({
        name: user?.firstName && user?.lastName 
          ? `${user.firstName} ${user.lastName}` 
          : user?.firstName || user?.username || "",
        email: user?.email || "",
        phone: "",
        ministry: "",
        availability: "",
        experience: "",
      });
      // Refresh user volunteer applications if authenticated
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ["/api/volunteers/me"] });
      }
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: VolunteerForm) => {
    submitVolunteer.mutate(data);
  };

  return (
    <>
      <Helmet>
        <title>Volunteer - Grace Community Church</title>
        <meta
          name="description"
          content="Volunteer opportunities at Grace Community Church. Find out how you can serve and make a difference in our church and community."
        />
      </Helmet>

      <main>
        {/* Hero Section */}
        <section className="relative bg-slate-900 text-white py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/70">
            <img
              src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205"
              alt="Volunteers serving together"
              className="w-full h-full object-cover mix-blend-overlay"
            />
          </div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Volunteer With Us</h1>
              <p className="text-xl max-w-3xl mx-auto">
                Use your gifts and talents to serve God and others. We have many
                opportunities for you to get involved and make a difference.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Ministry Areas Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-2">Ministry Areas</h2>
              <div className="w-20 h-1 bg-purple-600 mx-auto mb-6"></div>
              <p className="text-slate-600 max-w-3xl mx-auto">
                Explore the different areas where you can serve based on your
                gifts, talents, and interests.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {/* Worship Team */}
              <motion.div
                className="bg-slate-50 rounded-lg p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-music text-purple-600 text-2xl"></i>
                </div>
                <h3 className="font-bold mb-2">Worship Team</h3>
                <p className="text-slate-600 text-sm mb-4">
                  Musicians, vocalists, and tech team members for our worship services.
                </p>
                <p className="text-slate-700 text-xs">
                  Skills: Musical ability, technical knowledge, teamwork
                </p>
              </motion.div>

              {/* Children's Ministry */}
              <motion.div
                className="bg-slate-50 rounded-lg p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-child text-purple-600 text-2xl"></i>
                </div>
                <h3 className="font-bold mb-2">Children's Ministry</h3>
                <p className="text-slate-600 text-sm mb-4">
                  Teachers, helpers, and coordinators for our programs for kids.
                </p>
                <p className="text-slate-700 text-xs">
                  Skills: Patience, creativity, love for children
                </p>
              </motion.div>

              {/* Hospitality */}
              <motion.div
                className="bg-slate-50 rounded-lg p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-hands-helping text-purple-600 text-2xl"></i>
                </div>
                <h3 className="font-bold mb-2">Hospitality</h3>
                <p className="text-slate-600 text-sm mb-4">
                  Greeters, ushers, and cafe team to welcome visitors and members.
                </p>
                <p className="text-slate-700 text-xs">
                  Skills: Friendliness, organization, attention to detail
                </p>
              </motion.div>

              {/* Media & Technology */}
              <motion.div
                className="bg-slate-50 rounded-lg p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-camera text-purple-600 text-2xl"></i>
                </div>
                <h3 className="font-bold mb-2">Media & Technology</h3>
                <p className="text-slate-600 text-sm mb-4">
                  Sound, video, lighting, photography, and social media team.
                </p>
                <p className="text-slate-700 text-xs">
                  Skills: Technical aptitude, creativity, problem-solving
                </p>
              </motion.div>
            </div>

            <div className="max-w-5xl mx-auto">
              {isAuthenticated ? (
                <Tabs defaultValue="apply" className="w-full">
                  <TabsList className="mb-8">
                    <TabsTrigger value="apply">Apply to Volunteer</TabsTrigger>
                    <TabsTrigger value="my-applications">My Applications</TabsTrigger>
                  </TabsList>
                  <TabsContent value="apply">
                    <VolunteerForm 
                      form={form} 
                      onSubmit={onSubmit} 
                      isSubmitting={submitVolunteer.isPending} 
                    />
                  </TabsContent>
                  <TabsContent value="my-applications">
                    <UserVolunteers 
                      volunteers={userVolunteers} 
                      isLoading={loadingUserVolunteers} 
                    />
                  </TabsContent>
                </Tabs>
              ) : (
                <VolunteerForm 
                  form={form} 
                  onSubmit={onSubmit} 
                  isSubmitting={submitVolunteer.isPending} 
                />
              )}
            </div>
          </div>
        </section>

        {/* Volunteer Benefits Section */}
        <section className="py-16 bg-slate-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-2">Why Volunteer?</h2>
              <div className="w-20 h-1 bg-purple-600 mx-auto mb-6"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-lg mb-3 text-purple-700">Make an Impact</h3>
                <p className="text-slate-700">
                  Use your unique gifts to serve others and make a meaningful difference in people's lives.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-lg mb-3 text-purple-700">Grow in Faith</h3>
                <p className="text-slate-700">
                  Serving others helps deepen your relationship with God and grow in your spiritual journey.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-lg mb-3 text-purple-700">Build Community</h3>
                <p className="text-slate-700">
                  Connect with others who share your faith and build lasting friendships through service.
                </p>
              </div>
            </div>

            <div className="text-center mt-10">
              <p className="italic text-slate-600 max-w-3xl mx-auto mb-4">
                "Each of you should use whatever gift you have received to serve others, as faithful stewards of God's grace in its various forms."
              </p>
              <p className="text-slate-700">— 1 Peter 4:10</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

interface VolunteerFormProps {
  form: any;
  onSubmit: (data: VolunteerForm) => void;
  isSubmitting: boolean;
}

const VolunteerForm = ({ form, onSubmit, isSubmitting }: VolunteerFormProps) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-6">Volunteer Application</h2>
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
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Phone (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Your phone number"
                        className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ministry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Ministry Area</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a ministry area" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {volunteerMinistries.map((ministry) => (
                          <SelectItem key={ministry.id} value={ministry.id}>
                            {ministry.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-medium">Availability</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="When are you available to serve?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availabilityOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-medium">
                    Previous Experience (Optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Share any relevant experience or skills you have..."
                      className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      rows={4}
                    />
                  </FormControl>
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
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </motion.div>
  );
};

interface UserVolunteersProps {
  volunteers?: Volunteer[];
  isLoading: boolean;
}

const UserVolunteers = ({ volunteers, isLoading }: UserVolunteersProps) => {
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

  if (!volunteers || volunteers.length === 0) {
    return (
      <div className="text-center py-10 bg-slate-50 rounded-lg">
        <h3 className="text-xl font-medium text-slate-800 mb-2">
          No Volunteer Applications Yet
        </h3>
        <p className="text-slate-600 mb-6">
          You haven't submitted any volunteer applications yet.
        </p>
        <Button variant="outline" onClick={() => document.querySelector('[data-value="apply"]')?.click()}>
          Apply to Volunteer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Your Volunteer Applications</h2>
      {volunteers.map((volunteer) => (
        <Card key={volunteer.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-lg">{volunteer.ministry}</h3>
              <span className={`px-2 py-1 rounded text-xs ${
                volunteer.isApproved 
                  ? "bg-green-100 text-green-800" 
                  : "bg-yellow-100 text-yellow-800"
              }`}>
                {volunteer.isApproved ? "Approved" : "Pending Approval"}
              </span>
            </div>
            <p className="text-slate-600 text-sm mb-3">
              Submitted on {formatDate(volunteer.createdAt)}
            </p>
            {volunteer.availability && (
              <p className="text-slate-700 mb-2">
                <strong>Availability:</strong> {volunteer.availability}
              </p>
            )}
            {volunteer.experience && (
              <div>
                <p className="text-slate-700 font-medium">Experience:</p>
                <p className="text-slate-600">{volunteer.experience}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VolunteerPage;
