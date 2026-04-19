import React from 'react';
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  where,
  getDoc,
  getDocs,
  limit,
  increment
} from 'firebase/firestore';
import { Course, Enrollment, UserProfile } from '../types';
import { Button, buttonVariants } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { cn } from '../lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  Users, 
  BookOpen, 
  IndianRupee,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    revenue: 0,
    totalStudents: 0,
    totalCourses: 0,
    pendingEnrollments: 0
  });

  const fetchData = async (showToast = false) => {
    if (showToast) setIsRefreshing(true);
    try {
      const [courseSnap, userSnap, enrollSnap] = await Promise.all([
        getDocs(collection(db, 'courses')),
        getDocs(query(collection(db, 'users'), limit(500))),
        getDocs(query(collection(db, 'enrollments'), orderBy('createdAt', 'desc'), limit(500)))
      ]);

      const courseList = courseSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
      const userList = userSnap.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile));
      const enrollmentList = enrollSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Enrollment));

      setCourses(courseList);
      setUsers(userList);
      setEnrollments(enrollmentList);

      const revenue = enrollmentList.filter(e => e.status === 'approved').reduce((acc, curr) => {
        const course = courseList.find(c => c.id === curr.courseId);
        return acc + (course?.price || 0);
      }, 0);

      setStats({
        revenue,
        totalCourses: courseList.length,
        totalStudents: userList.filter(u => u.role === 'student').length,
        pendingEnrollments: enrollmentList.filter(e => e.status === 'pending').length
      });

      if (showToast) toast.success("Dashboard data updated");
    } catch (error: any) {
      if (error.code === 'resource-exhausted') {
        toast.error("Database quota exceeded. Please try again later.");
      } else {
        console.error("Dashboard error:", error);
        toast.error("Failed to load dashboard data.");
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-bold font-display text-slate-900 mb-2">Admin Command Center</h1>
          <p className="text-slate-500">Manage courses, student enrollments, and platform settings.</p>
        </div>
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={() => fetchData(true)} 
            disabled={isRefreshing}
            className="rounded-2xl h-12 px-6 border-slate-200"
          >
            <RefreshCw className={cn("mr-2 h-4 w-4", isRefreshing && "animate-spin")} />
            Refresh Data
          </Button>
          <CourseForm onMutation={() => fetchData()} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard title="Total Revenue" value={`₹${stats.revenue}`} icon={<IndianRupee className="h-6 w-6 text-[#4F46E5]" />} />
        <StatCard title="Active Students" value={stats.totalStudents} icon={<Users className="h-6 w-6 text-[#4F46E5]" />} />
        <StatCard title="Total Courses" value={stats.totalCourses} icon={<BookOpen className="h-6 w-6 text-[#4F46E5]" />} />
        <StatCard title="Pending Verifications" value={stats.pendingEnrollments} icon={<TrendingUp className="h-6 w-6 text-[#4F46E5]" />} />
      </div>

      <Tabs defaultValue="enrollments" className="w-full">
        <TabsList className="mb-8 p-1 bg-slate-100 rounded-xl flex w-full max-w-lg overflow-x-auto scrollbar-hide">
          <TabsTrigger value="enrollments" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm border-none py-2 px-4 whitespace-nowrap">Enrollments</TabsTrigger>
          <TabsTrigger value="courses" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm border-none py-2 px-4 whitespace-nowrap">Courses</TabsTrigger>
          <TabsTrigger value="users" className="flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm border-none py-2 px-4 whitespace-nowrap">Users</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <TabsContent value="enrollments" className="space-y-6 m-0">
              <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                  <CardTitle className="font-display">Incoming Enrollment Requests</CardTitle>
                  <CardDescription>Review proof of payment and approve access to courses.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent border-slate-100">
                          <TableHead className="py-4 px-6 min-w-[200px]">Student</TableHead>
                          <TableHead className="min-w-[150px]">Course</TableHead>
                          <TableHead className="min-w-[150px]">Transaction ID</TableHead>
                          <TableHead className="min-w-[120px]">Proof</TableHead>
                          <TableHead className="min-w-[100px]">Status</TableHead>
                          <TableHead className="text-right px-6 min-w-[150px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {enrollments.length > 0 ? enrollments.map((enr) => (
                          <TableRow key={enr.id} className="hover:bg-slate-50/50 transition-colors border-slate-100">
                            <TableCell className="px-6 font-medium">
                              <div className="flex flex-col">
                                <span>{enr.studentName}</span>
                                <span className="text-xs text-slate-400">{enr.studentEmail}</span>
                              </div>
                            </TableCell>
                            <TableCell>{enr.courseTitle}</TableCell>
                            <TableCell className="font-mono text-xs">{enr.transactionId}</TableCell>
                            <TableCell>
                              <Dialog>
                                <DialogTrigger 
                                  className={cn(buttonVariants({ variant: "outline", size: "sm", className: "h-8 px-2" }))}>
                                  View Proof
                                </DialogTrigger>
                                <DialogContent className="max-w-[95vw] sm:max-w-lg">
                                  <DialogHeader>
                                    <DialogTitle>Proof of Payment</DialogTitle>
                                  </DialogHeader>
                                  <div className="mt-4">
                                    <img src={enr.proofImage} alt="Payment Proof" className="w-full rounded-lg" />
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                            <TableCell>
                              <Badge variant={enr.status === 'approved' ? 'default' : enr.status === 'pending' ? 'secondary' : 'destructive'} className={enr.status === 'approved' ? 'bg-indigo-100 text-indigo-800 border-none' : ''}>
                                {enr.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right px-6">
                              {enr.status === 'pending' && (
                                <div className="flex justify-end space-x-2">
                                  <Button size="icon" variant="ghost" className="h-9 w-9 text-[#22C55E] hover:bg-green-50 hover:text-[#16a34a] rounded-full" onClick={() => handleApprove(enr)}>
                                    <CheckCircle2 className="h-5 w-5" />
                                  </Button>
                                  <Button size="icon" variant="ghost" className="h-9 w-9 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-full" onClick={() => handleReject(enr.id)}>
                                    <XCircle className="h-5 w-5" />
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        )) : (
                          <TableRow>
                            <TableCell colSpan={6} className="h-32 text-center text-slate-400">No enrollment requests yet.</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="courses">
              <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
                 <CardContent className="p-0">
                   <div className="overflow-x-auto">
                     <Table>
                       <TableHeader>
                         <TableRow className="hover:bg-transparent border-slate-100">
                           <TableHead className="py-4 px-6 min-w-[80px]">Thumbnail</TableHead>
                           <TableHead className="min-w-[150px]">Course Title</TableHead>
                           <TableHead className="min-w-[120px]">Category</TableHead>
                           <TableHead className="min-w-[100px]">Price</TableHead>
                           <TableHead className="min-w-[100px]">Lessons</TableHead>
                           <TableHead className="text-right px-6 min-w-[120px]">Actions</TableHead>
                         </TableRow>
                       </TableHeader>
                       <TableBody>
                         {courses.length > 0 ? courses.map((course) => (
                           <TableRow key={course.id} className="hover:bg-slate-50/50 border-slate-100">
                             <TableCell className="px-6">
                               <img src={course.thumbnail} className="h-12 w-12 object-cover rounded-lg" alt={course.title} height={48} width={48} />
                             </TableCell>
                             <TableCell className="font-bold">{course.title}</TableCell>
                             <TableCell>
                               <Badge variant="outline">{course.category}</Badge>
                             </TableCell>
                             <TableCell className="font-bold">₹{course.price}</TableCell>
                             <TableCell>{course.lessons?.length || 0} items</TableCell>
                             <TableCell className="text-right px-6">
                               <div className="flex justify-end space-x-1">
                                 <CourseForm editData={course} onMutation={() => fetchData()} />
                                 <Dialog>
                                   <DialogTrigger 
                                     className={cn(buttonVariants({ variant: "ghost", size: "icon-sm", className: "h-9 w-9 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-full flex items-center justify-center transition-all hover:rotate-12 hover:scale-110" }))}>
                                     <Trash2 className="h-4 w-4" />
                                   </DialogTrigger>
                                   <DialogContent className="sm:max-w-md">
                                     <DialogHeader>
                                       <DialogTitle className="text-xl font-display text-red-600">Delete Course?</DialogTitle>
                                       <DialogDescription>
                                         Are you sure you want to permanently delete <span className="font-bold text-slate-900">"{course.title}"</span>? This will remove access for all enrolled students.
                                       </DialogDescription>
                                     </DialogHeader>
                                     <DialogFooter className="mt-4">
                                       <DialogClose className="px-6 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-medium transition-all mr-2">
                                         Cancel
                                       </DialogClose>
                                       <Button 
                                         variant="destructive" 
                                         onClick={() => handleDeleteCourse(course.id)}
                                         className="rounded-xl px-6 font-bold shadow-lg shadow-red-100"
                                       >
                                         Confirm Delete
                                       </Button>
                                     </DialogFooter>
                                   </DialogContent>
                                 </Dialog>
                               </div>
                             </TableCell>
                           </TableRow>
                         )) : (
                           <TableRow>
                             <TableCell colSpan={6} className="h-32 text-center text-slate-400">No courses defined.</TableCell>
                           </TableRow>
                         )}
                       </TableBody>
                     </Table>
                   </div>
                 </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
                 <CardContent className="p-0">
                   <div className="overflow-x-auto">
                     <Table>
                       <TableHeader>
                         <TableRow className="hover:bg-transparent border-slate-100">
                           <TableHead className="py-4 px-6 min-w-[150px]">User</TableHead>
                           <TableHead className="min-w-[150px]">Email</TableHead>
                           <TableHead className="min-w-[120px]">Phone</TableHead>
                           <TableHead className="min-w-[100px]">Role</TableHead>
                           <TableHead className="min-w-[100px]">Status</TableHead>
                           <TableHead className="min-w-[120px]">Enrolled</TableHead>
                           <TableHead className="text-right px-6 min-w-[200px]">Actions</TableHead>
                         </TableRow>
                       </TableHeader>
                       <TableBody>
                         {users.map((user) => (
                           <TableRow key={user.uid} className="hover:bg-slate-50/50 border-slate-100">
                             <TableCell className="px-6 font-medium">{user.displayName || 'Unnamed'}</TableCell>
                             <TableCell>{user.email}</TableCell>
                             <TableCell className="text-slate-500">{user.phoneNumber || '-'}</TableCell>
                             <TableCell>
                               <Badge variant={user.role === 'admin' ? 'default' : 'outline'} className={user.role === 'admin' ? 'bg-slate-900' : ''}>
                                 {user.role}
                               </Badge>
                             </TableCell>
                             <TableCell>
                               <Badge variant={user.isBlocked ? 'destructive' : 'secondary'} className={user.isBlocked ? 'bg-red-100 text-red-700 border-none' : 'bg-green-100 text-green-700 border-none'}>
                                 {user.isBlocked ? 'Blocked' : 'Active'}
                               </Badge>
                             </TableCell>
                             <TableCell>{user.enrolledCourses?.length || 0} courses</TableCell>
                             <TableCell className="text-right px-6">
                               <div className="flex justify-end items-center gap-2">
                                 <Button variant="ghost" size="sm" onClick={() => handleToggleRole(user.uid, user.role)} className="whitespace-nowrap h-8">
                                    Make {user.role === 'admin' ? 'Student' : 'Admin'}
                                 </Button>
                                 <Button 
                                   variant={user.isBlocked ? "outline" : "destructive"} 
                                   size="sm" 
                                   onClick={() => handleToggleBlock(user.uid, user.isBlocked || false)}
                                   className="h-8 min-w-[80px]"
                                 >
                                    {user.isBlocked ? 'Unblock' : 'Block'}
                                 </Button>
                               </div>
                             </TableCell>
                           </TableRow>
                         ))}
                       </TableBody>
                     </Table>
                   </div>
                 </CardContent>
              </Card>
            </TabsContent>
          </div>

          <aside className="lg:col-span-1">
            <h2 className="text-xl font-bold font-display flex items-center gap-2 mb-6">
              <div className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
              Users Tracker
            </h2>
            <div className="bg-slate-900 rounded-[2.5rem] p-6 shadow-2xl space-y-4 max-h-[700px] overflow-y-auto border border-slate-800 scrollbar-hide">
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-4 opacity-50">Latest Activity</p>
              {users.map((user) => (
                <div key={user.uid} className="bg-white/5 p-4 rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-all group backdrop-blur-sm">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-white font-bold text-sm truncate pr-2">{user.displayName || 'Anonymous User'}</p>
                    <div className="text-[8px] text-indigo-300 font-bold bg-indigo-500/20 px-2 py-0.5 rounded-full uppercase tracking-tighter">Live</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[10px] text-slate-400 font-medium truncate">{user.email}</p>
                      {user.phoneNumber && (
                        <p className="text-[10px] text-indigo-400 font-bold">{user.phoneNumber}</p>
                      )}
                    </div>
                    <div className="pt-2 border-t border-white/5 text-[9px] text-slate-600 flex justify-between items-center">
                      <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                      <span className="text-slate-500">{user.role}</span>
                    </div>
                  </div>
                </div>
              ))}
              {users.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-slate-600 text-xs italic">Waiting for users...</p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </Tabs>
    </div>
  );

  async function handleApprove(enr: Enrollment) {
    try {
      // 1. Update enrollment status
      await updateDoc(doc(db, 'enrollments', enr.id), {
        status: 'approved',
        updatedAt: new Date().toISOString()
      });

      // 2. Grant course access to student
      const studentDoc = await getDoc(doc(db, 'users', enr.studentUid));
      if (studentDoc.exists()) {
        const enrolled = studentDoc.data().enrolledCourses || [];
        if (!enrolled.includes(enr.courseId)) {
          await updateDoc(doc(db, 'users', enr.studentUid), {
            enrolledCourses: [...enrolled, enr.courseId]
          });
        }
      }

      // Track last approved action locally (as requested)
      localStorage.setItem(`last_approved_${enr.id}`, 'approved');
      
      toast.success('Enrollment approved!');
      fetchData();
    } catch (e: any) {
      toast.error(e.message);
    }
  }

   async function handleReject(id: string) {
    const reason = prompt('Please enter a reason for rejection (e.g. Transaction not found):');
    if (reason === null) return;
    try {
      await updateDoc(doc(db, 'enrollments', id), {
        status: 'rejected',
        rejectionReason: reason || 'Payment proof not valid.',
        updatedAt: new Date().toISOString()
      });
      toast.success('Enrollment rejected');
      fetchData();
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  async function handleDeleteCourse(id: string) {
    try {
      await deleteDoc(doc(db, 'courses', id));
      toast.success('Course deleted successfully');
      fetchData();
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  async function handleToggleRole(uid: string, currentRole: string) {
    const newRole = currentRole === 'admin' ? 'student' : 'admin';
    try {
      await updateDoc(doc(db, 'users', uid), { role: newRole });
      toast.success(`User role updated to ${newRole}`);
      fetchData();
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  async function handleToggleBlock(uid: string, currentStatus: boolean) {
    const newStatus = !currentStatus;
    try {
      await updateDoc(doc(db, 'users', uid), { isBlocked: newStatus });
      
      // Symbolic localStorage update (as requested)
      localStorage.setItem(`user_status_${uid}`, newStatus ? 'blocked' : 'active');
      
      toast.success(`User ${newStatus ? 'blocked' : 'unblocked'} successfully`);
      fetchData();
    } catch (e: any) {
      toast.error(e.message);
    }
  }
}

function StatCard({ title, value, icon }: { title: string, value: string | number, icon: any }) {
  return (
    <Card className="border-none shadow-lg rounded-3xl bg-white overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-indigo-50 rounded-2xl">
            {icon}
          </div>
        </div>
        <div>
          <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function CourseForm({ editData, onMutation }: { editData?: Course, onMutation?: () => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(editData?.title || '');
  const [description, setDescription] = useState(editData?.description || '');
  const [price, setPrice] = useState(editData?.price.toString() || '');
  const [category, setCategory] = useState(editData?.category || '');
  const [thumbnail, setThumbnail] = useState(editData?.thumbnail || '');
  const [lessons, setLessons] = useState(editData?.lessons?.join('\n') || '');
  const [whatsapp, setWhatsapp] = useState(editData?.whatsappMessage || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const courseData = {
      title,
      description,
      price: parseFloat(price),
      category,
      thumbnail: thumbnail || `https://picsum.photos/seed/${title}/800/600`,
      lessons: lessons.split('\n').filter(l => l.trim()),
      whatsappMessage: whatsapp,
      updatedAt: new Date().toISOString()
    };

    try {
      if (editData) {
        await updateDoc(doc(db, 'courses', editData.id), courseData);
        toast.success('Course updated');
      } else {
        await addDoc(collection(db, 'courses'), {
          ...courseData,
          createdAt: new Date().toISOString()
        });
        toast.success('Course created');
      }
      setOpen(false);
      onMutation?.();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        className={cn(buttonVariants({ className: editData ? "h-9 w-9 text-slate-400 hover:text-indigo-600 rounded-full flex items-center justify-center font-sans tracking-tight" : "bg-[#4F46E5] hover:bg-[#4338CA] font-bold px-6 h-12 rounded-2xl shadow-lg shadow-indigo-100 text-white" }), editData ? "bg-transparent border-none" : "")}
      >
        {editData ? <Pencil className="h-4 w-4" /> : <><Plus className="mr-2 h-5 w-5" /> New Course</>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] h-[90vh] overflow-y-auto rounded-3xl p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">{editData ? 'Edit Course' : 'Create New Course'}</DialogTitle>
          <DialogDescription>Fill in the course details below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Course Title</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Master Kurti Cutting" />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input value={category} onChange={e => setCategory(e.target.value)} required placeholder="e.g. Basic, Advanced" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Price (₹)</Label>
              <Input type="number" value={price} onChange={e => setPrice(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Thumbnail URL (Optional)</Label>
              <Input value={thumbnail} onChange={e => setThumbnail(e.target.value)} placeholder="https://..." />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} required rows={3} />
          </div>
          <div className="space-y-2">
            <Label>Lesson Titles (One per line)</Label>
            <Textarea value={lessons} onChange={e => setLessons(e.target.value)} rows={5} placeholder="Lesson 1: Tools Required\nLesson 2: Basic Patterns..." />
          </div>
          <div className="space-y-2">
             <Label>WhatsApp Message (Optional)</Label>
             <Input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="e.g. Hi, I enrolled in this course, please send lessons." />
          </div>
          <DialogFooter className="sticky bottom-0 bg-white pt-4">
            <Button type="submit" disabled={loading} className="w-full h-12 bg-[#4F46E5] hover:bg-[#4338CA] font-bold text-white">
              {loading ? 'Saving...' : editData ? 'Update Course' : 'Create Course'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
