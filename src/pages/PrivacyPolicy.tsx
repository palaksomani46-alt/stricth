import React from 'react';
import { motion } from 'motion/react';
import { Shield, Book, History } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden"
        >
          <div className="bg-[#4F46E5] p-8 md:p-12 text-white text-center">
            <Shield className="h-16 w-16 mx-auto mb-6 text-indigo-200" />
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">Privacy Policy</h1>
            <p className="text-indigo-100 font-medium">Effective Date: 15-04-2026</p>
          </div>
          
          <div className="p-8 md:p-12 prose prose-slate max-w-none">
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              Welcome to our Course Selling Platform (Stitch Toppers). Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information.
            </p>

            <section className="mb-10">
              <h2 className="text-2xl font-bold font-display text-slate-900 flex items-center mb-4">
                <span className="bg-indigo-100 text-[#4F46E5] h-8 w-8 rounded-lg flex items-center justify-center text-sm mr-3">1</span>
                Information We Collect
              </h2>
              <p className="text-slate-600 mb-4">When you use our website, we may collect the following information:</p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Full Name</li>
                <li>Email Address</li>
                <li>Phone Number (WhatsApp enabled)</li>
                <li>Course selection details</li>
                <li>Payment details (such as transaction ID and payment screenshot)</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold font-display text-slate-900 flex items-center mb-4">
                <span className="bg-indigo-100 text-[#4F46E5] h-8 w-8 rounded-lg flex items-center justify-center text-sm mr-3">2</span>
                How We Use Your Information
              </h2>
              <p className="text-slate-600 mb-4">We use your information to:</p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Process your course enrollment</li>
                <li>Verify your payment</li>
                <li>Provide access to the course</li>
                <li>Send course-related updates</li>
                <li>Share Zoom class links via WhatsApp</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold font-display text-slate-900 flex items-center mb-4">
                <span className="bg-indigo-100 text-[#4F46E5] h-8 w-8 rounded-lg flex items-center justify-center text-sm mr-3">3</span>
                Payment Information
              </h2>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-4">
                <p className="font-bold text-slate-900 mb-2 italic">We do not process payments directly on our platform.</p>
                <p className="text-slate-600">Users are required to make payments manually to the provided number. We only collect Transaction ID and Payment proof (screenshot). This is used strictly for verification purposes.</p>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold font-display text-slate-900 flex items-center mb-4">
                <span className="bg-indigo-100 text-[#4F46E5] h-8 w-8 rounded-lg flex items-center justify-center text-sm mr-3">4</span>
                Sharing of Information
              </h2>
              <p className="text-slate-600">We do not sell, trade, or rent your personal information to others. Your information is only used for course access and communication related to your purchase.</p> section
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold font-display text-slate-900 flex items-center mb-4">
                <span className="bg-indigo-100 text-[#4F46E5] h-8 w-8 rounded-lg flex items-center justify-center text-sm mr-3">5</span>
                Data Storage
              </h2>
              <p className="text-slate-600">Your data may be stored securely using browser storage or database systems. We take reasonable steps to protect your information, but we cannot guarantee complete security.</p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold font-display text-slate-900 flex items-center mb-4">
                <span className="bg-indigo-100 text-[#4F46E5] h-8 w-8 rounded-lg flex items-center justify-center text-sm mr-3">6</span>
                User Responsibility
              </h2>
              <p className="text-slate-600 mb-4">Users must:</p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Provide accurate information</li>
                <li>Ensure payment is made correctly</li>
                <li>Avoid sharing false payment proofs</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold font-display text-slate-900 flex items-center mb-4">
                <span className="bg-indigo-100 text-[#4F46E5] h-8 w-8 rounded-lg flex items-center justify-center text-sm mr-3">7</span>
                Communication
              </h2>
              <p className="text-slate-600">By using our platform, you agree to receive messages on WhatsApp and Email. These messages will only be related to your course.</p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold font-display text-slate-900 flex items-center mb-4">
                <span className="bg-indigo-100 text-[#4F46E5] h-8 w-8 rounded-lg flex items-center justify-center text-sm mr-3">8</span>
                Changes to This Policy
              </h2>
              <p className="text-slate-600">We may update this Privacy Policy at any time. Changes will be reflected on this page.</p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold font-display text-slate-900 mb-4">Contact Us</h2>
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
                <p className="text-slate-600 mb-2">If you have any questions, you can contact us at:</p>
                <ul className="text-slate-900 font-bold space-y-1">
                  <li>Phone/WhatsApp: 8660888419</li>
                  <li>Email: somanimayank723@gmail.com</li>
                </ul>
              </div>
            </section>

            <div className="text-center pt-8 border-t border-slate-100">
              <p className="text-slate-400 italic">By using our website, you agree to this Privacy Policy.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
