import React from "react";
import { Helmet } from "react-helmet";
import { Link, useLocation, Route, Switch } from "wouter";
import { 
  CalendarRange, 
  ChevronLeft, 
  Users, 
  UserCircle, 
  LayoutDashboard, 
  Headphones, 
  Newspaper, 
  Scroll, 
  Heart, 
  Image, 
  DollarSign,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const NavItem = ({ 
  icon: Icon, 
  label, 
  to, 
  currentPath 
}: { 
  icon: React.ElementType; 
  label: string; 
  to: string; 
  currentPath: string;
}) => {
  const isActive = currentPath === to;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={to}>
            <Button
              variant={isActive ? "default" : "ghost"}
              size="lg"
              className={cn(
                "w-full justify-start mb-1 h-12",
                isActive ? "bg-purple-600 text-white hover:bg-purple-700" : ""
              )}
            >
              <Icon className="mr-3 h-5 w-5" />
              {label}
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const AdminLayout: React.FC = () => {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  
  const getUserInitials = () => {
    if (!user) return "GC";
    
    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    }
    
    return user.username.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <Helmet>
        <title>Admin Panel - Grace Community Church</title>
      </Helmet>
      
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6 border-b flex flex-col">
            <div className="flex items-center mb-6">
              <Avatar className="h-12 w-12 mr-3">
                <AvatarImage src="/images/church-logo.png" alt="Admin" />
                <AvatarFallback className="bg-purple-100 text-purple-800">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">Admin Panel</h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm" className="flex items-center justify-center">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Return to Website
              </Button>
            </Link>
          </div>
          
          <nav className="px-3 py-4">
            <h4 className="text-xs uppercase text-gray-500 font-semibold px-3 mb-2">Dashboard</h4>
            <NavItem 
              icon={LayoutDashboard} 
              label="Dashboard" 
              to="/adminpanel/dashboard" 
              currentPath={location} 
            />
            
            <h4 className="text-xs uppercase text-gray-500 font-semibold px-3 mb-2 mt-6">Content</h4>
            <NavItem 
              icon={CalendarRange} 
              label="Events" 
              to="/adminpanel/events" 
              currentPath={location} 
            />
            <NavItem 
              icon={Users} 
              label="Ministries" 
              to="/adminpanel/ministries" 
              currentPath={location} 
            />
            <NavItem 
              icon={Headphones} 
              label="Sermons" 
              to="/adminpanel/sermons" 
              currentPath={location} 
            />
            <NavItem 
              icon={Newspaper} 
              label="Blog Posts" 
              to="/adminpanel/blog" 
              currentPath={location} 
            />
            <NavItem 
              icon={FileText} 
              label="Site Content" 
              to="/adminpanel/site-content" 
              currentPath={location} 
            />
            <NavItem 
              icon={Image} 
              label="Media Library" 
              to="/adminpanel/media" 
              currentPath={location} 
            />
            
            <h4 className="text-xs uppercase text-gray-500 font-semibold px-3 mb-2 mt-6">Community</h4>
            <NavItem 
              icon={UserCircle} 
              label="Users" 
              to="/adminpanel/users" 
              currentPath={location} 
            />
            <NavItem 
              icon={Scroll} 
              label="Prayer Requests" 
              to="/adminpanel/prayer-requests" 
              currentPath={location} 
            />
            <NavItem 
              icon={Heart} 
              label="Volunteers" 
              to="/adminpanel/volunteers" 
              currentPath={location} 
            />
            <NavItem 
              icon={DollarSign} 
              label="Donations" 
              to="/adminpanel/donations" 
              currentPath={location} 
            />
          </nav>
          
          <div className="px-6 py-4 mt-auto border-t">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <Switch>
            <Route path="/adminpanel">
              <div className="flex items-center justify-center h-full text-center p-8">
                <div>
                  <h1 className="text-3xl font-bold text-purple-600 mb-2">Welcome to the Admin Panel</h1>
                  <p className="text-gray-600 mb-6">Select an option from the sidebar to manage your church website.</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                    <Link href="/adminpanel/dashboard">
                      <Button variant="outline" className="w-full h-24 flex flex-col justify-center">
                        <LayoutDashboard className="h-6 w-6 mb-2" />
                        Dashboard
                      </Button>
                    </Link>
                    <Link href="/adminpanel/events">
                      <Button variant="outline" className="w-full h-24 flex flex-col justify-center">
                        <CalendarRange className="h-6 w-6 mb-2" />
                        Events
                      </Button>
                    </Link>
                    <Link href="/adminpanel/ministries">
                      <Button variant="outline" className="w-full h-24 flex flex-col justify-center">
                        <Users className="h-6 w-6 mb-2" />
                        Ministries
                      </Button>
                    </Link>
                    <Link href="/adminpanel/sermons">
                      <Button variant="outline" className="w-full h-24 flex flex-col justify-center">
                        <Headphones className="h-6 w-6 mb-2" />
                        Sermons
                      </Button>
                    </Link>
                    <Link href="/adminpanel/blog">
                      <Button variant="outline" className="w-full h-24 flex flex-col justify-center">
                        <Newspaper className="h-6 w-6 mb-2" />
                        Blog
                      </Button>
                    </Link>
                    <Link href="/adminpanel/site-content">
                      <Button variant="outline" className="w-full h-24 flex flex-col justify-center">
                        <FileText className="h-6 w-6 mb-2" />
                        Site Content
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Route>
          </Switch>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;