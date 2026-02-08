import { useTranslations } from "next-intl";

export default function DestinationsPage() {
  const t = useTranslations("DestinationPage");
  const router = useRouter();

  // -- STATE MANAGEMENT --
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isRegionOpen, setIsRegionOpen] = useState(false); // New state for custom region
  const [activeFilters, setActiveFilters] = useState({
    months: [],
    features: [],
    activities: []
  });

  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState(["All"]);
  const [filterOptions, setFilterOptions] = useState(DEFAULT_FILTER_DATA);

  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);
  const filterRef = useRef(null);
  const regionFilterRef = useRef(null); // New ref

  // -- FETCH DATA --
  useEffect(() => {
    fetchDestinations();
  }, []);

  // -- CLICK OUTSIDE TO CLOSE FILTER --
  // -- CLICK OUTSIDE TO CLOSE FILTER --
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
      if (regionFilterRef.current && !regionFilterRef.current.contains(event.target)) {
        setIsRegionOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/destinations", { cache: "no-store" });
      const data = await res.json();
      let list = data.destinations || [];

      if (list.length === 0) {
        list = FALLBACK_DESTINATIONS;
      }

      setDestinations(list);

      // Build dynamic filter options from API data
      const monthNames = DEFAULT_FILTER_DATA.months;
      const monthsSet = new Set();
      const featureSet = new Set();
      const activitySet = new Set();
      const locs = new Set(["All"]);

      list.forEach((d) => {
        // Locations
        if (d.location) {
          d.location.split("/").forEach((l) => locs.add(l.trim()));
        }

        // Months
        const dateLower = (d.date || "").toLowerCase();
        monthNames.forEach((m) => {
          if (dateLower.includes(m.toLowerCase())) monthsSet.add(m);
        });

        // Features
        (d.included || d.tags || []).forEach((f) => {
          if (typeof f === "string" && f.trim()) featureSet.add(f.trim());
        });

        // Activities
        (d.activities || d.tags || []).forEach((a) => {
          if (typeof a === "string" && a.trim()) activitySet.add(a.trim());
        });
      });

      setLocations(Array.from(locs));

      const dynamicFilters = {
        months: monthsSet.size ? Array.from(monthsSet) : DEFAULT_FILTER_DATA.months,
        features: featureSet.size ? Array.from(featureSet) : DEFAULT_FILTER_DATA.features,
        activities: activitySet.size ? Array.from(activitySet) : DEFAULT_FILTER_DATA.activities,
      };

      setFilterOptions(dynamicFilters);

      // Clean up active filters that no longer exist in dynamic options
      setActiveFilters((prev) => ({
        months: prev.months.filter((m) => dynamicFilters.months.includes(m)),
        features: prev.features.filter((f) => dynamicFilters.features.includes(f)),
        activities: prev.activities.filter((a) => dynamicFilters.activities.includes(a)),
      }));
    } catch (e) {
      console.error(e);
      setDestinations(FALLBACK_DESTINATIONS);
    } finally {
      setLoading(false);
    }
  };

  // -- FILTER LOGIC --
  const toggleFilterOption = (category, value) => {
    setActiveFilters(prev => {
      const current = prev[category];
      const isSelected = current.includes(value);

      if (isSelected) {
        return { ...prev, [category]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [category]: [...current, value] };
      }
    });
  };

  const clearFilters = () => {
    setActiveFilters({ months: [], features: [], activities: [] });
  };

  const filtered = destinations.filter((dest) => {
    const matchLocation = selectedLocation === "All" || dest.location.includes(selectedLocation);
    const matchMonth = activeFilters.months.length === 0 ||
      activeFilters.months.some(m => dest.date?.includes(m));
    const requiredTags = [...activeFilters.features, ...activeFilters.activities];
    const matchTags = requiredTags.length === 0 ||
      requiredTags.every(tag => dest.tags?.includes(tag));

    return matchLocation && matchMonth && matchTags;
  });

  // -- ANIMATIONS --
  useEffect(() => {
    if (loading) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const chars = gsap.utils.toArray(".char");
      gsap.to(chars, {
        y: "0%",
        opacity: 1,
        duration: 1.5,
        stagger: 0.04,
        ease: "expo.out",
        delay: 0.2,
      });

      gsap.to(".hero-bg", {
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
        y: 150,
        scale: 1.05,
        ease: "none",
      });

      const cards = cardsRef.current.filter(Boolean);
      gsap.set(cards, { opacity: 0, y: 50 });

      ScrollTrigger.batch(cards, {
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 1,
            ease: "power4.out",
            overwrite: true,
          }),
        start: "top bottom-=50px",
      });

      cards.forEach((card, i) => {
        gsap.to(card, {
          y: "-=10",
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.2,
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [filtered, loading]);

  const splitText = (text) => {
    return text.split("").map((char, i) => (
      <span key={i} className="inline-block overflow-hidden h-fit leading-tight">
        <span className="char inline-block translate-y-[110%] opacity-0 will-change-transform">
          {char === " " ? "\u00A0" : char}
        </span>
      </span>
    ));
  };

  const FilterCheckbox = ({ label, isChecked, onChange }) => (
    <div
      onClick={onChange}
      className="flex items-center gap-3 cursor-pointer group py-1"
    >
      <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-all duration-300 ${isChecked
        ? "bg-orange-600 border-orange-600"
        : "border-white/20 bg-white/5 group-hover:border-white/40"
        }`}>
        {isChecked && <Check size={10} className="text-white" strokeWidth={4} />}
      </div>
      <span className={`text-[11px] uppercase tracking-wider font-bold transition-colors ${isChecked ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
        }`}>
        {label}
      </span>
    </div>
  );

  const activeCount = activeFilters.months.length + activeFilters.features.length + activeFilters.activities.length;

  return (
    <div
      ref={containerRef}
      className="bg-[#050505] min-h-screen text-white overflow-x-hidden selection:bg-orange-600 -mt-24 md:-mt-28"
    >
      <section
        ref={headerRef}
        className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden pt-24"
      >
        <div className="hero-bg absolute inset-0 will-change-transform">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source
              src="https://res.cloudinary.com/dj5imyo2n/video/upload/v1768302705/270940_medium_mggjxf.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#050505]/20 to-[#050505]/75" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-7xl">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[9vw] font-black tracking-tighter mb-12 leading-[0.9] flex flex-col items-center max-w-[min(1100px,92vw)] mx-auto px-4">
            <span className="flex">{splitText(t("beyond_horizons").split(" ")[0])}</span>
            <span className="flex text-transparent stroke-text">
              {splitText(t("beyond_horizons").split(" ")[1])}
            </span>
          </h1>

          {/* --- REDESIGNED COMPACT FILTER BAR --- */}
          {/* Filter Bar Moved to Main Content */}
        </div >
      </section >

      <main className="max-w-[1440px] mx-auto px-6 md:px-12 py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div className="space-y-4">
            <p className="text-orange-500 font-bold text-xs tracking-[0.3em] uppercase">{t("selection_2026")}</p>
            {/* CHANGED: Added text-orange-500 */}
            <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none text-orange-500">
              {t("premium_routes").split(" ")[0]}<br />
              {t("premium_routes").split(" ")[1]}
            </h2>
          </div>

          <div className="bg-white/1 backdrop-blur-2xl border border-white/10 p-1.5 rounded-2xl md:rounded-full flex flex-col md:flex-row items-center gap-1 shadow-2xl w-full max-w-[90%] md:max-w-fit mx-auto transition-all hover:bg-white/5 relative z-50">

            {/* 1. CUSTOM REGION SELECT (NOW THEMED LIKE REFINE) */}
            <div className="relative w-full md:flex-1 md:min-w-[200px]" ref={regionFilterRef}>
              <div
                onClick={() => setIsRegionOpen(!isRegionOpen)}
                className={`relative cursor-pointer group px-6 py-3 md:py-2 w-full border-b md:border-b-0 md:border-r border-white/5 transition-colors hover:bg-white/5 rounded-xl md:rounded-none md:first:rounded-l-full ${isRegionOpen ? "bg-white/5" : ""}`}
              >
                <div className="flex flex-col items-start w-full">
                  <label className="text-[8px] uppercase tracking-[0.2em] text-orange-500 font-bold mb-0.5">
                    {t("region")}
                  </label>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm font-medium text-white truncate pr-2">
                      {selectedLocation}
                    </span>
                    <div className={`text-zinc-500 group-hover:text-white transition-all duration-300 ${isRegionOpen ? "rotate-180" : ""}`}>
                      <ChevronDown size={12} />
                    </div>
                  </div>
                </div>
              </div>

              {/* REGION DROPDOWN PANEL */}
              {isRegionOpen && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[95vw] md:absolute md:inset-auto md:bottom-full md:mb-4 md:left-0 md:w-[260px] bg-[#0a0a0a] md:bg-[#0a0a0a]/95 md:backdrop-blur-2xl border border-white/20 md:border-white/10 rounded-2xl p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.9)] overflow-hidden animate-in fade-in slide-in-from-bottom-10 md:zoom-in-95 duration-200 origin-bottom md:origin-bottom-left z-[70]">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10 md:hidden">
                    <span className="text-sm font-black uppercase tracking-widest text-white">{t("select_region")}</span>
                    <button onClick={() => setIsRegionOpen(false)} className="text-zinc-500 hover:text-white"><X size={14} /></button>
                  </div>
                  <div className="max-h-[50vh] overflow-y-auto custom-scrollbar flex flex-col gap-1">
                    {locations.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => { setSelectedLocation(loc); setIsRegionOpen(false); }}
                        className={`text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${selectedLocation === loc
                          ? "bg-orange-600 text-white shadow-lg"
                          : "hover:bg-white/5 text-zinc-400 hover:text-white"
                          }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. ADVANCED FILTERS DROPDOWN TRIGGER */}
            <div ref={filterRef} className="relative w-full md:flex-1 md:min-w-[200px]">
              <div
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`relative cursor-pointer group px-6 py-3 md:py-2 w-full transition-colors hover:bg-white/5 rounded-xl md:rounded-none ${isFilterOpen ? "bg-white/5" : ""}`}
              >
                <div className="flex flex-col items-start">
                  <label className="text-[8px] uppercase tracking-[0.2em] text-orange-500 font-bold mb-0.5">
                    {t("refine")}
                  </label>
                  <div className="flex items-center justify-between w-full text-left">
                    <span className="text-sm font-medium text-white">
                      {activeCount > 0 ? `${activeCount} ${t("filters_active")}` : t("select_filters")}
                    </span>
                    <div className={`text-zinc-500 group-hover:text-white transition-all duration-300 ${isFilterOpen ? "rotate-180" : ""}`}>
                      <ChevronDown size={12} />
                    </div>
                  </div>
                </div>
              </div>

              {/* --- THE DROP DOWN PANEL (UPDATED: LIFTED FOR DISCOVER BUTTON) --- */}
              {isFilterOpen && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[95vw] md:absolute md:inset-auto md:bottom-full md:mb-4 md:left-0 md:w-[400px] bg-[#0a0a0a] md:bg-[#0a0a0a]/95 md:backdrop-blur-2xl border border-white/20 md:border-white/10 rounded-2xl p-5 md:p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.9)] overflow-hidden animate-in fade-in slide-in-from-bottom-10 md:zoom-in-95 duration-200 origin-bottom md:origin-bottom-left z-[70]">

                  {/* Header */}
                  <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black uppercase tracking-widest text-white">{t("filters")}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      {activeCount > 0 && (
                        <button onClick={clearFilters} className="text-[9px] font-bold text-orange-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1">
                          <X size={10} /> {t("clear")}
                        </button>
                      )}
                      <button onClick={() => setIsFilterOpen(false)} className="md:hidden text-zinc-500 hover:text-white"><X size={14} /></button>
                    </div>
                  </div>

                  <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-1 custom-scrollbar">

                    {/* Section: By Month */}
                    <div>
                      <h4 className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-3">{t("filter_by_month")}</h4>
                      <div className="grid grid-cols-3 md:grid-cols-3 gap-2">
                        {filterOptions.months.map(month => (
                          <FilterCheckbox
                            key={month}
                            label={month.slice(0, 3)}
                            isChecked={activeFilters.months.includes(month)}
                            onChange={() => toggleFilterOption('months', month)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Section: By Feature (Grid for mobile width optim) */}
                    <div>
                      <h4 className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-3">{t("filter_by_feature")}</h4>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                        {filterOptions.features.map(feature => (
                          <FilterCheckbox
                            key={feature}
                            label={feature}
                            isChecked={activeFilters.features.includes(feature)}
                            onChange={() => toggleFilterOption('features', feature)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Section: By Activity (Grid for mobile width optim) */}
                    <div>
                      <h4 className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-3">{t("filter_by_activity")}</h4>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                        {filterOptions.activities.map(activity => (
                          <FilterCheckbox
                            key={activity}
                            label={activity}
                            isChecked={activeFilters.activities.includes(activity)}
                            onChange={() => toggleFilterOption('activities', activity)}
                          />
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* 3. Action Button Removed */}
          </div>
          <div className="text-right">
            <span className="text-8xl font-light text-white/5 tracking-tighter">{filtered.length}</span>
          </div>
        </div>

        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="w-24 h-px bg-white/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-orange-600 animate-loading-smooth" />
            </div>
          </div>
        ) : destinations.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <p className="text-2xl font-bold text-zinc-700 mb-4">{t("no_destinations")}</p>
            <p className="text-zinc-500 mb-6">{t("no_destinations_desc")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-24">
            {filtered.length > 0 ? (
              filtered.map((dest, index) => (
                <div
                  key={dest._id}
                  ref={(el) => (cardsRef.current[index] = el)}
                  onClick={() => router.push(`/page/destination/${dest._id}`)}
                  className="group relative will-change-transform cursor-pointer"
                >
                  <div className="relative h-[550px] rounded-[2.5rem] overflow-hidden bg-zinc-900 transition-transform duration-700 ease-[cubic-bezier(0.2,1,0.3,1)] group-hover:scale-[0.98]">
                    <Image src={dest.image} alt={dest.name} fill className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-1000 scale-110 group-hover:scale-100" />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-80" />
                    <div className="absolute top-8 left-8 overflow-hidden rounded-full z-10">
                      <span className="bg-white/10 backdrop-blur-md text-white text-[9px] font-black px-5 py-2 inline-block uppercase tracking-widest border border-white/20">{dest.tags[0]}</span>
                    </div>
                  </div>
                  <div className="mt-8 px-4">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-orange-500 font-bold text-[10px] uppercase tracking-widest mb-2">{dest.location}</p>
                        <h3 className="text-4xl font-black tracking-tighter uppercase leading-none transition-colors group-hover:text-orange-500">{dest.name}</h3>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-[10px] text-zinc-500 font-bold uppercase">{t("from_label")}</span>
                          <span className="text-2xl font-black text-white">€{dest.offer > 0 ? Math.round(dest.price * (1 - dest.offer / 100)) : dest.price}</span>
                          {dest.offer > 0 && (
                            <>
                              <span className="text-sm text-zinc-500 line-through">€{dest.price}</span>
                              <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black px-2 py-1 rounded-md">-{dest.offer}%</span>
                            </>
                          )}
                        </div>
                        <div className="flex flex-col items-end">
                          <p className="text-[9px] text-zinc-500 font-bold uppercase mb-1">{t("duration_label")}</p>
                          <p className="text-xl font-black">{dest.duration || "5 Days"}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{dest.date}</p>
                      <button onClick={() => router.push(`/page/destination/${dest._id}`)} className="text-[10px] font-black uppercase tracking-widest border-b border-orange-500 pb-1 hover:text-orange-500 transition-colors">{t("view_details")}</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-2xl font-bold text-zinc-700 mb-4">{t("no_match")}</p>
                <p className="text-zinc-500 mb-6">{t("no_match_desc")}</p>
                <button onClick={clearFilters} className="text-orange-500 uppercase tracking-widest text-xs font-bold border-b border-orange-500 pb-1">{t("clear_filters_btn")}</button>
              </div>
            )}
          </div>
        )}
      </main>

      <style jsx global>{`
        .stroke-text {
          -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.6);
          text-stroke: 1.5px rgba(255, 255, 255, 0.6);
          transition: -webkit-text-stroke 0.4s ease;
        }
        .stroke-text:hover {
          -webkit-text-stroke: 1.5px rgba(255, 255, 255, 1);
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255,255,255,0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.2);
            border-radius: 4px;
        }
        @keyframes reveal-simple {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-reveal-simple {
          animation: reveal-simple 1s ease forwards 1s;
        }
        @keyframes loading-smooth {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
        .animate-loading-smooth {
          animation: loading-smooth 2s infinite ease-in-out;
        }
      `}</style>
      <Footer />
    </div >
  );
}