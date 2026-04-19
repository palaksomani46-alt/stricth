export type UserRole = 'admin' | 'student';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  role: UserRole;
  enrolledCourses: string[];
  isBlocked?: boolean;
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  thumbnail: string;
  lessons: string[];
  whatsappMessage?: string;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  studentUid: string;
  studentEmail: string;
  studentName: string;
  studentPhone: string;
  courseId: string;
  courseTitle: string;
  transactionId: string;
  proofImage: string; // Base64
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}
