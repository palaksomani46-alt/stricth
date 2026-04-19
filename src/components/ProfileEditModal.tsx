import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from './ui/dialog';
import { User, Pencil, Camera, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { buttonVariants } from './ui/button';

export function ProfileEditModal() {
  const { profile, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [phoneNumber, setPhoneNumber] = useState(profile?.phoneNumber || '');
  const [photoURL, setPhotoURL] = useState(profile?.photoURL || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024) { // 500KB limit for profile pics
        toast.error("Image too large. Please keep it under 500KB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoURL(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateProfile({
        displayName,
        phoneNumber,
        photoURL,
      });
      toast.success("Profile updated successfully!");
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(buttonVariants({ variant: "outline", className: "rounded-full border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-all flex items-center gap-2" }))}>
        <Pencil className="h-4 w-4" />
        Edit Profile
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white rounded-[2.5rem] p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-display text-slate-900 text-center">Update Your Profile</DialogTitle>
          <DialogDescription className="text-center text-slate-500">
            Keep your account information up to date.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="flex flex-col items-center mb-6">
            <div className="relative group">
              <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-slate-50 shadow-inner bg-slate-100 flex items-center justify-center">
                {photoURL ? (
                  <img src={photoURL} alt="Profile" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <User className="h-12 w-12 text-slate-300" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 h-8 w-8 bg-indigo-600 text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-indigo-700 transition-colors border-2 border-white">
                <Camera className="h-4 w-4" />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">Max 500KB (Optional)</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName" className="font-bold text-slate-700">Display Name</Label>
            <Input
              id="displayName"
              placeholder="Your full name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="rounded-xl border-slate-200 h-11 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="font-bold text-slate-700">Phone Number (WhatsApp)</Label>
            <Input
              id="phoneNumber"
              placeholder="10-digit mobile number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="rounded-xl border-slate-200 h-11 focus:ring-indigo-500"
              required
            />
          </div>

          <DialogFooter className="sm:justify-between flex-col-reverse sm:flex-row gap-3">
            <DialogClose className="flex-1 px-6 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold transition-all text-slate-600">
              Cancel
            </DialogClose>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl py-3 h-auto"
            >
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
