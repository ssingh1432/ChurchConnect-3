import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import React, { useEffect, useState } from "react";
import NotFound from "./pages/not-found";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import MinistriesPage from "./pages/MinistriesPage";
import EventsPage from "./pages/EventsPage";
import SermonsPage from "./pages/SermonsPage";
import BlogPage from "./pages/BlogPage";
import VisitPage from "./pages/VisitPage";
import ContactPage from "./pages/ContactPage";
import PrayerRequestPage from "./pages/PrayerRequestPage";
import VolunteerPage from "./pages/VolunteerPage";
import DonatePage from "./pages/DonatePage";
import ProfilePage from "./pages/ProfilePage";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import EventManager from "./pages/admin/EventManager";
import MinistryManager from "./pages/admin/MinistryManager";
import SermonManager from "./pages/admin/SermonManager";
import BlogManager from "./pages/admin/BlogManager";
import UserManager from "./pages/admin/UserManager";
import PrayerRequestManager from "./pages/admin/PrayerRequestManager";
import VolunteerManager from "./pages/admin/VolunteerManager";
import MediaManager from "./pages/admin/MediaManager";
import DonationManager from "./pages/admin/DonationManager";
import SiteContentEditor from "./pages/admin/SiteContentEditor";
import { useAuth } from "@/lib/auth";
import LoginModal from "@/components/auth/LoginModal";
import RegisterModal from "@/components/auth/RegisterModal";

interface ModalState {
  login: boolean;
  register: boolean;
}

interface ModalContextProps {
  showModal: (modal: keyof ModalState) => void;
  hideModal: (modal: keyof ModalState) => void;
}

// Create context for modal management
const ModalContext = React.createContext<ModalContextProps>({
  showModal: () => {},
  hideModal: () => {},
});

// Export for use in other components
export { ModalContext };

function ProtectedRoute({ component: Component, adminRequired = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Route path="/" />;
  }

  if (adminRequired && !isAdmin) {
    return <Route path="/" />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/ministries" component={MinistriesPage} />
      <Route path="/events" component={EventsPage} />
      <Route path="/sermons" component={SermonsPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/visit" component={VisitPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/prayer-request" component={PrayerRequestPage} />
      <Route path="/volunteer" component={VolunteerPage} />
      <Route path="/donate" component={DonatePage} />
      <Route path="/login" component={() => {
        const { showModal } = React.useContext(ModalContext);
        React.useEffect(() => {
          showModal('login');
        }, []);
        return <HomePage />;
      }} />
      <Route path="/register" component={() => {
        const { showModal } = React.useContext(ModalContext);
        React.useEffect(() => {
          showModal('register');
        }, []);
        return <HomePage />;
      }} />
      <Route path="/profile">
        <ProtectedRoute component={ProfilePage} />
      </Route>
      <Route path="/admin">
        <ProtectedRoute component={AdminLayout} adminRequired={true} />
      </Route>
      <Route path="/admin/dashboard">
        <ProtectedRoute component={Dashboard} adminRequired={true} />
      </Route>
      <Route path="/admin/events">
        <ProtectedRoute component={EventManager} adminRequired={true} />
      </Route>
      <Route path="/admin/ministries">
        <ProtectedRoute component={MinistryManager} adminRequired={true} />
      </Route>
      <Route path="/admin/sermons">
        <ProtectedRoute component={SermonManager} adminRequired={true} />
      </Route>
      <Route path="/admin/blog">
        <ProtectedRoute component={BlogManager} adminRequired={true} />
      </Route>
      <Route path="/admin/users">
        <ProtectedRoute component={UserManager} adminRequired={true} />
      </Route>
      <Route path="/admin/prayer-requests">
        <ProtectedRoute component={PrayerRequestManager} adminRequired={true} />
      </Route>
      <Route path="/admin/volunteers">
        <ProtectedRoute component={VolunteerManager} adminRequired={true} />
      </Route>
      <Route path="/admin/media">
        <ProtectedRoute component={MediaManager} adminRequired={true} />
      </Route>
      <Route path="/admin/donations">
        <ProtectedRoute component={DonationManager} adminRequired={true} />
      </Route>
      <Route path="/admin/site-content">
        <ProtectedRoute component={SiteContentEditor} adminRequired={true} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [modals, setModals] = useState<ModalState>({
    login: false,
    register: false,
  });

  const showModal = (modal: keyof ModalState) => {
    // Close any open modals first
    setModals({ login: false, register: false });
    // Then open the requested modal
    setModals(prev => ({ ...prev, [modal]: true }));
  };

  const hideModal = (modal: keyof ModalState) => {
    setModals(prev => ({ ...prev, [modal]: false }));
  };

  // Add font from Google CDN
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const fontAwesome = document.createElement('link');
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    fontAwesome.rel = 'stylesheet';
    document.head.appendChild(fontAwesome);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(fontAwesome);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ModalContext.Provider value={{ showModal, hideModal }}>
          <Toaster />
          <Header />
          <Router />
          <Footer />
          <LoginModal isOpen={modals.login} onClose={() => hideModal('login')} onRegisterClick={() => showModal('register')} />
          <RegisterModal isOpen={modals.register} onClose={() => hideModal('register')} onLoginClick={() => showModal('login')} />
        </ModalContext.Provider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
