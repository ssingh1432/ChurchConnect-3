import React from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  CalendarRange,
  Users,
  Headphones,
  Newspaper,
  Scroll,
  Heart,
  DollarSign,
  ChevronRight,
  TrendingUp,
  UserCircle,
} from "lucide-react";

const StatCard = ({ 
  icon: Icon, 
  title, 
  value, 
  description, 
  isLoading, 
  linkTo 
}: { 
  icon: React.ElementType, 
  title: string, 
  value: number | string, 
  description?: string, 
  isLoading: boolean, 
  linkTo: string 
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-slate-500">{title}</CardTitle>
        <Icon className="h-4 w-4 text-slate-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isLoading ? <Skeleton className="h-7 w-16" /> : value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
      <CardFooter className="p-2 pt-0">
        <Link href={linkTo}>
          <Button variant="ghost" size="sm" className="w-full justify-between">
            View all
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

const RecentItem = ({ 
  title, 
  date, 
  linkTo,
  isLoading
}: { 
  title: string, 
  date: Date, 
  linkTo: string,
  isLoading: boolean
}) => {
  return (
    <div className="flex justify-between items-center py-3 border-b border-slate-100 last:border-none">
      {isLoading ? (
        <>
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/5" />
        </>
      ) : (
        <>
          <Link href={linkTo}>
            <span className="text-sm font-medium hover:text-purple-600 transition-colors cursor-pointer">
              {title}
            </span>
          </Link>
          <span className="text-xs text-slate-500">{formatDate(date)}</span>
        </>
      )}
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  
  // Fetch data for the dashboard
  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ["/api/events"],
  });
  
  const { data: ministries, isLoading: ministriesLoading } = useQuery({
    queryKey: ["/api/ministries"],
  });
  
  const { data: sermons, isLoading: sermonsLoading } = useQuery({
    queryKey: ["/api/sermons"],
  });
  
  const { data: blogPosts, isLoading: blogLoading } = useQuery({
    queryKey: ["/api/blog-posts"],
  });
  
  const { data: prayerRequests, isLoading: prayerLoading } = useQuery({
    queryKey: ["/api/prayer-requests"],
  });
  
  const { data: volunteers, isLoading: volunteersLoading } = useQuery({
    queryKey: ["/api/volunteers"],
  });
  
  const { data: donations, isLoading: donationsLoading } = useQuery({
    queryKey: ["/api/donations"],
  });
  
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/users"],
  });

  // Get recent items
  const getRecentItems = (items: any[] = [], count = 5) => {
    if (!items || items.length === 0) return [];
    
    return [...items]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, count);
  };

  // Filter upcoming events
  const getUpcomingEvents = (eventItems: any[] = [], count = 5) => {
    if (!eventItems || eventItems.length === 0) return [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return [...eventItems]
      .filter(event => new Date(event.startDate) >= today)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(0, count);
  };

  // Calculate the number of unanswered prayer requests
  const getUnansweredPrayerRequests = (requests: any[] = []) => {
    if (!requests || requests.length === 0) return 0;
    return requests.filter(req => !req.isAnswered).length;
  };

  // Calculate the percentage of approved volunteers
  const getApprovedVolunteersPercentage = (volunteerItems: any[] = []) => {
    if (!volunteerItems || volunteerItems.length === 0) return "0%";
    const approved = volunteerItems.filter(v => v.isApproved).length;
    return `${Math.round((approved / volunteerItems.length) * 100)}%`;
  };

  return (
    <>
      <Helmet>
        <title>Dashboard - Grace Community Church</title>
      </Helmet>
      
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-sm text-slate-500">
            Welcome back, {user?.firstName || user?.username || 'Admin'}
          </p>
        </div>
        
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            icon={CalendarRange} 
            title="Events" 
            value={events?.length || 0} 
            description={`${getUpcomingEvents(events).length} upcoming`}
            isLoading={eventsLoading} 
            linkTo="/adminpanel/events" 
          />
          <StatCard 
            icon={Headphones} 
            title="Sermons" 
            value={sermons?.length || 0} 
            isLoading={sermonsLoading} 
            linkTo="/adminpanel/sermons" 
          />
          <StatCard 
            icon={Newspaper} 
            title="Blog Posts" 
            value={blogPosts?.length || 0} 
            isLoading={blogLoading} 
            linkTo="/adminpanel/blog" 
          />
          <StatCard 
            icon={Users} 
            title="Ministries" 
            value={ministries?.length || 0} 
            isLoading={ministriesLoading} 
            linkTo="/adminpanel/ministries" 
          />
          <StatCard 
            icon={Scroll} 
            title="Prayer Requests" 
            value={prayerRequests?.length || 0} 
            description={`${getUnansweredPrayerRequests(prayerRequests)} unanswered`}
            isLoading={prayerLoading} 
            linkTo="/adminpanel/prayer-requests" 
          />
          <StatCard 
            icon={Heart} 
            title="Volunteers" 
            value={volunteers?.length || 0} 
            description={`${getApprovedVolunteersPercentage(volunteers)} approved`}
            isLoading={volunteersLoading} 
            linkTo="/adminpanel/volunteers" 
          />
          <StatCard 
            icon={DollarSign} 
            title="Donations" 
            value={donations?.length || 0} 
            isLoading={donationsLoading} 
            linkTo="/adminpanel/donations" 
          />
          <StatCard 
            icon={UserCircle} 
            title="Users" 
            value={users?.length || 0} 
            isLoading={usersLoading} 
            linkTo="/adminpanel/users" 
          />
        </div>
        
        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Events */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Upcoming Events</CardTitle>
                  <CardDescription>Next events scheduled</CardDescription>
                </div>
                <CalendarRange className="h-5 w-5 text-slate-500" />
              </div>
            </CardHeader>
            <CardContent>
              {eventsLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <RecentItem 
                    key={i}
                    title="" 
                    date={new Date()} 
                    linkTo=""
                    isLoading={true}
                  />
                ))
              ) : getUpcomingEvents(events).length === 0 ? (
                <p className="text-sm text-slate-500 py-3">No upcoming events scheduled</p>
              ) : (
                getUpcomingEvents(events).map(event => (
                  <RecentItem 
                    key={event.id}
                    title={event.title} 
                    date={new Date(event.startDate)} 
                    linkTo={`/adminpanel/events`}
                    isLoading={false}
                  />
                ))
              )}
            </CardContent>
            <CardFooter className="border-t px-6 py-3">
              <Link href="/adminpanel/events">
                <Button variant="ghost" size="sm" className="w-full justify-center">
                  View all events
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          {/* Recent Sermons */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Recent Sermons</CardTitle>
                  <CardDescription>Latest sermon recordings</CardDescription>
                </div>
                <Headphones className="h-5 w-5 text-slate-500" />
              </div>
            </CardHeader>
            <CardContent>
              {sermonsLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <RecentItem 
                    key={i}
                    title="" 
                    date={new Date()} 
                    linkTo=""
                    isLoading={true}
                  />
                ))
              ) : !sermons || sermons.length === 0 ? (
                <p className="text-sm text-slate-500 py-3">No sermons have been added yet</p>
              ) : (
                getRecentItems(sermons).map(sermon => (
                  <RecentItem 
                    key={sermon.id}
                    title={sermon.title} 
                    date={new Date(sermon.date)} 
                    linkTo={`/adminpanel/sermons`}
                    isLoading={false}
                  />
                ))
              )}
            </CardContent>
            <CardFooter className="border-t px-6 py-3">
              <Link href="/adminpanel/sermons">
                <Button variant="ghost" size="sm" className="w-full justify-center">
                  View all sermons
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          {/* Recent Blog Posts */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Recent Blog Posts</CardTitle>
                  <CardDescription>Latest articles and updates</CardDescription>
                </div>
                <Newspaper className="h-5 w-5 text-slate-500" />
              </div>
            </CardHeader>
            <CardContent>
              {blogLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <RecentItem 
                    key={i}
                    title="" 
                    date={new Date()} 
                    linkTo=""
                    isLoading={true}
                  />
                ))
              ) : !blogPosts || blogPosts.length === 0 ? (
                <p className="text-sm text-slate-500 py-3">No blog posts have been published yet</p>
              ) : (
                getRecentItems(blogPosts).map(post => (
                  <RecentItem 
                    key={post.id}
                    title={post.title} 
                    date={new Date(post.createdAt)} 
                    linkTo={`/adminpanel/blog`}
                    isLoading={false}
                  />
                ))
              )}
            </CardContent>
            <CardFooter className="border-t px-6 py-3">
              <Link href="/adminpanel/blog">
                <Button variant="ghost" size="sm" className="w-full justify-center">
                  View all blog posts
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          {/* Recent Prayer Requests */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Prayer Requests</CardTitle>
                  <CardDescription>Recent prayer needs</CardDescription>
                </div>
                <Scroll className="h-5 w-5 text-slate-500" />
              </div>
            </CardHeader>
            <CardContent>
              {prayerLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <RecentItem 
                    key={i}
                    title="" 
                    date={new Date()} 
                    linkTo=""
                    isLoading={true}
                  />
                ))
              ) : !prayerRequests || prayerRequests.length === 0 ? (
                <p className="text-sm text-slate-500 py-3">No prayer requests have been submitted yet</p>
              ) : (
                getRecentItems(prayerRequests).map(request => (
                  <RecentItem 
                    key={request.id}
                    title={`${request.name}: ${request.request.substring(0, 30)}...`} 
                    date={new Date(request.createdAt)} 
                    linkTo={`/adminpanel/prayer-requests`}
                    isLoading={false}
                  />
                ))
              )}
            </CardContent>
            <CardFooter className="border-t px-6 py-3">
              <Link href="/adminpanel/prayer-requests">
                <Button variant="ghost" size="sm" className="w-full justify-center">
                  View all prayer requests
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Dashboard;