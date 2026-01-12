"use client";
import { motion } from "framer-motion";
import { Oswald, Playfair_Display } from "next/font/google";
import { FaMountain, FaCloudSun, FaTools, FaFirstAid, FaAngleRight, FaExclamationTriangle } from "react-icons/fa";

const oswald = Oswald({ subsets: ["latin"], weight: ["400", "700"] });
const displaySerif = Playfair_Display({ subsets: ["latin"], weight: ["700"] });

const difficultyData = [
  { 
    title: "Class 1: Casual", 
    color: "border-green-500/20 bg-green-500/5", 
    dot: "bg-green-500", 
    text: "Well-marked trails with flat terrain. Suitable for all fitness levels and families.",
    stats: "0-200m Elevation"
  },
  { 
    title: "Class 3: Technical", 
    color: "border-yellow-500/20 bg-yellow-500/5", 
    dot: "bg-yellow-500", 
    text: "Scrambling required. Steep inclines with uneven surfaces. High fitness required.",
    stats: "500-1200m Elevation"
  },
  { 
    title: "Class 5: Extreme", 
    color: "border-red-500/20 bg-red-500/5", 
    dot: "bg-red-500", 
    text: "Vertical ascents and technical gear required. Only for certified mountaineers.",
    stats: "2000m+ Vertical"
  },
];

const insightData = [
  { 
    title: "Atmospheric Gear", 
    icon: <FaCloudSun />,
    color: "bg-zinc-900 border-zinc-800", 
    text: "Layering systems are vital. High-altitude weather can shift 20°C in under an hour." 
  },
  { 
    title: "Maintenance Kit", 
    icon: <FaTools />,
    color: "bg-zinc-900 border-zinc-800", 
    text: "Carry a multi-tool and repair tape for gear malfunctions in remote zones." 
  },
  { 
    title: "Wilderness First Aid", 
    icon: <FaFirstAid />,
    color: "bg-zinc-900 border-zinc-800", 
    text: "Basic trauma and altitude sickness training is mandatory for Class 3+ trails." 
  },
];

export default function InfoSections() {
  return (
    <div className="w-full">
      {/* ================= DIFFICULTY SECTION ================= */}
      <section id="difficulty" className="relative py-32 bg-white overflow-hidden">
        {/* Decorative Topography Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/topography.png')]" />
        
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <span className="text-emerald-600 font-mono text-sm tracking-[0.3em] uppercase block font-bold">
              Technical Grading
            </span>
            <h2 className={`${displaySerif.className} text-5xl md:text-7xl font-bold text-gray-900 leading-tight`}>
              Measure Your <br /> Grit.
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed max-w-md">
              Our trails are rated using the HITREX standard, analyzing vertical gain, oxygen levels, and technical demand.
            </p>
            <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100 max-w-sm">
                <FaExclamationTriangle className="text-amber-500" />
                <p className="text-xs text-amber-800 font-medium">Always check local weather warnings before departure.</p>
            </div>
          </motion.div>

          <div className="space-y-4">
            {difficultyData.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={`group relative flex items-center justify-between p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer ${item.color}`}
              >
                <div className="flex items-start gap-4">
                  <span className={`h-3 w-3 mt-2 rounded-full ${item.dot} shadow-lg`} />
                  <div>
                    <h4 className={`${oswald.className} text-xl uppercase font-bold text-zinc-900`}>{item.title}</h4>
                    <p className="text-sm text-gray-600 mt-1 max-w-xs">{item.text}</p>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                    <span className="text-[10px] font-mono text-gray-400 block uppercase mb-1">Threshold</span>
                    <span className="text-sm font-bold text-zinc-900">{item.stats}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= INSIGHTS SECTION ================= */}
      <section id="insights" className="relative py-32 bg-zinc-950 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="space-y-4">
              <span className="text-emerald-500 font-mono text-sm uppercase font-bold tracking-widest">
                Strategic Briefing
              </span>
              <h2 className={`${displaySerif.className} text-5xl md:text-6xl font-bold leading-tight`}>
                Expedition Intel
              </h2>
            </div>
            <p className="text-zinc-400 max-w-xs text-sm leading-relaxed pb-2 border-b border-zinc-800">
                Plan smarter with technical understanding and preparation tips from the HITREX lead explorers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {insightData.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={`group p-8 rounded-3xl border-2 ${item.color} hover:border-emerald-500/50 transition-all duration-500 flex flex-col justify-between h-full`}
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-2xl mb-6 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-500">
                    {item.icon}
                  </div>
                  <h4 className={`${oswald.className} text-2xl uppercase font-bold mb-3`}>{item.title}</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">{item.text}</p>
                </div>
                
                <button className="mt-8 flex items-center gap-2 text-xs font-bold text-emerald-500 uppercase tracking-widest group-hover:gap-4 transition-all">
                    Full Protocol <FaAngleRight />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}