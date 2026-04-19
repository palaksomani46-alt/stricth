import React from 'react';
import { motion } from 'motion/react';
import { Quote, Star, ArrowRight, Home as HomeIcon, Award } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link, useNavigate } from 'react-router-dom';

const stories = [
  {
    name: "Anju Somani",
    role: "Founder, Stitch Toppers",
    year: "Started in 2009",
    story: "Starting from a single sewing machine in a small corner of her home in 2009, Anju mastered the craft through sheer dedication. Today, she is bringing her 15+ years of expertise to digital screens, launching online classes to help women worldwide achieve financial independence through professional tailoring.",
    stats: "15+ Years Experience",
    badge: "Master Designer"
  }
];

export default function SuccessStories() {
  const navigate = useNavigate();
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-900 py-24 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-indigo-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-[150px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold font-display mb-6">Real Stories, <span className="text-indigo-400">Real Success</span></h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg md:text-xl">
              From passionate beginners to successful entrepreneurs. Discover how Stitch Toppers is now bringing expert tailoring from home to your screens.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Story - Anju Somani */}
      <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-indigo-100 text-[#4F46E5] px-4 py-1.5 rounded-full inline-flex items-center text-sm font-bold mb-6">
            <Award className="h-4 w-4 mr-2" /> {stories[0].badge}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-display text-slate-900 mb-6">The Journey of <span className="text-[#4F46E5]">Anju Somani</span></h2>
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
              <HomeIcon className="h-6 w-6 text-slate-400" />
            </div>
            <div className="text-left">
              <p className="text-xs text-slate-500 uppercase font-black tracking-widest">Started from Home</p>
              <p className="text-lg font-bold text-slate-900">Year 2009</p>
            </div>
          </div>
          <Quote className="h-12 w-12 text-indigo-200 mx-auto mb-4" />
          <p className="text-xl md:text-2xl text-slate-600 leading-relaxed mb-8 italic max-w-2xl mx-auto">
            "{stories[0].story}"
          </p>
          <Button 
            onClick={() => navigate('/')}
            size="lg" 
            className="bg-[#4F46E5] hover:bg-[#4338CA] px-10 h-14 rounded-2xl font-bold transition-all hover:scale-110 active:scale-95 shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:shadow-[0_20px_50px_rgba(79,70,229,0.5)] border-b-4 border-indigo-900 flex items-center mx-auto"
          >
            Learn From Her <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-[#4F46E5] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
           <h2 className="text-3xl md:text-5xl font-bold font-display mb-8">Ready to start your online journey?</h2>
           <p className="text-indigo-100 mb-10 text-lg">Join Anju Somani at Stitch Toppers and master professional tailoring from the comfort of your home.</p>
           <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/">
                <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50 h-14 px-10 rounded-2xl font-bold text-lg">
                  View All Courses
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 h-14 px-10 rounded-2xl font-bold text-lg">
                  Talk to Us
                </Button>
              </Link>
           </div>
        </div>
      </section>
    </div>
  );
}
