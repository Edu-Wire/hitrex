"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Mail, Phone, MapPin, Facebook, Twitter, Youtube } from "lucide-react";

export default function ContactPage() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <Image
          src="/images/mountains.avif"
          alt="Contact Background"
          fill
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-6xl font-bold text-white"
          >
            Contact Us
          </motion.h1>
        </div>
      </div>

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto py-20 px-6 grid md:grid-cols-2 gap-16">
        {/* Left Side - Contact Form */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            We are Ready, Lets Talk.
          </h2>
          <form className="space-y-5">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-700"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-700"
            />
            <textarea
              placeholder="Message"
              rows="4"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-700"
            ></textarea>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
            >
              Send Message
            </motion.button>
          </form>
        </motion.div>

        {/* Right Side - Contact Info */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center space-y-8"
        >
          <div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Contact Info</h2>
            <p className="text-gray-600 mb-6">
              Get in touch with us for inquiries, partnerships, or just to say hi!
            </p>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <MapPin className="text-blue-600" />
              <span>Brussels, Belgium</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-blue-600" />
              <span>hitrextrips@gmail.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-blue-600" />
              <span>+3240000000</span>
            </div>
          </div>

          {/* Social Media Icons */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Follow Us</h3>
            <div className="flex items-center gap-4">
              {[Facebook, Twitter, Youtube].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 bg-blue-800 text-white rounded-full hover:bg-blue-700 transition"
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

     
    </div>
  );
}
