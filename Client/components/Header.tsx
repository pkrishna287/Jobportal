import { Building2, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import LoginModal from "./LoginModal";

export default function Header() {
  const { user, isAuthenticated, isAdmin, isUser, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const UserNavigation = () => (
    <>
      <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
        Browse Jobs
      </Link>
      <Link to="/profile" className="text-muted-foreground hover:text-primary transition-colors">
        My Profile
      </Link>
      <Link to="/companies" className="text-muted-foreground hover:text-primary transition-colors">
        Companies
      </Link>
    </>
  );

  const AdminNavigation = () => (
    <>
      <Link to="/admin" className="text-muted-foreground hover:text-primary transition-colors">
        Dashboard
      </Link>
      <Link to="/admin/applications" className="text-muted-foreground hover:text-primary transition-colors">
        Applications
      </Link>
      <Link to="/profile" className="text-muted-foreground hover:text-primary transition-colors">
        Profile
      </Link>
    </>
  );

  const PublicNavigation = () => (
    <>
      <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
        Jobs
      </Link>
      <Link to="/companies" className="text-muted-foreground hover:text-primary transition-colors">
        Companies
      </Link>
    </>
  );

  return (
    <>
      <header className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">RecruitPro</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {isAuthenticated ? (
                isAdmin ? <AdminNavigation /> : <UserNavigation />
              ) : (
                <PublicNavigation />
              )}
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-muted-foreground hidden sm:block">
                    Welcome, {user?.name}
                  </span>
                  {isAdmin && (
                    <Link 
                      to="/admin/jobs/new"
                      className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="hidden sm:inline">Post Job</span>
                    </Link>
                  )}
                  <button 
                    onClick={logout}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => setShowLoginModal(true)}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => setShowLoginModal(true)}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          {isAuthenticated && (
            <nav className="md:hidden mt-4 pt-4 border-t border-border flex items-center space-x-6">
              {isAdmin ? <AdminNavigation /> : <UserNavigation />}
            </nav>
          )}
        </div>
      </header>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </>
  );
}
