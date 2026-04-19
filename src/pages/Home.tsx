import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Scissors, ShieldCheck, GraduationCap, ChevronRight, Star, Clock, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { dataService } from '../lib/dataService';
import { Course } from '../types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../components/ui/card';

import { useLocation } from 'react-router-dom';

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { hash } = useLocation();

  useEffect(() => {
    if (hash === '#courses' && !loading) {
      const element = document.getElementById('courses');
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [hash, loading]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courseList = await dataService.getCourses();
        setCourses(courseList);
      } catch (error: any) {
        console.warn("Home: Error loading courses, using fallback cache if available");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const scrollToCourses = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-slate-50">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,var(--color-brand-light)_0%,transparent_70%)] opacity-30" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="outline" className="mb-6 px-4 py-1 text-indigo-700 border-indigo-200 bg-indigo-50">
                #1 Tailoring Academy
              </Badge>
              <h1 className="text-5xl lg:text-7xl font-bold font-display leading-[1.1] mb-6 text-slate-900">
                Master Tailoring <span className="text-[#4F46E5] italic">Online</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 max-w-lg leading-relaxed">
                Experience 15+ years of tailoring excellence from your home. Join Stitch Toppers for professional online courses in cutting, stitching, and fashion design.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={scrollToCourses}
                  className="bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-full px-8 h-14 text-lg font-bold w-full sm:w-auto transition-transform hover:scale-105"
                >
                  Browse Courses <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                <Link to="/success-stories">
                  <Button variant="outline" size="lg" className="rounded-full px-8 h-14 text-lg font-bold border-slate-200">
                    Read Success Stories
                  </Button>
                </Link>
              </div>
              
              <div className="mt-12 flex items-center space-x-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <img 
                      key={i} 
                      className="h-12 w-12 rounded-full border-4 border-white object-cover" 
                      src={`https://picsum.photos/seed/user${i}/100/100`} 
                      alt="Student" 
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
                <div>
                  <div className="flex text-amber-500 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                  </div>
                  <p className="text-sm font-medium text-slate-500">Trusted by 10,000+ students</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative order-first lg:order-last"
            >
              <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 sm:border-8 border-white">
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGGMHh4CDtfsBcoIftHBcErrmk05nJsssVzg&s" 
                  alt="Tailoring Academy" 
                  className="w-full aspect-[4/5] object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -top-4 -right-4 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl z-20">
                <Scissors className="h-6 w-6 sm:h-10 sm:w-10 text-[#4F46E5] mb-1 sm:mb-2" />
                <p className="font-bold text-xs sm:text-base text-slate-900">Expert Material</p>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-[#4F46E5] p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl z-20 text-white">
                <GraduationCap className="h-6 w-6 sm:h-10 sm:w-10 mb-1 sm:mb-2" />
                <p className="font-bold text-xs sm:text-base">Master Lessons</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold font-display mb-4">Why Stitch Toppers?</h2>
            <p className="text-slate-600">We don't just teach stitching; we nurture creativity and professional skills for a successful career in fashion.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all group">
              <div className="h-14 w-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#4F46E5] transition-colors">
                <ShieldCheck className="h-8 w-8 text-[#4F46E5] group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-display">Safe Environment</h3>
              <p className="text-slate-600">A community-focused approach ensuring a comfortable and supportive learning space for everyone.</p>
            </div>
            
            <div className="p-8 rounded-3xl bg-[#4F46E5] text-white shadow-xl shadow-indigo-100">
              <div className="h-14 w-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-display">Tailoring Mastery</h3>
              <p className="text-white/80">Step-by-step guidance from basic patterns to high-end fashion garment construction.</p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all group">
              <div className="h-14 w-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#4F46E5] transition-colors">
                <Scissors className="h-8 w-8 text-[#4F46E5] group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-display">Practical Focus</h3>
              <p className="text-slate-600">Focus on real-world projects that build a portfolio worth showcasing to clients and employers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-xl">
              <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none mb-4 px-4 py-1">Online Curriculum</Badge>
              <h2 className="text-4xl lg:text-5xl font-bold font-display text-slate-900 leading-tight">Professional <span className="text-[#4F46E5]">Tailoring Courses</span></h2>
            </div>
            <p className="text-slate-500 max-w-sm">From basic stitching to advanced couture, choose the path that fits your goals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="h-[450px] bg-slate-200 animate-pulse rounded-[2.5rem]" />
              ))
            ) : courses.length > 0 ? (
              courses.map((course) => (
                <motion.div
                  key={course.id}
                  whileHover={{ y: -10 }}
                  className="group flex h-full"
                >
                  <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden flex flex-col w-full bg-white hover:shadow-2xl transition-all duration-300">
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={course.thumbnail} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        alt={course.title} 
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 backdrop-blur-sm text-slate-900 border-none font-bold px-3 py-1 uppercase text-[10px] tracking-widest">{course.category}</Badge>
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <div className="bg-[#4F46E5] text-white font-bold py-2 px-4 rounded-2xl shadow-lg ring-4 ring-white/20">
                          ₹{course.price}
                        </div>
                      </div>
                    </div>
                    <CardHeader className="pt-8 pb-4">
                      <CardTitle className="text-2xl font-bold font-display group-hover:text-[#4F46E5] transition-colors">{course.title}</CardTitle>
                      <CardDescription className="line-clamp-2 text-slate-500 leading-relaxed">{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pb-8 flex-grow">
                      <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4 text-indigo-500" /> {course.lessons?.length || 0} Lessons
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-indigo-500" /> Self-paced
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 pb-8 px-8">
                      <Link to={`/course/${course.id}`} className="w-full">
                        <Button className="w-full bg-slate-900 hover:bg-[#4F46E5] text-white font-bold h-14 rounded-2xl transition-all shadow-lg shadow-slate-200 group-hover:shadow-indigo-200">
                          View Course Details <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                <BookOpen className="h-16 w-16 text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Courses Found</h3>
                <p className="text-slate-500">Check back soon for new program launches!</p>
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}


