import { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ModalContext } from "@/App";
import { useAuth } from "@/lib/auth";
import MobileMenu from "./MobileMenu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { showModal } = useContext(ModalContext);
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`bg-slate-900 text-white sticky top-0 z-50 transition-shadow ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold flex items-center gap-2">
          <i className="fas fa-church text-purple-400"></i>
          <span>Bishram Ekata Mandali</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link
            href="/"
            className={`hover:text-purple-400 transition-colors ${
              location === "/" ? "text-purple-400" : ""
            }`}
          >
            {t('common.menu.home')}
          </Link>
          <Link
            href="/about"
            className={`hover:text-purple-400 transition-colors ${
              location === "/about" ? "text-purple-400" : ""
            }`}
          >
            {t('common.menu.about')}
          </Link>
          <Link
            href="/ministries"
            className={`hover:text-purple-400 transition-colors ${
              location === "/ministries" ? "text-purple-400" : ""
            }`}
          >
            {t('common.menu.ministries')}
          </Link>
          <Link
            href="/events"
            className={`hover:text-purple-400 transition-colors ${
              location === "/events" ? "text-purple-400" : ""
            }`}
          >
            {t('common.menu.events')}
          </Link>
          <Link
            href="/sermons"
            className={`hover:text-purple-400 transition-colors ${
              location === "/sermons" ? "text-purple-400" : ""
            }`}
          >
            {t('common.menu.sermons')}
          </Link>
          <Link
            href="/blog"
            className={`hover:text-purple-400 transition-colors ${
              location === "/blog" ? "text-purple-400" : ""
            }`}
          >
            {t('common.menu.blog')}
          </Link>
          <Link
            href="/contact"
            className={`hover:text-purple-400 transition-colors ${
              location === "/contact" ? "text-purple-400" : ""
            }`}
          >
            {t('common.menu.contact')}
          </Link>
          <Link
            href="/donate"
            className={`hover:text-purple-400 transition-colors ${
              location === "/donate" ? "text-purple-400" : ""
            }`}
          >
            {t('common.menu.donate')}
          </Link>
        </nav>

        {/* Authentication */}
        <div className="hidden md:flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="rounded-full"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5 text-purple-100" />
            ) : (
              <Sun className="h-5 w-5 text-purple-100" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-white hover:text-purple-400 transition-colors"
                >
                  <User className="mr-1 h-4 w-4" />
                  {user?.firstName || user?.username}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/prayer-request">Prayer Requests</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/volunteer">Volunteer</Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/adminpanel">Admin Panel</Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="ghost"
                className="text-white hover:text-purple-400 transition-colors"
                onClick={() => showModal("login")}
              >
                <i className="fas fa-user mr-1"></i> Login
              </Button>
              <Button
                className="bg-purple-600 hover:bg-purple-700 transition-colors"
                onClick={() => showModal("register")}
              >
                Register
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMobileMenu}
          initial={false}
          animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <i className="fas fa-bars text-xl"></i>
        </motion.button>
      </div>

      {/* Mobile Navigation */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        isAuthenticated={isAuthenticated}
        user={user}
        isAdmin={isAdmin}
        onLogin={() => {
          closeMobileMenu();
          showModal("login");
        }}
        onRegister={() => {
          closeMobileMenu();
          showModal("register");
        }}
        onLogout={() => {
          closeMobileMenu();
          logout();
        }}
      />
    </header>
  );
};

export default Header;
