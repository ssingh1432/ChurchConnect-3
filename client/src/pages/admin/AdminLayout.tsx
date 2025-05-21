import { useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  ChevronLeft, 
  LayoutDashboard, 
  Calendar, 
  Users, 
  BookOpen,
  FileText,
  MessageSquare,
  HandHelping,
  Image,
  DollarSign,
  Settings,
  Menu,
  X
} from "lucide-react";

const AdminLayout = () => {
  const [location] = useLocation();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Navigation items for admin sidebar
  const navItems = [
    { title: "Dashboard", path: "/adminpanel/dashboard", icon: <LayoutDashboard className="mr-2 h-5 w-5" /> },
    { title: "Events", path: "/adminpanel/events", icon: <Calendar className="mr-2 h-5 w-5" /> },
    { title: "Ministries", path: "/adminpanel/ministries", icon: <Users className="mr-2 h-5 w-5" /> },
    { title: "Sermons", path: "/adminpanel/sermons", icon: <BookOpen className="mr-2 h-5 w-5" /> },
    { title: "Blog Posts", path: "/adminpanel/blog", icon: <FileText className="mr-2 h-5 w-5" /> },
    { title: "Prayer Requests", path: "/adminpanel/prayer-requests", icon: <MessageSquare className="mr-2 h-5 w-5" /> },
    { title: "Volunteers", path: "/adminpanel/volunteers", icon: <HandHelping className="mr-2 h-5 w-5" /> },
    { title: "Media Assets", path: "/adminpanel/media", icon: <Image className="mr-2 h-5 w-5" /> },
    { title: "Donations", path: "/adminpanel/donations", icon: <DollarSign className="mr-2 h-5 w-5" /> },
    { title: "User Management", path: "/adminpanel/users", icon: <Users className="mr-2 h-5 w-5" /> },
    { title: "Site Content", path: "/adminpanel/site-content", icon: <Settings className="mr-2 h-5 w-5" /> },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <Helmet>
        <title>Admin Panel - Grace Community Church</title>
      </Helmet>

      <div className="flex min-h-screen bg-slate-100">
        {/* Mobile sidebar toggle */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSidebar}
            className="bg-white"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Sidebar - desktop version is always shown, mobile is toggled */}
        <div
          className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-lg transition-transform duration-200 lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-16 items-center justify-center border-b px-4">
            <h1 className="text-xl font-bold text-purple-700">Admin Dashboard</h1>
          </div>
          <div className="px-4 py-2">
            <div className="mb-4 flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-sm font-medium text-purple-700">
                  {user?.firstName?.[0] || user?.username?.[0] || "A"}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium">
                  {user?.firstName && user?.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user?.username || "Admin User"}
                </p>
                <p className="text-xs text-slate-500">Administrator</p>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <a
                    className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                      location === item.path
                        ? "bg-purple-100 text-purple-700"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {item.icon}
                    {item.title}
                  </a>
                </Link>
              ))}
            </div>
          </div>
          <div className="absolute bottom-0 w-full border-t p-4">
            <Link href="/">
              <a className="flex items-center text-sm font-medium text-slate-700 hover:text-slate-900">
                <ChevronLeft className="mr-2 h-5 w-5" />
                Back to Website
              </a>
            </Link>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 lg:ml-64">
          <div className="p-6">
            {/* Slot for admin page content */}
            {location === "/adminpanel" && (
              <div className="mt-8 text-center">
                <h2 className="text-2xl font-bold">Welcome to the Admin Dashboard</h2>
                <p className="mt-2 text-slate-600">
                  Select an option from the sidebar to manage your church website.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;