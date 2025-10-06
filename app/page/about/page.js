"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutPage() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <Image
          src="/images/mountains.avif"
          alt="Mountains"
          fill
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-6xl font-bold text-white"
          >
            Who We Are
          </motion.h1>
        </div>
      </div>

      {/* Mission Section */}
      <section className="max-w-6xl mx-auto py-20 px-6 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-4 relative">
            Our Mission
            <span className="block w-16 h-[3px] bg-green-700 mt-2"></span>
          </h2>
          <p className="text-gray-600 leading-relaxed">
            At Hitrex, we inspire individuals to embrace the outdoors through unforgettable
            hiking and trekking experiences that challenge the body and nourish the soul.
            We connect clients with nature’s most beautiful landscapes, fostering
            appreciation for wellness, environment, and growth.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src="/images/missio.avif"
            alt="Our Mission"
            width={600}
            height={400}
            className="rounded-2xl shadow-lg"
          />
        </motion.div>
      </section>

      {/* Experiences and Values */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4 relative">
            Extraordinary Experiences
            <span className="block w-16 h-[3px] bg-green-700 mt-2"></span>
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Every trek with us is a unique story — whether mountain trails or hidden wonders,
            we create experiences that last a lifetime. Our expert guides ensure every
            journey is safe, inspiring, and unforgettable.
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-2xl font-bold mb-4 relative">
            Our Core Values
            <span className="block w-16 h-[3px] bg-green-700 mt-2"></span>
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Our values revolve around <strong>adventure</strong>, <strong>sustainability</strong>, and
            <strong> community</strong>. We promote exploration with respect for nature and a
            commitment to safety and purpose-driven travel.
          </p>
        </motion.div>
      </section>

      {/* Team Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-12"
        >
          Meet Our Team
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((member) => (
            <motion.div
              key={member}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition"
            >
              <Image
                src={`/images/person-${member}.avif`}
                alt="Team Member"
                width={400}
                height={300}
                className="w-full h-64 object-cover"
              />
              <div className="p-5">
                <h3 className="text-lg font-semibold text-green-700">
                  {`Team Member ${member}`}
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  Passionate explorer dedicated to creating memorable outdoor adventures.
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
