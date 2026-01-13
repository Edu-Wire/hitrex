"use client";
import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { FadeInUp, StaggerContainer, StaggerItem } from "./animations";

export default function Footer() {
  return (
    <footer className="font-sans bg-emerald-800 text-emerald-50 mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <StaggerItem>
            <FadeInUp>
              <div>
                <h3 className="text-2xl font-bold mb-4 text-emerald-100">HITREX</h3>
                <p className="text-emerald-50/80 mb-4 leading-relaxed">
                  Your ultimate companion for unforgettable trekking adventures. 
                  Explore breathtaking trails and create memories that last a lifetime.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-emerald-50/70 hover:text-emerald-100 transition-colors transform hover:scale-110">
                    <Facebook size={20} />
                  </a>
                  <a href="#" className="text-emerald-50/70 hover:text-emerald-100 transition-colors transform hover:scale-110">
                    <Twitter size={20} />
                  </a>
                  <a href="#" className="text-emerald-50/70 hover:text-emerald-100 transition-colors transform hover:scale-110">
                    <Instagram size={20} />
                  </a>
                  <a href="#" className="text-emerald-50/70 hover:text-emerald-100 transition-colors transform hover:scale-110">
                    <Youtube size={20} />
                  </a>
                </div>
              </div>
            </FadeInUp>
          </StaggerItem>

          {/* Quick Links */}
          <StaggerItem>
            <FadeInUp delay={0.1}>
              <div>
                <h4 className="text-lg font-semibold mb-4 text-emerald-100">Quick Links</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/" className="text-emerald-50/80 hover:text-emerald-100 transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/page/about" className="text-emerald-50/80 hover:text-emerald-100 transition-colors">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/page/destination" className="text-emerald-50/80 hover:text-emerald-100 transition-colors">
                      Destinations
                    </Link>
                  </li>
                  <li>
                    <Link href="/page/activities" className="text-emerald-50/80 hover:text-emerald-100 transition-colors">
                      Activities
                    </Link>
                  </li>
                  <li>
                    <Link href="/page/blog" className="text-emerald-50/80 hover:text-emerald-100 transition-colors">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/page/contact" className="text-emerald-50/80 hover:text-emerald-100 transition-colors">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </FadeInUp>
          </StaggerItem>

          {/* Services */}
          <StaggerItem>
            <FadeInUp delay={0.2}>
              <div>
                <h4 className="text-lg font-semibold mb-4 text-emerald-100">Services</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-emerald-50/80 hover:text-emerald-100 transition-colors">
                      Day Trips
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-emerald-50/80 hover:text-emerald-100 transition-colors">
                      Weekend Adventures
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-emerald-50/80 hover:text-emerald-100 transition-colors">
                      Camping Tours
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-emerald-50/80 hover:text-emerald-100 transition-colors">
                      Group Bookings
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-emerald-50/80 hover:text-emerald-100 transition-colors">
                      Equipment Rental
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-emerald-50/80 hover:text-emerald-100 transition-colors">
                      Guide Services
                    </a>
                  </li>
                </ul>
              </div>
            </FadeInUp>
          </StaggerItem>

          {/* Contact Info */}
          <StaggerItem>
            <FadeInUp delay={0.3}>
              <div>
                <h4 className="text-lg font-semibold mb-4 text-emerald-100">Contact Info</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <MapPin className="text-emerald-200 flex-shrink-0" size={18} />
                    <span className="text-emerald-50/80">Brussels, Belgium</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="text-emerald-200 flex-shrink-0" size={18} />
                    <span className="text-emerald-50/80">+32 40000000</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="text-emerald-200 flex-shrink-0" size={18} />
                    <span className="text-emerald-50/80">hitrextrips@gmail.com</span>
                  </div>
                </div>
                
                {/* Newsletter Signup */}
                <div className="mt-6">
                  <h5 className="text-sm font-semibold mb-2 text-emerald-100">Newsletter</h5>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-0">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="flex-1 px-3 py-2 bg-emerald-900/40 border border-emerald-700 rounded-md sm:rounded-l-md sm:rounded-r-none text-emerald-50 placeholder-emerald-200/70 focus:outline-none focus:border-emerald-200"
                    />
                    <button className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-emerald-50 rounded-md sm:rounded-l-none sm:rounded-r-md transition-colors sm:min-w-[120px]">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </FadeInUp>
          </StaggerItem>
        </StaggerContainer>

        {/* Bottom Bar */}
        <FadeInUp delay={0.4}>
          <div className="border-t border-emerald-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-emerald-100 text-sm mb-4 md:mb-0">
              © 2025 HITREX. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-emerald-50/80 hover:text-emerald-100 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-emerald-50/80 hover:text-emerald-100 transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-emerald-50/80 hover:text-emerald-100 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </FadeInUp>
      </div>
    </footer>
  );
}
