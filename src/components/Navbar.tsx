import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Scissors, Menu, X, User, LogOut, LayoutDashboard, Settings, Cpu, Globe, Zap, ZapOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { Button, buttonVariants } from './ui/button';
import { AuthModal } from './AuthModal';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, isAdmin, isSafeMode, setSafeMode, hasQuotaError } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/');
  };

  const scrollToCourses = (e: React.MouseEvent) => {
    const section = document.getElementById('courses');
    if (section) {
      e.preventDefault();
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-[#4F46E5] p-1.5 rounded-lg">
                <Scissors className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold font-display tracking-tight text-slate-900">
                Stitch <span className="text-[#4F46E5]">Toppers</span>
              </span>
            </Link>

            {/* System Status - Desktop */}
            <div className="hidden lg:flex items-center gap-4 border-l border-slate-100 pl-8">
              <button 
                onClick={() => setSafeMode(!isSafeMode)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all border",
                  isSafeMode 
                    ? "bg-amber-50 text-amber-700 border-amber-200" 
                    : hasQuotaError 
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                )}
              >
                {isSafeMode ? (
                  <> <ZapOff className="h-3 w-3" /> Offline Mode (Safe) </>
                ) : (
                  <> <Globe className="h-3 w-3 animate-pulse" /> Live Sync </>
                )}
              </button>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-slate-600 hover:text-[#4F46E5] font-medium transition-all hover:scale-105 active:scale-95">Home</Link>
            <Link 
              to="/" 
              onClick={scrollToCourses} 
              className="text-slate-600 hover:text-[#4F46E5] font-medium transition-all hover:scale-105 active:scale-95 relative group"
            >
              Courses
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4F46E5] transition-all group-hover:w-full" />
            </Link>
            <Link to="/success-stories" className="text-slate-600 hover:text-[#4F46E5] font-medium transition-all hover:scale-105 active:scale-95">Success Stories</Link>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={cn(buttonVariants({ variant: "ghost", className: "flex items-center space-x-2 hover:bg-indigo-50 cursor-pointer rounded-xl px-3 py-2" }))}>
                  <div className="h-6 w-6 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center shrink-0">
                    {profile?.photoURL ? (
                      <img src={profile.photoURL} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <User className="h-4 w-4 text-[#4F46E5]" />
                    )}
                  </div>
                  <span className="font-medium text-slate-700 max-w-[120px] truncate">{profile?.displayName || 'My Account'}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Account Settings</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      render={
                        <Link to={isAdmin ? "/admin" : "/dashboard"} className="flex items-center w-full px-2 py-1.5 focus:outline-none cursor-pointer" />
                      }
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem 
                        render={
                          <Link to="/admin" className="flex items-center w-full px-2 py-1.5 focus:outline-none cursor-pointer" />
                        }
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Manage Courses</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <AuthModal />
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              <div className="px-3 py-4 border-b border-slate-50 mb-4">
                <button 
                  onClick={() => setSafeMode(!isSafeMode)}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 px-3 py-3 rounded-2xl text-[10px] uppercase tracking-widest font-bold border",
                    isSafeMode 
                      ? "bg-amber-50 text-amber-700 border-amber-200" 
                      : hasQuotaError 
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  )}
                >
                  {isSafeMode ? (
                    <> <ZapOff className="h-4 w-4" /> Offline Mode (Safe) </>
                  ) : (
                    <> <Globe className="h-4 w-4 animate-pulse" /> Live Sync Active </>
                  )}
                </button>
              </div>
              <Link to="/" className="block px-3 py-3 text-base font-medium text-slate-700 hover:bg-indigo-50 hover:text-[#4F46E5] rounded-md">Home</Link>
              <Link to="/#courses" onClick={scrollToCourses} className="block px-3 py-3 text-base font-medium text-slate-700 hover:bg-indigo-50 hover:text-[#4F46E5] rounded-md">Courses</Link>
              <Link to="/success-stories" className="block px-3 py-3 text-base font-medium text-slate-700 hover:bg-indigo-50 hover:text-[#4F46E5] rounded-md">Success Stories</Link>
              {user ? (
                <>
                  <div className="flex items-center space-x-3 px-3 py-4 border-b border-slate-50 mb-2">
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center shrink-0">
                      {profile?.photoURL ? (
                        <img src={profile.photoURL} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <User className="h-6 w-6 text-[#4F46E5]" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{profile?.displayName || 'Student'}</span>
                      <span className="text-xs text-slate-500">{user.email}</span>
                    </div>
                  </div>
                  <Link 
                    to={isAdmin ? "/admin" : "/dashboard"} 
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-3 text-base font-medium text-slate-700 hover:bg-indigo-50 hover:text-[#4F46E5] rounded-md"
                  >
                    Dashboard
                  </Link>
                  <button onClick={handleSignOut} className="w-full text-left block px-3 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-md">Sign Out</button>
                </>
              ) : (
                <div className="px-3 py-2">
                  <AuthModal fullWidth />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
