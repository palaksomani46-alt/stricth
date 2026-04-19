
import { collection, query, limit, getDocs, doc, getDoc, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Course, Enrollment } from '../types';
import { FALLBACK_COURSES } from './constants';

const CACHE_KEY_COURSES = 'stitch_toppers_courses_cache';
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export const dataService = {
  isSafeMode(): boolean {
    return localStorage.getItem('stitch_safe_mode') === 'true';
  },

  async getCourses(): Promise<Course[]> {
    if (this.isSafeMode()) {
      console.log("Safe Mode: Serving fallbacks");
      return FALLBACK_COURSES;
    }

    // 1. Try Cache First to save reads
    const cached = localStorage.getItem(CACHE_KEY_COURSES);
    if (cached) {
      const entry: CacheEntry<Course[]> = JSON.parse(cached);
      if (Date.now() - entry.timestamp < CACHE_TTL) {
        console.log("Serving courses from cache");
        return entry.data;
      }
    }

    // 2. Try Firestore
    try {
      const q = query(collection(db, 'courses'), limit(50));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        console.warn("No courses in DB, using fallbacks");
        return FALLBACK_COURSES;
      }

      const courseList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
      
      // Update Cache
      localStorage.setItem(CACHE_KEY_COURSES, JSON.stringify({
        data: courseList,
        timestamp: Date.now()
      }));

      return courseList;
    } catch (error: any) {
      console.warn("Firestore error in getCourses:", error.message);
      
      // 3. Quota Exceeded or Disconnected? Use Fallbacks
      if (cached) {
        const entry: CacheEntry<Course[]> = JSON.parse(cached);
        return entry.data;
      }
      return FALLBACK_COURSES;
    }
  },

  async getCourseById(id: string): Promise<Course | null> {
    if (this.isSafeMode()) {
      return FALLBACK_COURSES.find(c => c.id === id) || null;
    }

    // Check cache first
    const cached = await this.getCourses();
    const found = cached.find(c => c.id === id);
    if (found) return found;

    try {
      const docRef = doc(db, 'courses', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as Course;
      }
    } catch (e) {
      console.warn("Error fetching single course:", e);
    }
    
    // Check fallbacks as last resort
    return FALLBACK_COURSES.find(c => c.id === id) || null;
  },

  async getEnrollments(studentUid: string): Promise<Enrollment[]> {
    try {
      const q = query(collection(db, 'enrollments'), where('studentUid', '==', studentUid));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as Enrollment));
    } catch (e) {
      console.warn("Error fetching enrollments:", e);
      return [];
    }
  }
};
