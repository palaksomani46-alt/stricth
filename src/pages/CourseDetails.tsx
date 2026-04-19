import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { dataService } from '../lib/dataService';
import { useAuth } from '../context/AuthContext';
import { Course, Enrollment } from '../types';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { 
  CheckCircle2, 
  ShieldCheck,
  MessageCircle, 
  ChevronLeft, 
  IndianRupee, 
  Clock, 
  BookOpen, 
  Upload, 
  AlertCircle,
  FileImage,
  ArrowRight,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { AuthModal } from '../components/AuthModal';

export default function CourseDetails() {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  
  // Form State
  const [studentName, setStudentName] = useState(profile?.displayName || '');
  const [studentPhone, setStudentPhone] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const WHATSAPP_NUMBER = "8660888419";

  useEffect(() => {
    if (!id) return;

    const fetchCourse = async () => {
      try {
        const found = await dataService.getCourseById(id);
        setCourse(found);
      } catch (e) {
        console.warn("CourseDetails: error loading course", e);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const fetchEnrollment = async () => {
    if (!id || !user) return;
    try {
      const q = query(collection(db, 'enrollments'), where('studentUid', '==', user.uid), where('courseId', '==', id));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setEnrollment({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Enrollment);
      } else {
        setEnrollment(null);
      }
    } catch (error: any) {
      if (error.code === 'resource-exhausted') {
        console.warn("CourseDetails: Quota exceeded");
      }
    }
  };

  useEffect(() => {
    fetchEnrollment();
  }, [id, user]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit for Base64 storage
         toast.error("Image too large. Please keep it under 1MB.");
         return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitEnrollment = async () => {
    if (!transactionId || !proofImage) {
      toast.error("Please fill in all payment details.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'enrollments'), {
        studentUid: user?.uid,
        studentEmail: user?.email,
        studentName,
        studentPhone,
        courseId: id,
        courseTitle: course?.title,
        coursePrice: course?.price,
        transactionId,
        proofImage,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      toast.success("Enrollment request submitted! Your payment is under verification.");
      fetchEnrollment();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hi, I've enrolled in the "${course?.title}" course at Stitch Toppers. My transaction ID is: ${transactionId}. Please verify and send the lessons.`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!course) return <div className="min-h-screen flex items-center justify-center font-display text-2xl">Course Not Found</div>;

  const isEnrolled = profile?.enrolledCourses?.includes(course.id) || enrollment?.status === 'approved';

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Hero Banner */}
      <div className="bg-slate-900 text-white pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <BookOpen className="h-64 w-64 text-white" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link to="/" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 mb-8 transition-colors">
            <ChevronLeft className="h-5 w-5 mr-1" /> Back to Courses
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-[#4F46E5] border-none mb-6 px-4 py-1.5 text-sm font-bold">{course.category}</Badge>
              <h1 className="text-4xl lg:text-6xl font-bold font-display leading-tight mb-6">{course.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-slate-400 mb-8">
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-indigo-500" />
                  <span>{course.lessons?.length || 0} Lessons</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-indigo-500" />
                  <span>Self-paced Learning</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2 text-indigo-500" />
                  <span>WhatsApp Support</span>
                </div>
              </div>
            </div>
            <div className="order-first lg:order-last">
               <img 
                 src={course.thumbnail} 
                 alt={course.title} 
                 className="w-full aspect-video object-cover rounded-[2rem] shadow-2xl border-4 border-white/10"
                 referrerPolicy="no-referrer"
               />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section className="bg-white p-8 sm:p-12 rounded-[2rem] shadow-xl shadow-slate-200/50">
              <h2 className="text-2xl font-bold font-display mb-6 pb-4 border-b border-slate-100">Course Overview</h2>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-lg">
                <p>{course.description}</p>
              </div>
            </section>

            <section className="bg-white p-8 sm:p-12 rounded-[2rem] shadow-xl shadow-slate-200/50">
              <h2 className="text-2xl font-bold font-display mb-6 pb-4 border-b border-slate-100">Syllabus ({course.lessons?.length || 0} Items)</h2>
              <div className="grid grid-cols-1 gap-4">
                {course.lessons?.map((lesson, idx) => (
                  <div key={idx} className="flex items-center p-5 rounded-2xl bg-slate-50 border border-slate-100 group transition-all hover:bg-indigo-50 hover:border-indigo-200">
                    <span className="h-10 w-10 shrink-0 bg-white shadow-sm border border-slate-200 rounded-xl flex items-center justify-center font-bold text-[#4F46E5] group-hover:scale-110 transition-transform">
                      {idx + 1}
                    </span>
                    <span className="ml-4 font-medium text-slate-700">{lesson}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Enrollment Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden">
                <CardHeader className="bg-[#4F46E5] text-white p-8">
                  <CardTitle className="text-4xl font-bold font-display">₹{course.price}</CardTitle>
                  <CardDescription className="text-indigo-100 font-medium mt-2">One-time payment. Lifetime access.</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  {isEnrolled ? (
                    <div className="space-y-6">
                      <div className="flex flex-col items-center text-center p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                        <CheckCircle2 className="h-12 w-12 text-[#4F46E5] mb-4" />
                        <h3 className="font-bold text-indigo-900 text-lg">You are Enrolled!</h3>
                        <p className="text-sm text-indigo-700 mt-2">A verified student badge has been added to your profile.</p>
                      </div>
                      <Button onClick={handleWhatsApp} size="lg" className="w-full bg-[#25D366] hover:bg-[#128C7E] h-14 text-lg font-bold rounded-2xl">
                        <MessageCircle className="h-6 w-6 mr-2" /> Get Lessons on WhatsApp
                      </Button>
                      <p className="text-center text-xs text-slate-400">Lessons will be delivered via a private WhatsApp group or direct message by the academy administrator.</p>
                    </div>
                  ) : enrollment && enrollment.status === 'pending' ? (
                    <div className="flex flex-col items-center text-center p-8 bg-amber-50 rounded-2xl border border-amber-100">
                      <Clock className="h-12 w-12 text-amber-600 mb-4 animate-pulse" />
                      <h3 className="font-bold text-amber-900 text-lg">Verification in Progress</h3>
                      <p className="text-sm text-amber-700 mt-2">We're verifying your transaction ({enrollment.transactionId}). Usually takes 2-4 hours.</p>
                    </div>
                  ) : !user ? (
                    <div className="space-y-4">
                      <p className="text-slate-600 text-sm text-center mb-4">Please sign in to enroll in this course.</p>
                      <AuthModal fullWidth />
                    </div>
                  ) : profile?.isBlocked ? (
                    <div className="flex flex-col items-center text-center p-8 bg-red-50 rounded-2xl border border-red-100">
                      <Lock className="h-12 w-12 text-red-600 mb-4" />
                      <h3 className="font-bold text-red-900 text-lg">Account Blocked</h3>
                      <p className="text-sm text-red-700 mt-2 leading-relaxed">Enrollment is restricted for your account. Please contact support to resolve this.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* 3 Step Flow */}
                      <div className="flex justify-between mb-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className={`h-1.5 flex-1 rounded-full mx-1 ${step >= i ? 'bg-[#4F46E5]' : 'bg-slate-200'}`} />
                        ))}
                      </div>

                      <AnimatePresence mode='wait'>
                        <motion.div
                          key={step}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                        >
                          {step === 1 && (
                            <div className="space-y-4">
                              <div className="flex justify-between items-center bg-slate-100 p-4 rounded-2xl mb-4">
                                <div>
                                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Course Price</p>
                                  <p className="text-xl font-bold text-slate-900 font-display">₹{course.price}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Status</p>
                                  <Badge variant="outline" className="text-[10px] h-5 border-slate-300">Read-Only</Badge>
                                </div>
                              </div>
                              
                              <h4 className="font-bold text-slate-800">1. Student Details</h4>
                              <div className="space-y-3">
                                <div>
                                  <Label className="text-xs text-slate-500 mb-1 block">Full Name</Label>
                                  <Input value={studentName} onChange={e => setStudentName(e.target.value)} required placeholder="Enter your full name" />
                                </div>
                                <div>
                                  <Label className="text-xs text-slate-500 mb-1 block">Email Address</Label>
                                  <Input value={user?.email || ''} readOnly className="bg-slate-50 text-slate-500 border-dashed" />
                                </div>
                                <div>
                                  <Label className="text-xs text-slate-500 mb-1 block">Phone Number (WhatsApp)</Label>
                                  <Input value={studentPhone} onChange={e => setStudentPhone(e.target.value)} placeholder="+91 ..." required />
                                </div>
                              </div>
                              <Button onClick={() => setStep(2)} disabled={!studentName || !studentPhone} className="w-full h-14 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 mt-2">
                                Next Step <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </div>
                          )}

                          {step === 2 && (
                            <div className="space-y-4">
                              <h4 className="font-bold text-slate-800">2. Payment Instructions</h4>
                              <div className="p-5 bg-slate-900 text-white rounded-[1.5rem] border border-slate-800 shadow-xl">
                                <p className="text-[10px] text-slate-400 mb-2 font-bold tracking-widest uppercase">MEMBER PAYMENT NUMBER</p>
                                <div className="flex items-center justify-between">
                                  <p className="text-2xl font-mono font-bold text-[#FACC15]">{WHATSAPP_NUMBER}</p>
                                  <Badge className="bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20 text-[10px]">Active</Badge>
                                </div>
                                <Separator className="my-4 bg-white/5" />
                                <div className="flex justify-between items-end">
                                  <div>
                                    <p className="text-[10px] text-slate-400 mb-1 uppercase font-bold tracking-wider">Required Amount</p>
                                    <p className="text-2xl font-display font-bold">₹{course.price}</p>
                                  </div>
                                  <div className="text-right">
                                    <Badge className="bg-amber-500/10 text-amber-500 border-none text-[9px] mb-1">Strict Policy</Badge>
                                    <p className="text-[9px] text-slate-500">No under/over payment</p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-start gap-3 text-xs text-slate-600 bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
                                <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
                                <div className="space-y-1">
                                  <p className="font-bold text-amber-900">Important Instructions:</p>
                                  <ul className="list-disc list-inside space-y-1 opacity-80">
                                    <li>Pay exactly <span className="font-bold">₹{course.price}</span></li>
                                    <li>Pay via GPay, PhonePe or Paytm to the number above</li>
                                    <li>Screenshot the payment confirmation</li>
                                  </ul>
                                </div>
                              </div>
                              <Button onClick={() => setStep(3)} className="w-full h-14 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 mt-2">
                                I've Paid! Upload Proof <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                              <Button variant="ghost" onClick={() => setStep(1)} className="w-full text-slate-400 hover:text-slate-600">Back</Button>
                            </div>
                          )}

                          {step === 3 && (
                            <div className="space-y-4">
                              <h4 className="font-bold text-slate-800">3. Submit Proof</h4>
                              <div className="space-y-3">
                                <div>
                                  <Label className="text-xs text-slate-500 mb-1 block">Transaction ID</Label>
                                  <Input value={transactionId} onChange={e => setTransactionId(e.target.value)} placeholder="UTR / Ref Number" required />
                                </div>
                                <div>
                                  <Label className="text-xs text-slate-500 mb-1 block">Proof Image (Upload Screenshot)</Label>
                                  <Input type="file" onChange={handleImageUpload} accept="image/*" className="cursor-pointer file:bg-indigo-50 file:text-indigo-700 file:border-none file:rounded-lg file:mr-4 file:px-3 file:py-1 file:text-xs" />
                                </div>
                                {proofImage && (
                                  <div className="relative mt-2 rounded-xl overflow-hidden border border-indigo-100 p-2 bg-slate-50">
                                    <img src={proofImage} alt="Proof preview" className="w-full h-32 object-contain" />
                                    <Badge className="absolute top-4 right-4 bg-[#22C55E]">Selected</Badge>
                                  </div>
                                )}
                              </div>
                              <Button onClick={handleSubmitEnrollment} disabled={isSubmitting || !transactionId || !proofImage} className="w-full h-14 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 mt-2">
                                {isSubmitting ? 'Submitting...' : 'Submit Request'}
                              </Button>
                              <Button variant="ghost" onClick={() => setStep(2)} className="w-full text-slate-400 hover:text-slate-600">Back</Button>
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-4">
                 {[
                   { icon: <ShieldCheck className="h-5 w-5" />, text: "Secure Payment" },
                   { icon: <Clock className="h-5 w-5" />, text: "Lifetime Access" }
                 ].map((item, i) => (
                   <div key={i} className="flex items-center p-4 bg-white rounded-2xl text-xs font-bold text-slate-600 shadow-sm border border-slate-100">
                     <span className="text-[#4F46E5] mr-2">{item.icon}</span>
                     {item.text}
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
