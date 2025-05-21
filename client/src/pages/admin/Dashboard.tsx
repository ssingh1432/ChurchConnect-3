import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "@/lib/utils";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  UsersIcon, 
  CalendarIcon, 
  BookOpenIcon, 
  FileTextIcon,
  MessageSquareIcon,
  HandHelpingIcon,
  ImageIcon,
  DollarSignIcon
} from "lucide-react";

const Dashboard = () => {
  // Fetch summary data for the dashboard
  const { data: userCount, isLoading: loadingUsers } = useQuery({
    queryKey: ["/api/users/count"],
  });
  
  const { data: eventCount, isLoading: loadingEvents } = useQuery({
    queryKey: ["/api/events/count"],
  });
  
  const { data: sermonCount, isLoading: loadingSermons } = useQuery({
    queryKey: ["/api/sermons/count"],
  });
  
  const { data: blogCount, isLoading: loadingBlog } = useQuery({
    queryKey: ["/api/blog-posts/count"],
  });

  // Fetch recent activities for various sections
  const { data: recentPrayers, isLoading: loadingPrayers } = useQuery({
    queryKey: ["/api/prayer-requests/recent"],
  });
  
  const { data: recentVolunteers, isLoading: loadingVolunteers } = useQuery({
    queryKey: ["/api/volunteers/recent"],
  });
  
  const { data: recentDonations, isLoading: loadingDonations } = useQuery({
    queryKey: ["/api/donations/recent"],
  });

  // Mock data for statistics (will be replaced with real data when APIs are ready)
  const statCards = [
    { 
      title: "Total Members", 
      value: loadingUsers ? "..." : userCount || 0, 
      icon: <UsersIcon className="h-5 w-5 text-blue-500" />,
      color: "bg-blue-50" 
    },
    { 
      title: "Upcoming Events", 
      value: loadingEvents ? "..." : eventCount || 0, 
      icon: <CalendarIcon className="h-5 w-5 text-green-500" />,
      color: "bg-green-50" 
    },
    { 
      title: "Sermons", 
      value: loadingSermons ? "..." : sermonCount || 0, 
      icon: <BookOpenIcon className="h-5 w-5 text-yellow-500" />,
      color: "bg-yellow-50" 
    },
    { 
      title: "Blog Posts", 
      value: loadingBlog ? "..." : blogCount || 0, 
      icon: <FileTextIcon className="h-5 w-5 text-purple-500" />,
      color: "bg-purple-50" 
    },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Grace Community Church</title>
      </Helmet>

      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index} className="border-none shadow-sm">
              <CardContent className={`p-6 ${stat.color}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Recent Activity */}
        <Tabs defaultValue="prayers" className="mt-8">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <TabsList className="mb-4">
            <TabsTrigger value="prayers">Prayer Requests</TabsTrigger>
            <TabsTrigger value="volunteers">Volunteer Applications</TabsTrigger>
            <TabsTrigger value="donations">Donations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="prayers">
            <Card>
              <CardHeader>
                <CardTitle>Recent Prayer Requests</CardTitle>
                <CardDescription>
                  The latest prayer requests submitted to the church
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingPrayers ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex flex-col space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-12 w-full" />
                      </div>
                    ))}
                  </div>
                ) : !recentPrayers || recentPrayers.length === 0 ? (
                  <p className="text-slate-500 text-center py-4">No recent prayer requests</p>
                ) : (
                  <div className="space-y-4">
                    {recentPrayers.map((prayer: any) => (
                      <div key={prayer.id} className="p-4 border rounded-md">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">{prayer.name}</p>
                            <p className="text-sm text-slate-500">{formatDate(prayer.createdAt)}</p>
                          </div>
                          <div className="flex space-x-2">
                            {prayer.isPrivate && (
                              <span className="bg-slate-100 text-slate-800 px-2 py-1 text-xs rounded">
                                Private
                              </span>
                            )}
                            {prayer.isAnswered ? (
                              <span className="bg-green-100 text-green-800 px-2 py-1 text-xs rounded">
                                Answered
                              </span>
                            ) : (
                              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 text-xs rounded">
                                Pending
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-slate-700">{prayer.request}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="volunteers">
            <Card>
              <CardHeader>
                <CardTitle>Recent Volunteer Applications</CardTitle>
                <CardDescription>
                  People who recently signed up to volunteer
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingVolunteers ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex flex-col space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-12 w-full" />
                      </div>
                    ))}
                  </div>
                ) : !recentVolunteers || recentVolunteers.length === 0 ? (
                  <p className="text-slate-500 text-center py-4">No recent volunteer applications</p>
                ) : (
                  <div className="space-y-4">
                    {recentVolunteers.map((volunteer: any) => (
                      <div key={volunteer.id} className="p-4 border rounded-md">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">{volunteer.name}</p>
                            <p className="text-sm text-slate-500">{formatDate(volunteer.createdAt)}</p>
                          </div>
                          <div>
                            {volunteer.isApproved ? (
                              <span className="bg-green-100 text-green-800 px-2 py-1 text-xs rounded">
                                Approved
                              </span>
                            ) : (
                              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 text-xs rounded">
                                Pending
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="font-medium text-slate-700 mb-1">Ministry: {volunteer.ministry}</p>
                        {volunteer.experience && (
                          <p className="text-sm text-slate-600">Experience: {volunteer.experience}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="donations">
            <Card>
              <CardHeader>
                <CardTitle>Recent Donations</CardTitle>
                <CardDescription>
                  The latest donations received
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingDonations ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex flex-col space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-12 w-full" />
                      </div>
                    ))}
                  </div>
                ) : !recentDonations || recentDonations.length === 0 ? (
                  <p className="text-slate-500 text-center py-4">No recent donations</p>
                ) : (
                  <div className="space-y-4">
                    {recentDonations.map((donation: any) => (
                      <div key={donation.id} className="p-4 border rounded-md">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">${donation.amount.toFixed(2)}</p>
                            <p className="text-sm text-slate-500">{formatDate(donation.createdAt)}</p>
                          </div>
                          <div>
                            <span className={`px-2 py-1 text-xs rounded ${
                              donation.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : donation.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-700">
                          {donation.name || 'Anonymous'} • 
                          {donation.project ? ` ${donation.project}` : ' General Fund'} • 
                          {donation.paymentMethod.replace('-', ' ')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Dashboard;