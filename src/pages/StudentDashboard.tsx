import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, documentId } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Enrollment, Course } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  MessageCircle, 
  GraduationCap, 
  HelpCircle,
  ExternalLink,
  AlertCircle,
  X,
  User as UserIcon,
  RefreshCw
} from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ProfileEditModal } from '../components/ProfileEditModal';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

export default function StudentDashboard() {
  const { user, profile, isAdmin, refreshProfile } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [pendingEnrollments, setPendingEnrollments] = useState<Enrollment[]>([]);
  const [approvedEnrollments, setApprovedEnrollments] = useState<Enrollment[]>([]);
  const [dismissedApprovals, setDismissedApprovals] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (isAdmin) return <Navigate to="/admin" replace />;

  useEffect(() => {
    // Load dismissed approvals from localStorage
    const saved = localStorage.getItem('dismissedApprovals');
    if (saved) {
      setDismissedApprovals(JSON.parse(saved));
    }
  }, []);

  const fetchDashboardData = async (manual = false) => {
    if (!user) return;
    if (manual) setIsRefreshing(true);
    try {
      // 0. Refresh profile if manual
      if (manual) {
        await refreshProfile();
      }

      // 1. Fetch Enrolled Courses
      const courseIds = profile?.enrolledCourses || [];
      if (courseIds.length > 0) {
        const q = query(collection(db, 'courses'), where(documentId(), 'in', courseIds));
        const courseSnap = await getDocs(q);
        setEnrolledCourses(courseSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course)));
      } else {
        setEnrolledCourses([]);
      }

      // 2. Fetch Enrollments
      const qEnroll = query(collection(db, 'enrollments'), where('studentUid', '==', user.uid));
      const enrollSnap = await getDocs(qEnroll);
      const all = enrollSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Enrollment));
      
      setPendingEnrollments(all.filter(e => e.status !== 'approved'));
      setApprovedEnrollments(all.filter(e => e.status === 'approved'));
      if (manual) toast.success("Dashboard refreshed");
    } catch (e: any) {
      if (e.code === 'resource-exhausted') {
        toast.error("Database quota exceeded.");
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user, (profile?.enrolledCourses || []).join(',')]);

  const handleDismissApproval = (id: string) => {
    const newDismissed = [...dismissedApprovals, id];
    setDismissedApprovals(newDismissed);
    localStorage.setItem('dismissedApprovals', JSON.stringify(newDismissed));
  };

  const activeApprovals = approvedEnrollments.filter(e => !dismissedApprovals.includes(e.id));

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading your dashboard...</div>;

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence>
          {activeApprovals.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-8"
            >
              {activeApprovals.map(enr => (
                <div key={enr.id} className="relative bg-[#F0FDF4] border border-[#BBF7D0] p-6 sm:p-8 rounded-[2rem] shadow-sm flex flex-col items-center justify-center text-center group">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 bg-[#DCFCE7] text-[#166534] rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <h3 className="text-[#166534] font-bold text-base sm:text-lg mb-1">Payment Approved!</h3>
                  <p className="text-[#15803D] text-sm sm:text-base font-medium leading-relaxed max-w-lg">
                    Your payment for <span className="font-bold underline">"{enr.courseTitle}"</span> has been approved. 
                    Your course link will be sent to your WhatsApp within 24 hours.
                  </p>
                  <button 
                    onClick={() => handleDismissApproval(enr.id)}
                    className="absolute top-4 right-4 p-2 text-[#15803D]/50 hover:text-[#15803D] hover:bg-[#DCFCE7] rounded-full transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-[2rem] overflow-hidden bg-white shadow-xl border-4 border-white flex items-center justify-center shrink-0">
              {profile?.photoURL ? (
                <img src={profile.photoURL} alt={profile.displayName} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <UserIcon className="h-10 w-10 text-slate-200" />
              )}
            </div>
            <div>
              <Badge className="bg-indigo-100 text-indigo-800 border-none mb-2 py-1 px-3">Student Portal</Badge>
              <h1 className="text-4xl font-bold font-display text-slate-900 mb-1">Welcome back, {profile?.displayName || 'User'}!</h1>
              <p className="text-slate-500">Track your progress and access your tailoring lessons.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={() => fetchDashboardData(true)} 
              disabled={isRefreshing}
              className="rounded-2xl h-12 px-6 border-slate-200"
            >
              <RefreshCw className={cn("mr-2 h-4 w-4", isRefreshing && "animate-spin")} />
              Refresh
            </Button>
            <ProfileEditModal />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Enrolled Courses */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-bold font-display flex items-center gap-2">
              <GraduationCap className="h-7 w-7 text-indigo-600" />
              Your Courses
            </h2>
            
            {enrolledCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {enrolledCourses.map((course) => (
                  <motion.div key={course.id} whileHover={{ y: -5 }}>
                    <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden flex flex-col h-full">
                      <div className="relative h-40">
                        <img src={course.thumbnail} className="w-full h-full object-cover" alt={course.title} referrerPolicy="no-referrer" />
                        <Badge className="absolute top-4 right-4 bg-[#4F46E5]">Enrolled</Badge>
                      </div>
                      <CardHeader>
                        <CardTitle className="font-display group-hover:text-indigo-600 transition-colors line-clamp-1">{course.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                      </CardHeader>
                      <CardFooter className="mt-auto border-t border-slate-100 pt-6">
                        <Button 
                          nativeButton={false}
                          render={
                            <a 
                              href={`https://wa.me/8660888419?text=${encodeURIComponent(`Hi, I'm ${profile?.displayName}. I'm enrolled in "${course.title}". Please send me the latest lessons.`)}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            />
                          }
                          className="w-full bg-[#25D366] hover:bg-[#128C7E] font-bold rounded-xl h-11"
                        >
                          <MessageCircle className="mr-2 h-5 w-5" /> Access Lessons
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-[2rem] shadow-xl text-center border border-dashed border-slate-200">
                <BookOpen className="h-16 w-16 text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Active Courses</h3>
                <p className="text-slate-500 mb-8 max-w-sm mx-auto">You haven't enrolled in any courses yet. Start your tailoring journey today!</p>
                <Button 
                  nativeButton={false}
                  render={<Link to="/" />}
                  className="bg-[#4F46E5] hover:bg-[#4338CA] font-bold px-8 h-12 rounded-2xl"
                >
                  Browse Catalog
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar: Status & Verification */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold font-display flex items-center gap-2">
              <Clock className="h-7 w-7 text-amber-600" />
              Verification Status
            </h2>

            {pendingEnrollments.length > 0 ? (
               <div className="space-y-4">
                 {pendingEnrollments.map((enr) => (
                   <Card key={enr.id} className="border-none shadow-lg rounded-3xl overflow-hidden bg-white border-l-4 border-l-amber-400">
                     <CardContent className="p-6">
                       <div className="flex justify-between items-start mb-4">
                         <div className="font-bold text-slate-900">{enr.courseTitle}</div>
                         <Badge variant={enr.status === 'pending' ? 'secondary' : 'destructive'} className="rounded-full px-3">
                           {enr.status === 'pending' ? 'Pending' : 'Rejected'}
                         </Badge>
                       </div>
                       
                       <div className="flex items-center text-xs text-slate-400 font-mono mb-4">
                         <span>TX: {enr.transactionId}</span>
                       </div>

                       {enr.status === 'rejected' && enr.rejectionReason && (
                          <div className="mt-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl flex gap-2">
                             <AlertCircle className="h-4 w-4 shrink-0" />
                             <p><strong>Reason:</strong> {enr.rejectionReason}</p>
                          </div>
                       )}

                       {enr.status === 'pending' && (
                         <div className="mt-4 flex flex-col gap-2">
                           <div className="flex items-center gap-2 text-xs text-amber-700 font-medium">
                              <Clock className="h-3 w-3" />
                              Your payment is under verification.
                           </div>
                           <p className="text-[10px] text-slate-400">Usually takes 2-4 hours.</p>
                         </div>
                       )}
                     </CardContent>
                   </Card>
                 ))}
               </div>
            ) : (
              <div className="bg-slate-200/30 p-8 rounded-3xl text-center border-2 border-dashed border-slate-200">
                <p className="text-slate-400 text-sm">No pending verifications</p>
              </div>
            )}

            <Card className="border-none bg-[#4F46E5] text-white rounded-[2rem] p-8 shadow-xl shadow-indigo-200">
              <HelpCircle className="h-10 w-10 mb-4 opacity-50" />
              <h3 className="text-xl font-bold font-display mb-2">Need Help?</h3>
              <p className="text-indigo-100 text-sm mb-6 leading-relaxed">Having issues with enrollment or payment? Our support team is available on WhatsApp.</p>
              <Button 
                nativeButton={false}
                render={<a href="https://wa.me/8660888419" target="_blank" rel="noopener" />}
                variant="secondary" 
                className="w-full bg-white text-indigo-700 hover:bg-indigo-50 font-bold rounded-xl"
              >
                 Contact Support
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
