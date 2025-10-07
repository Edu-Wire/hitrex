"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const slides = [
    {
      video: "https://youtu.be/z2Q-U9q5tvI?si=RJWVIx7kBH3dsQD6",
      poster: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
      title: "Explore the Mountains",
      subtitle: "Discover breathtaking mountain peaks and pristine valleys",
      cta: "Start Your Journey"
    },
    {
      video: "https://youtu.be/z2Q-U9q5tvI?si=RJWVIx7kBH3dsQD6",
      poster: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1920&h=1080&fit=crop",
      title: "Adventure Awaits",
      subtitle: "Experience the thrill of trekking through untouched wilderness",
      cta: "Book Your Trek"
    },
    {
      video: "https://youtu.be/z2Q-U9q5tvI?si=RJWVIx7kBH3dsQD6",
      poster: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Connect with Nature",
      subtitle: "Find peace and adventure in the world's most beautiful landscapes",
      cta: "Explore Destinations"
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);

    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [slides.length]);

  return (
    <div className="relative w-full h-screen overflow-hidden rounded-2xl">
      {/* Video Background */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <video
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster={slide.poster}
              preload="metadata"
              onError={(e) => {
                console.log("Video failed to load, showing poster");
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'block';
              }}
            >
              <source src={slide.video} type="video/mp4" />
            </video>
            {/* Fallback poster image */}
            <div 
              className="w-full h-full bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${slide.poster})`,
                display: 'none'
              }}
            />
          </div>
        ))}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Animated Logo/Brand */}
          <div
            className={`mb-8 transform transition-all duration-1000 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                HITREX
              </span>
            </h1>
          </div>

          {/* Dynamic Content */}
          <div
            className={`transform transition-all duration-1000 delay-300 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              {slides[currentSlide].title}
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
              {slides[currentSlide].subtitle}
            </p>
          </div>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center items-center transform transition-all duration-1000 delay-500 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <Link
              href="/page/destination"
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full text-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:scale-105 hover:shadow-2xl transform"
            >
              <span className="relative z-10">{slides[currentSlide].cta}</span>
              <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            
            <Link
              href="/page/about"
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full text-lg transition-all duration-300 hover:bg-white hover:text-gray-900 hover:scale-105 transform"
            >
              Learn More
            </Link>
          </div>

          {/* Stats */}
          <div
            className={`mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 transform transition-all duration-1000 delay-700 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-gray-300 text-sm md:text-base">Happy Trekkers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-gray-300 text-sm md:text-base">Destinations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">10+</div>
              <div className="text-gray-300 text-sm md:text-base">Years Experience</div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 z-20 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse hidden lg:block"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-blue-400/20 rounded-full animate-pulse hidden lg:block"></div>
      <div className="absolute bottom-40 left-20 w-12 h-12 bg-purple-400/20 rounded-full animate-pulse hidden lg:block"></div>
    </div>
  );
}
