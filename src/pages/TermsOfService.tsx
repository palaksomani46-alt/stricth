import React from 'react';
import { motion } from 'motion/react';
import { FileText, CheckCircle, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden"
        >
          <div className="bg-[#4F46E5] p-8 md:p-12 text-white text-center">
            <FileText className="h-16 w-16 mx-auto mb-6 text-indigo-200" />
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">Terms of Service</h1>
            <p className="text-indigo-100 font-medium">Last Updated: 15-04-2026</p>
          </div>
          
          <div className="p-8 md:p-12 prose prose-slate max-w-none">
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              By accessing and using Stitch Toppers Tailoring Academy, you agree to comply with and be bound by the following terms and conditions.
            </p>

            <section className="mb-10">
              <h2 className="text-2xl font-bold font-display text-slate-900 flex items-center mb-4">
                <span className="bg-indigo-100 text-[#4F46E5] h-8 w-8 rounded-lg flex items-center justify-center text-sm mr-3">1</span>
                Course Enrollment
              </h2>
              <p className="text-slate-600 mb-4">
                Enrollment is confirmed only after manual verification of the payment proof provided. Users must provide valid transaction details. Any attempt to provide fraudulent payment data will result in permanent account suspension.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold font-display text-slate-900 flex items-center mb-4">
                <span className="bg-indigo-100 text-[#4F46E5] h-8 w-8 rounded-lg flex items-center justify-center text-sm mr-3">2</span>
                Manual Payment Policy
              </h2>
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 mb-4">
                <p className="text-amber-800 font-medium mb-2 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" /> Important Note
                </p>
                <p className="text-amber-700 text-sm">
                  We do not use automatic payment gateways. Payments must be made directly to our official number. We are not responsible for payments made to unauthorized numbers.
                </p>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold font-display text-slate-900 flex items-center mb-4">
                <span className="bg-indigo-100 text-[#4F46E5] h-8 w-8 rounded-lg flex items-center justify-center text-sm mr-3">3</span>
                Intellectual Property
              </h2>
              <p className="text-slate-600">
                All course content, videos, PDFs, and design patterns are the property of Stitch Toppers. Sharing, redistribution, or illegal downloading of course materials is strictly prohibited.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold font-display text-slate-900 flex items-center mb-4">
                <span className="bg-indigo-100 text-[#4F46E5] h-8 w-8 rounded-lg flex items-center justify-center text-sm mr-3">4</span>
                Refund Policy
              </h2>
              <p className="text-slate-600">
                Due to the digital nature of our courses, we do not offer refunds once access has been granted. Please review course details carefully before making a payment.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold font-display text-slate-900 flex items-center mb-4">
                <span className="bg-indigo-100 text-[#4F46E5] h-8 w-8 rounded-lg flex items-center justify-center text-sm mr-3">5</span>
                Online Conduct
              </h2>
              <p className="text-slate-600">
                Students must maintain professional conduct in WhatsApp groups and Zoom classes. Misbehavior, harassment, or spamming will lead to immediate removal without a refund.
              </p>
            </section>

            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center text-slate-500 italic">
                <ShieldAlert className="h-5 w-5 mr-2 text-indigo-400" />
                Agreement to these terms is required for use.
              </div>
              <div className="text-sm text-slate-400">
                Questions? Email us at somanimayank723@gmail.com
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
