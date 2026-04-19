import React from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, MessageCircle, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function Contact() {
  const WHATSAPP_NUMBER = "8660888419"; // Keeping the 10-digit number for the functional link
  const DISPLAY_NUMBER = "8660888419"; // Correcting to 10-digit number

  return (
    <div className="bg-slate-50 min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold font-display text-slate-900 mb-4"
          >
            Get in Touch
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 max-w-2xl mx-auto"
          >
            Have questions about our courses or need help with enrollment? Our team is here to support your fashion journey.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Cards */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-slate-100 flex items-start space-x-4">
              <div className="bg-indigo-100 p-3 rounded-2xl">
                <Phone className="h-6 w-6 text-[#4F46E5]" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Phone / WhatsApp</h3>
                <p className="text-slate-500 text-sm mb-3">Available during business hours</p>
                <p className="text-[#4F46E5] font-bold text-xl">{DISPLAY_NUMBER}</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-slate-100 flex items-start space-x-4">
              <div className="bg-indigo-100 p-3 rounded-2xl">
                <Mail className="h-6 w-6 text-[#4F46E5]" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Email Support</h3>
                <p className="text-slate-500 text-sm mb-3">We reply within 24 hours</p>
                <p className="text-slate-900 font-bold break-all">somanimayank723@gmail.com</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-slate-100 flex items-start space-x-4 text-emerald-600">
               <div className="bg-emerald-100 p-3 rounded-2xl">
                <MessageCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="flex-grow">
                <h3 className="font-bold text-slate-900 mb-3">Direct Support</h3>
                <Button 
                  onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl h-11"
                >
                   Message on WhatsApp
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Contact Details and Hours */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-xl p-8 md:p-12 border border-slate-100"
          >
            <div className="max-w-md">
              <h2 className="text-3xl font-bold font-display text-slate-900 mb-8">Official Academy Details</h2>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <MapPin className="h-6 w-6 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Academy Office</h4>
                    <p className="text-slate-500">Stitch Toppers Tailoring Academy, Rajasthan, India</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <Clock className="h-6 w-6 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Support Hours</h4>
                    <p className="text-slate-500">Monday — Saturday: 10:00 AM to 7:00 PM</p>
                    <p className="text-slate-500">Sunday: Closed for maintenance</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-8 bg-slate-900 rounded-3xl text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-2">Need immediate assistance?</h3>
                  <p className="text-white/60 text-sm mb-6">Our automated support system can help you check your enrollment status instantly.</p>
                  <Button variant="outline" className="text-white border-white/20 hover:bg-white/10 rounded-xl px-8 h-12 font-bold no-underline">
                    Check Status
                  </Button>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Phone className="h-32 w-32 -rotate-12" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
