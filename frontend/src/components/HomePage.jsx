import React from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { useState } from "react";
import {
  Star,
  ArrowRight,
  MapPin,
  Clock,
  Globe,
  Users,
  QrCode,
  Zap,
  Shield,
  Bell,
} from "lucide-react";
const benefits = [
  {
    icon: MapPin,
    title: "Live GPS Tracking",
    description: "Track buses and metros in real time.",
  },
  {
    icon: Clock,
    title: "Smart Schedules",
    description: "Always updated with city timings.",
  },
  {
    icon: Globe,
    title: "Multilingual",
    description: "Easy access in your local language.",
  },
  {
    icon: Users,
    title: "Seat Availability",
    description: "Know crowd levels before you board.",
  },
  {
    icon: QrCode,
    title: "QR Instant Info",
    description: "Scan at stops for live route info.",
  },
  {
    icon: Zap,
    title: "AI Prediction",
    description: "Smarter ETAs with real-time city data.",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "Get timely and route change updates instantly.",
  },
  {
    icon: Shield,
    title: "Safety First",
    description: "Travel securely with verified systems.",
  },
];

const logos = ["Logolpsum", "Logolpsum", "Logolpsum", "Logolpsum", "Logolpsum"];

import styled from "styled-components";
import "./Home.css";
const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#fff] w-[100%]">
      <Navbar />
      <div className="min-h-[100vh] w-[100%] bg-[#1a1a1a] text-[#ffffff]">
        {/* Hero Section */}
        <div className="pt-[8vh] px-[24px] pb-[60px]">
          {/* AI Integration Badge */}
          <div className="flex justify-center mb-[40px]">
            <div className="flex items-center gap-[8px] bg-[#2a2a2a] px-[16px] py-[8px] rounded-[20px] border border-[#404040]">
              <div className="w-[12px] h-[12px] bg-[#10b981] rounded-[50%]"></div>
              <span className="text-[#e5e7eb] text-[14px]">
                ✨ New: Our AI integration just landed
              </span>
            </div>
          </div>

          {/* Main Hero Content */}
          <div className="max-w-[1200px] mx-auto text-center">
            <h1 className="text-[64px] sm:text-[32px] font-[700] leading-[1.1] mb-[24px]">
              Reimagining Public Transport.
              <br />
              for the Next <span className="text-[#10b981]">Decade.</span>
            </h1>

            <p className="text-[#9ca3af] text-[20px] leading-[1.6] max-w-[600px] mx-auto mb-[40px]">
              The future of public transport starts here—real-time GPS tracking,
              AI-powered predictions, and safety-first design, all seamlessly
              woven into one experience.
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center justify-center gap-[20px] mb-[40px]">
              <button
                onClick={() => navigate("/findbus")}
                className="group relative bg-[#10b981] hover:bg-[#059669] text-[#ffffff] px-[32px] py-[16px] rounded-[12px] font-[600] text-[16px] transition-all duration-[300ms] hover:scale-[1.02] shadow-[0_8px_24px_rgba(16,185,129,0.3)]"
              >
                <span className="relative z-10 flex items-center gap-[8px]">
                  Check Rides
                  <ArrowRight className="w-[16px] h-[16px] group-hover:translate-x-[2px] transition-transform" />
                </span>
              </button>

              <button
                onClick={() => navigate("/sos")}
                className="group relative bg-[#dc2626] hover:bg-[#b91c1c] text-[#ffffff] px-[32px] py-[16px] rounded-[12px] font-[600] text-[16px] transition-all duration-[300ms] hover:scale-[1.02] shadow-[0_8px_24px_rgba(220,38,38,0.3)]"
              >
                <span className="relative z-10 flex items-center gap-[8px]">
                  Send SOS
                  <ArrowRight className="w-[16px] h-[16px] group-hover:translate-x-[2px] transition-transform" />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="px-[24px] py-[80px] bg-[#111111]">
          <div className="max-w-[1200px] mx-auto">
            {/* Section Header */}
            <div className="text-center mb-[60px]">
              <h2 className="text-[48px] sm:text-[28px] font-[700] mb-[16px]">
                Key <span className="text-[#10b981]">Benefits</span> of Using
                GoLocal
              </h2>

              <p className="text-[#9ca3af] text-[18px] max-w-[600px] mx-auto leading-[1.6]">
                From starting in uncertainty to traveling with confidence.
                <br />
                We're making public transport reliable, safe, and accessible for
                everyone.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[32px]">
              {benefits.map((benefit, index) => (
                <div key={index} className="group">
                  <div className="bg-[#1e1e1e] hover:bg-[#252525] p-[24px] rounded-[16px] border border-[#333333] hover:border-[#10b981] transition-all duration-[300ms] hover:scale-[1.02]">
                    <div className="w-[48px] h-[48px] bg-[#10b981] bg-opacity-[0.1] rounded-[12px] flex items-center justify-center mb-[16px]">
                      <benefit.icon className="w-[24px] h-[24px] text-[#10b981]" />
                    </div>
                    <h3 className="text-[#ffffff] text-[18px] font-[600] mb-[8px]">
                      {benefit.title}
                    </h3>
                    <p className="text-[#9ca3af] text-[14px] leading-[1.5]">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const StyledWrapper = styled.div`
  .cta {
    display: flex;
    padding: 11px 33px;
    text-decoration: none;
    font-size: 25px;
    color: white;
    background: #6225e6;
    transition: 1s;
    box-shadow: 6px 6px 0 black;
    transform: skewX(-15deg);
    border: none;
    cursor: pointer;
  }

  .cta:focus {
    outline: none;
  }

  .cta:hover {
    transition: 0.5s;
    box-shadow: 10px 10px 0 #fbc638;
  }

  .cta .second {
    transition: 0.5s;
    margin-right: 0px;
  }

  .cta:hover .second {
    transition: 0.5s;
    margin-right: 45px;
  }

  .span {
    transform: skewX(15deg);
  }

  .second {
    width: 20px;
    margin-left: 30px;
    position: relative;
    top: 12%;
  }

  .one {
    transition: 0.4s;
    transform: translateX(-60%);
  }

  .two {
    transition: 0.5s;
    transform: translateX(-30%);
  }

  .cta:hover .three {
    animation: color_anim 1s infinite 0.2s;
  }

  .cta:hover .one {
    transform: translateX(0%);
    animation: color_anim 1s infinite 0.6s;
  }

  .cta:hover .two {
    transform: translateX(0%);
    animation: color_anim 1s infinite 0.4s;
  }

  @keyframes color_anim {
    0% {
      fill: white;
    }

    50% {
      fill: #fbc638;
    }

    100% {
      fill: white;
    }
  }
`;

export default HomePage;
