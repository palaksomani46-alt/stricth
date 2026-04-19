import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Button, buttonVariants } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from 'sonner';
import { Chrome } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AuthModal({ fullWidth = false }: { fullWidth?: boolean }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const syncUser = async (user: any, additionalData?: { displayName?: string, phoneNumber?: string }) => {
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      await setDoc(docRef, {
        uid: user.uid,
        email: user.email,
        displayName: additionalData?.displayName || user.displayName || '',
        photoURL: user.photoURL || '',
        phoneNumber: additionalData?.phoneNumber || '',
        role: 'student',
        enrolledCourses: [],
        createdAt: new Date().toISOString(),
      });
    }
  };

  const validateFields = () => {
    if (!email || !password || !fullName || !phone) {
      toast.error('All fields are required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Invalid email format');
      return false;
    }
    if (!/^\d+$/.test(phone)) {
      toast.error('Phone number must be numeric');
      return false;
    }
    return true;
  };

  const handleManualAuth = async (type: 'signin' | 'signup') => {
    if (type === 'signup' && !validateFields()) return;
    if (type === 'signin' && (!email || !password)) {
      toast.error('Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      if (type === 'signin') {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Welcome back!');
      } else {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        await syncUser(user, { displayName: fullName, phoneNumber: phone });
        toast.success('Account created successfully!');
      }
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      await syncUser(user);
      toast.success('Signed in with Google');
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        className={cn(buttonVariants({ className: fullWidth ? "w-full bg-[#4F46E5] hover:bg-[#4338CA] font-semibold text-white h-12 rounded-2xl cursor-pointer flex items-center justify-center border-none" : "bg-[#4F46E5] hover:bg-[#4338CA] font-semibold text-white px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-100 cursor-pointer inline-flex items-center justify-center font-sans h-11 border-none" }))}>
        Get Started
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-display text-slate-900">Welcome to Stitch Toppers</DialogTitle>
          <DialogDescription className="text-slate-500">
            Unlock your tailoring potential. Join our academy today.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="signin" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <div className="mt-4 flex flex-col gap-4">
            <Button variant="outline" onClick={handleGoogleSignIn} disabled={loading} className="w-full h-11">
              <Chrome className="mr-2 h-5 w-5" />
              Continue with Google
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">Or continue with email</span>
              </div>
            </div>

            <TabsContent value="signin" className="space-y-4 m-0">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-xl" />
              </div>
              <Button onClick={() => handleManualAuth('signin')} disabled={loading} className="w-full h-12 bg-[#4F46E5] hover:bg-[#4338CA] rounded-xl font-bold">
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 m-0">
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input id="full-name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" className="rounded-xl" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="up-email">Email</Label>
                  <Input id="up-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="rounded-xl" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="up-phone">Phone Number</Label>
                  <Input id="up-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" className="rounded-xl" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="up-password">Password</Label>
                  <Input id="up-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-xl" />
                </div>
              </div>
              <Button onClick={() => handleManualAuth('signup')} disabled={loading} className="w-full h-12 bg-[#4F46E5] hover:bg-[#4338CA] rounded-xl font-bold">
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
