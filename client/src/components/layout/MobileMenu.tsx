import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { User } from "@/lib/auth";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  user: User | null;
  isAdmin: boolean;
  onLogin: () => void;
  onRegister: () => void;
  onLogout: () => void;
}

const MobileMenu = ({
  isOpen,
  onClose,
  isAuthenticated,
  user,
  isAdmin,
  onLogin,
  onRegister,
  onLogout,
}: MobileMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="md:hidden bg-slate-800"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
            <Link href="/" onClick={onClose} className="py-2 hover:text-purple-400 transition-colors">
              Home
            </Link>
            <Link href="/about" onClick={onClose} className="py-2 hover:text-purple-400 transition-colors">
              About
            </Link>
            <Link href="/ministries" onClick={onClose} className="py-2 hover:text-purple-400 transition-colors">
              Ministries
            </Link>
            <Link href="/events" onClick={onClose} className="py-2 hover:text-purple-400 transition-colors">
              Events
            </Link>
            <Link href="/sermons" onClick={onClose} className="py-2 hover:text-purple-400 transition-colors">
              Sermons
            </Link>
            <Link href="/blog" onClick={onClose} className="py-2 hover:text-purple-400 transition-colors">
              Blog
            </Link>
            <Link href="/contact" onClick={onClose} className="py-2 hover:text-purple-400 transition-colors">
              Contact
            </Link>
            <Link href="/donate" onClick={onClose} className="py-2 hover:text-purple-400 transition-colors">
              Give
            </Link>
            
            <div className="pt-3 border-t border-slate-700 flex flex-col space-y-2">
              {isAuthenticated ? (
                <>
                  <Link href="/profile" onClick={onClose} className="py-2 hover:text-purple-400 transition-colors">
                    <i className="fas fa-user mr-1"></i> Profile ({user?.firstName || user?.username})
                  </Link>
                  <Link href="/prayer-request" onClick={onClose} className="py-2 hover:text-purple-400 transition-colors">
                    <i className="fas fa-pray mr-1"></i> Prayer Requests
                  </Link>
                  <Link href="/volunteer" onClick={onClose} className="py-2 hover:text-purple-400 transition-colors">
                    <i className="fas fa-hands-helping mr-1"></i> Volunteer
                  </Link>
                  {isAdmin && (
                    <Link href="/adminpanel" onClick={onClose} className="py-2 hover:text-purple-400 transition-colors">
                      <i className="fas fa-user-shield mr-1"></i> Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={onLogout}
                    className="py-2 text-center hover:text-purple-400 transition-colors"
                  >
                    <i className="fas fa-sign-out-alt mr-1"></i> Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onLogin}
                    className="py-2 text-center hover:text-purple-400 transition-colors"
                  >
                    <i className="fas fa-user mr-1"></i> Login
                  </button>
                  <button
                    onClick={onRegister}
                    className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md font-medium text-center transition-colors"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
