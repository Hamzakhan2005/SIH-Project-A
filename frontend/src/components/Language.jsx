import { useState } from "react";
import { ChevronLeft, Search, User, MapPin } from "lucide-react";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

export default function LanguageSelector() {
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const languages = [
    { name: "English", code: "en" },
    { name: "हिंदी", code: "hi" },
    { name: "বাংলা", code: "bn" },
    { name: "తెలుగు", code: "te" },
    { name: "मराठी", code: "mr" },
    { name: "ગુજરાતી", code: "gu" },
    { name: "മലയാളം", code: "ml" },
    { name: "தமிழ்", code: "ta" },
    { name: "കന്നട", code: "kn" },
  ];

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-[100vh] w-[100%] py-[4vh] px-[2vw] flex flex-col bg-[#1a1a1a]">
        {/* Main Content */}
        <div className="flex-[1] flex items-center justify-center px-[24px]">
          <div className="w-[100%] max-w-[1024px] grid grid-cols-1 lg:grid-cols-2 gap-[48px] items-center">
            {/* Left Side */}
            <div className="space-y-[24px]">
              <div className="space-y-[16px]">
                <h1 className="text-[36px] font-[700] text-[#ffffff] leading-[1.2]">
                  Choose the language
                </h1>
                <div className="space-y-[8px]">
                  <p className="text-[#9ca3af] text-[18px]">
                    Select your preferred language below
                  </p>
                  <p className="text-[#6b7280]">
                    This helps us serve you better.
                  </p>
                </div>
              </div>

              <div className="space-y-[12px]">
                <p className="text-[#9ca3af] font-[500]">You Selected</p>
                <div className="relative">
                  <div className="bg-[#2a2a2a] rounded-[50px] px-[24px] py-[12px] shadow-[0_1px_3px_0_rgba(0,0,0,0.3)] border border-[#404040] flex items-center justify-between min-w-[200px]">
                    <span className="text-[#ffffff] font-[500]">
                      {selectedLanguage}
                    </span>
                    <div className="w-[12px] h-[12px] bg-[#10b981] rounded-[50%]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="space-y-[24px]">
              <h2 className="text-[28px] font-[700] text-[#ffffff]">
                Choose your preferred language
              </h2>

              <div className="grid grid-cols-2 gap-[12px]">
                {languages.map((language, index) => (
                  <button
                    key={index}
                    onClick={() => handleLanguageSelect(language.name)}
                    className={`px-[24px] py-[12px] rounded-[50px] text-center font-[500] transition-all duration-[200ms] ${
                      selectedLanguage === language.name
                        ? "bg-[#2a2a2a] text-[#ffffff] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] transform scale-[1.05] border-[2px] border-[#404040]"
                        : "bg-[#ffffff] text-[#374151] hover:bg-[#f3f4f6] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] hover:scale-[1.02] border border-[#e5e7eb]"
                    }`}
                  >
                    {language.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
