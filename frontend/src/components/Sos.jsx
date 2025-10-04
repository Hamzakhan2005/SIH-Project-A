import { useState } from "react";
import { ChevronLeft, Search, User, MapPin } from "lucide-react";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

export default function EmergencyPage() {
  const [selectedEmergency, setSelectedEmergency] = useState(null);

  const emergencyTypes = [
    {
      type: "Medical",
      icon: "🏥",
      bgColor: "bg-[#fef3c7]",
      textColor: "text-[#92400e]",
      borderColor: "border-[#fbbf24]",
    },
    {
      type: "Fire",
      icon: "🔥",
      bgColor: "bg-[#fee2e2]",
      textColor: "text-[#dc2626]",
      borderColor: "border-[#f87171]",
    },
    {
      type: "Natural disaster",
      icon: "🌪️",
      bgColor: "bg-[#dbeafe]",
      textColor: "text-[#2563eb]",
      borderColor: "border-[#60a5fa]",
    },
    {
      type: "Accident",
      icon: "🚗",
      bgColor: "bg-[#ede9fe]",
      textColor: "text-[#7c3aed]",
      borderColor: "border-[#a78bfa]",
    },
    {
      type: "Violence",
      icon: "⚠️",
      bgColor: "bg-[#fecaca]",
      textColor: "text-[#b91c1c]",
      borderColor: "border-[#ef4444]",
    },
    {
      type: "Rescue",
      icon: "🆘",
      bgColor: "bg-[#fed7aa]",
      textColor: "text-[#ea580c]",
      borderColor: "border-[#fb923c]",
    },
  ];

  const handleEmergencySelect = (emergency) => {
    setSelectedEmergency(emergency);
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-[100vh] w-[100%] flex flex-col bg-[#1a1a1a]">
        {/* Main Content */}
        <div className="flex-[1] flex items-center justify-center px-[24px] py-[40px]">
          <div className="w-[100%] max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-center">
            {/* Left Side */}
            <div className="space-y-[40px]">
              <div className="space-y-[16px]">
                <h1 className="text-[40px] font-[700] text-[#ffffff] leading-[1.2]">
                  Are you in an emergency?
                </h1>
                <p className="text-[#9ca3af] text-[16px] leading-[1.6]">
                  Press the SOS button, your live location will be shared with
                  the nearest help centre and your emergency contacts
                </p>
              </div>

              <div className="space-y-[24px]">
                <h2 className="text-[28px] font-[700] text-[#ffffff]">
                  Whats your emergency?
                </h2>
                <p className="text-[#9ca3af] text-[16px]">
                  Select your emergency so we can send help immediately:
                </p>

                <div className="grid grid-cols-3 gap-[12px] max-w-[400px]">
                  {emergencyTypes.map((emergency, index) => (
                    <button
                      key={index}
                      onClick={() => handleEmergencySelect(emergency.type)}
                      className={`flex flex-col items-center gap-[8px] px-[16px] py-[12px] rounded-[12px] border-[2px] transition-all duration-[200ms] hover:scale-[1.05] ${
                        selectedEmergency === emergency.type
                          ? `${emergency.bgColor} ${emergency.borderColor} ${emergency.textColor} shadow-[0_4px_12px_rgba(0,0,0,0.15)]`
                          : `bg-[#2a2a2a] border-[#404040] text-[#ffffff] hover:${emergency.bgColor}`
                      }`}
                    >
                      <span className="text-[20px]">{emergency.icon}</span>
                      <span className="text-[12px] font-[500] text-center leading-[1.2]">
                        {emergency.type}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - SOS Button */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Outer glow ring */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#ff6b6b] to-[#ff8e8e] rounded-[50%] animate-pulse opacity-[0.3] scale-[1.1]"></div>

                {/* Middle ring */}
                <div className="relative w-[280px] h-[280px] bg-gradient-to-br from-[#e5e7eb] to-[#d1d5db] rounded-[50%] flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                  {/* Inner SOS button */}
                  <button className="w-[220px] h-[220px] bg-gradient-to-br from-[#ff6b6b] to-[#ff4757] rounded-[50%] flex flex-col items-center justify-center text-[#ffffff] font-[700] shadow-[0_15px_30px_rgba(255,107,107,0.6)] hover:scale-[1.05] transition-transform duration-[200ms] active:scale-[0.95]">
                    <span className="text-[48px] font-[800] tracking-[2px]">
                      SOS
                    </span>
                    <span className="text-[14px] font-[500] opacity-[0.9] mt-[4px]">
                      Press 3 for second
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
