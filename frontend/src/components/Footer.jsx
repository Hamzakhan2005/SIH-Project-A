import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { useState } from "react";
import { Menu, X, Languages } from "lucide-react";

export default function AppFooter() {
  return (
    <footer
      className="w-[100%] mt-auto "
      style={{
        background:
          "linear-gradient(to right, #1f2937 0%, #374151 50%, #1f2937 100%)",
      }}
    >
      {/* Main Footer Content */}
      <div className="px-[24px] py-[40px] text-[#fff]">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[32px]">
          {/* Company Info */}
          <div className="space-y-[16px]">
            <div className="flex items-center gap-[8px]">
              <div className="w-[32px] h-[32px] bg-[#1f2937] rounded-[50%] flex items-center justify-center">
                <span className="text-[#ffffff] font-[700] text-[14px]">
                  GL
                </span>
              </div>
              <h3 className="text-[20px] font-[700] text-[#fff]">GoLocal</h3>
            </div>
            <p className="text-[#fff] text-[14px] leading-[1.6]">
              Your trusted companion for safe and reliable transportation.
              Emergency assistance available 24/7.
            </p>
            <div className="flex gap-[12px]">
              <button className="w-[32px] h-[32px] bg-[#ffffff] rounded-[6px] flex items-center justify-center hover:bg-[#f3f4f6] transition-colors border border-[#e5e7eb]">
                <Facebook className="w-[16px] h-[16px] text-[#1877f2]" />
              </button>
              <button className="w-[32px] h-[32px] bg-[#ffffff] rounded-[6px] flex items-center justify-center hover:bg-[#f3f4f6] transition-colors border border-[#e5e7eb]">
                <Twitter className="w-[16px] h-[16px] text-[#fff]" />
              </button>
              <button className="w-[32px] h-[32px] bg-[#ffffff] rounded-[6px] flex items-center justify-center hover:bg-[#f3f4f6] transition-colors border border-[#e5e7eb]">
                <Instagram className="w-[16px] h-[16px] text-[#fff]" />
              </button>
              <button className="w-[32px] h-[32px] bg-[#ffffff] rounded-[6px] flex items-center justify-center hover:bg-[#f3f4f6] transition-colors border border-[#e5e7eb]">
                <Linkedin className="w-[16px] h-[16px] text-[#fff]" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-[16px]">
            <h4 className="text-[16px] font-[600] text-[#fff]">Quick Links</h4>
            <div className="space-y-[8px]">
              <a
                href="#"
                className="block text-[#fff] text-[14px] hover:text-[#1f2937] transition-colors"
              >
                Book a Ride
              </a>
              <a
                href="#"
                className="block text-[#fff] text-[14px] hover:text-[#1f2937] transition-colors"
              >
                Emergency SOS
              </a>
              <a
                href="#"
                className="block text-[#fff] text-[14px] hover:text-[#1f2937] transition-colors"
              >
                Route Planner
              </a>
              <a
                href="#"
                className="block text-[#fff] text-[14px] hover:text-[#1f2937] transition-colors"
              >
                Live Tracking
              </a>
              <a
                href="#"
                className="block text-[#fff] text-[14px] hover:text-[#1f2937] transition-colors"
              >
                Language Settings
              </a>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-[16px]">
            <h4 className="text-[16px] font-[600] text-[#1f2937]">Support</h4>
            <div className="space-y-[8px]">
              <a
                href="#"
                className="block text-[#fff] text-[14px] hover:text-[#1f2937] transition-colors"
              >
                Help Center
              </a>
              <a
                href="#"
                className="block text-[#fff] text-[14px] hover:text-[#1f2937] transition-colors"
              >
                Contact Us
              </a>
              <a
                href="#"
                className="block text-[#fff] text-[14px] hover:text-[#1f2937] transition-colors"
              >
                Safety Guidelines
              </a>
              <a
                href="#"
                className="block text-[#fff] text-[14px] hover:text-[#1f2937] transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="block text-[#fff] text-[14px] hover:text-[#1f2937] transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-[16px]">
            <h4 className="text-[16px] font-[600] text-[#1f2937]">
              Contact Info
            </h4>
            <div className="space-y-[12px]">
              <div className="flex items-center gap-[8px]">
                <MapPin className="w-[16px] h-[16px] text-[#fff] flex-shrink-0" />
                <span className="text-[#4b5563] text-[14px]">
                  Lucknow, Uttar Pradesh, India
                </span>
              </div>
              <div className="flex items-center gap-[8px]">
                <Phone className="w-[16px] h-[16px] text-[#fff] flex-shrink-0" />
                <span className="text-[#4b5563] text-[14px]">
                  +91 (0) 522-GoLocal
                </span>
              </div>
              <div className="flex items-center gap-[8px]">
                <Mail className="w-[16px] h-[16px] text-[#fff] flex-shrink-0" />
                <span className="text-[#4b5563] text-[14px]">
                  help@golocal.com
                </span>
              </div>
            </div>
            <div className="bg-[#ffffff] bg-opacity-[0.7] rounded-[8px] p-[12px] border border-[#e5e7eb]">
              <p className="text-[#fff] text-[12px] font-[500] mb-[4px]">
                Emergency Hotline
              </p>
              <p className="text-[#fff] text-[16px] font-[700]">
                100 | 108 | 112
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#e5e7eb] border-opacity-[0.5] bg-[#ffffff] bg-opacity-[0.3]">
        <div className="max-w-[1200px] mx-auto px-[24px] py-[16px] flex flex-col md:flex-row justify-between items-center gap-[12px]">
          <p className="text-[#4b5563] text-[14px]">
            © 2025 GoLocal. All rights reserved.
          </p>
          <div className="flex gap-[24px]">
            <a
              href="#"
              className="text-[#4b5563] text-[12px] hover:text-[#1f2937] transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-[#4b5563] text-[12px] hover:text-[#1f2937] transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-[#4b5563] text-[12px] hover:text-[#1f2937] transition-colors"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
