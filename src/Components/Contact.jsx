import { useState, useRef } from "react";
import emailjs from '@emailjs/browser';
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaCheckCircle, FaTimesCircle, FaUser, FaCommentDots } from "react-icons/fa";
import { personalInfo } from "../data/personal";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const formRef = useRef();

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // EmailJS configuration
      // You need to:
      // 1. Sign up at https://www.emailjs.com/
      // 2. Create an email service
      // 3. Create an email template
      // 4. Replace these with your actual IDs
      const result = await emailjs.sendForm(
        'YOUR_SERVICE_ID',        // Replace with your EmailJS service ID
        'YOUR_TEMPLATE_ID',       // Replace with your EmailJS template ID
        formRef.current,
        'YOUR_PUBLIC_KEY'         // Replace with your EmailJS public key
      );

      console.log('Email sent successfully:', result.text);
      setSubmitStatus({ type: 'success', message: 'Message sent successfully! I\'ll get back to you soon.' });
      formRef.current.reset();
    } catch (error) {
      console.error('Email send failed:', error);
      setSubmitStatus({ type: 'error', message: 'Failed to send message. Please try again or email me directly.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="font-heading font-extrabold text-5xl sm:text-6xl md:text-7xl mb-6">
            <span className="gradient-text">Get In Touch</span>
          </h1>
          <p className="text-gray-300 text-xl sm:text-2xl max-w-3xl mx-auto leading-relaxed">
            Have a project in mind? Let's <span className="text-primary-500 font-bold">collaborate</span> and create something amazing!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info - Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Cards */}
            <div className="glass-dark rounded-2xl p-6 border border-primary-500/30 hover:border-primary-500 transition-all group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-500/20 border border-primary-500/40 flex items-center justify-center text-primary-500 text-xl group-hover:scale-110 transition-transform">
                  <FaEnvelope />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold mb-2">Email</h3>
                  <a href={`mailto:${personalInfo.email}`} className="text-gray-400 hover:text-primary-500 transition-colors text-sm break-all">
                    {personalInfo.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="glass-dark rounded-2xl p-6 border border-primary-500/30 hover:border-primary-500 transition-all group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-500/20 border border-primary-500/40 flex items-center justify-center text-primary-500 text-xl group-hover:scale-110 transition-transform">
                  <FaPhone />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold mb-2">Phone</h3>
                  <a href={`tel:${personalInfo.phone}`} className="text-gray-400 hover:text-primary-500 transition-colors text-sm">
                    {personalInfo.phone}
                  </a>
                </div>
              </div>
            </div>

            <div className="glass-dark rounded-2xl p-6 border border-primary-500/30 hover:border-primary-500 transition-all group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-500/20 border border-primary-500/40 flex items-center justify-center text-primary-500 text-xl group-hover:scale-110 transition-transform">
                  <FaMapMarkerAlt />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold mb-2">Location</h3>
                  <p className="text-gray-400 text-sm">{personalInfo.location}</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="glass-dark rounded-2xl p-6 border border-primary-500/30">
              <h3 className="text-white font-bold mb-4">Connect With Me</h3>
              <div className="flex gap-3">
                {personalInfo.socialLinks
                  .filter(link => ['GitHub', 'LinkedIn', 'Email'].includes(link.platform))
                  .map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-xl bg-primary-500/20 border border-primary-500/40 flex items-center justify-center text-primary-500 hover:bg-primary-500 hover:text-white transition-all hover:scale-110"
                      title={link.platform}
                    >
                      {link.platform === 'GitHub' && <FaGithub className="text-xl" />}
                      {link.platform === 'LinkedIn' && <FaLinkedin className="text-xl" />}
                      {link.platform === 'Email' && <FaEnvelope className="text-xl" />}
                    </a>
                  ))}
              </div>
            </div>

            {/* Quick Info */}
            <div className="glass-dark rounded-2xl p-6 border border-primary-500/30 bg-gradient-to-br from-primary-500/10 to-transparent">
              <h3 className="text-white font-bold mb-3">Quick Response</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                I typically respond within <span className="text-primary-500 font-semibold">24 hours</span>. Looking forward to hearing from you!
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form ref={formRef} onSubmit={onSubmit} className="glass-dark rounded-2xl p-8 border border-primary-500/30">
              <h2 className="text-3xl font-bold text-white mb-6">Send Me a Message</h2>

              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label htmlFor="user_name" className="block text-white font-semibold mb-2 text-sm">
                    Your Name *
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500">
                      <FaUser />
                    </div>
                    <input
                      type="text"
                      id="user_name"
                      name="user_name"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-primary-500/30 rounded-xl text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="user_email" className="block text-white font-semibold mb-2 text-sm">
                    Your Email *
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500">
                      <FaEnvelope />
                    </div>
                    <input
                      type="email"
                      id="user_email"
                      name="user_email"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-primary-500/30 rounded-xl text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-white font-semibold mb-2 text-sm">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-3 bg-dark-800 border border-primary-500/30 rounded-xl text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
                    placeholder="Project Collaboration"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-white font-semibold mb-2 text-sm">
                    Message *
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-4 text-primary-500">
                      <FaCommentDots />
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows="6"
                      className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-primary-500/30 rounded-xl text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
                      placeholder="Tell me about your project..."
                    ></textarea>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold text-lg rounded-xl transition-all ${isSubmitting
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:shadow-lg hover:shadow-primary-500/50 hover:scale-105'
                    }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      Send Message
                    </>
                  )}
                </button>

                {/* Status Message */}
                {submitStatus && (
                  <div
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 ${submitStatus.type === 'success'
                      ? 'bg-green-500/10 border-green-500/50 text-green-400'
                      : 'bg-red-500/10 border-red-500/50 text-red-400'
                      }`}
                  >
                    {submitStatus.type === 'success' ? (
                      <FaCheckCircle className="text-2xl flex-shrink-0" />
                    ) : (
                      <FaTimesCircle className="text-2xl flex-shrink-0" />
                    )}
                    <p className="text-sm font-semibold">{submitStatus.message}</p>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
