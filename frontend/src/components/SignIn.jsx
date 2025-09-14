import { useState } from 'react';
import { ChevronLeft, Search, User, MapPin } from 'lucide-react';
import Navbar from "./Navbar.jsx"
import Footer from "./Footer.jsx"

export default function LanguageSelector() {
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const languages = [
    { name: 'English', code: 'en' },
    { name: 'हिंदी', code: 'hi' },
    { name: 'বাংলা', code: 'bn' },
    { name: 'తెలుగు', code: 'te' },
    { name: 'मराठी', code: 'mr' },
    { name: 'ગુજરાતી', code: 'gu' },
    { name: 'മലയാളം', code: 'ml' },
    { name: 'தமிழ்', code: 'ta' },
    { name: 'കന്നട', code: 'kn' },
    { name: 'ਪੰਜਾਬੀ', code: 'pa' },
    { name: 'ଓଡ଼ିଆ', code: 'or' },
    { name: 'অসমীয়া', code: 'as' }
  ];

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
  };

  return (
    <div>
      <Navbar/>
    <div 
      className="min-h-[100vh] w-[100%] py-[4vh]  px-[2vw] flex flex-col"
      style={{
        background: "linear-gradient(to right,rgb(187, 244, 203) 0%, #ffffff 50%,rgb(248, 219, 186) 100%)"
      }}
    >
      {/* Header */}
      <div className=" flex items-center justify-center gap-[4rem] p-[16px] pt-[24px]">
       

        <div className="flex-[1] max-w-[400px] mx-[24px]">
          <div className="relative">
            <Search className="absolute left-[12px] top-[50%] transform -translate-y-[50%] text-[#6b7280] w-[20px] h-[20px]" />
            <input
              type="text"
              placeholder="Enter route, stop, or destination..."
              className="w-[100%] pl-[40px] pr-[16px] py-[12px] bg-[#dcfce7] rounded-[50px] text-[#374151] placeholder-[#6b7280] focus:outline-none focus:ring-[2px] focus:ring-[#86efac]"
            />
          </div>
        </div>

        <div className="flex items-center gap-[8px] bg-[#1f2937] text-[#ffffff] px-[12px] py-[8px] rounded-[6px]">
          <MapPin className="w-[16px] h-[16px]" />
          <span className="text-[14px]">Lucknow</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-[1] flex items-center justify-center px-[24px]">
        <div className="w-[100%] max-w-[1024px] grid grid-cols-1 lg:grid-cols-2 gap-[48px] items-center">
          
          {/* Left Side */}
          <div className="space-y-[24px]">
            <button className="flex items-center text-[#374151] hover:text-[#111827] transition-colors">
              <ChevronLeft className="w-[24px] h-[24px] mr-[8px]" />
            </button>
            
            <div className="space-y-[16px]">
              <h1 className="text-[36px] font-[700] text-[#1f2937] leading-[1.2]">
                Choose the language
              </h1>
              <div className="space-y-[8px]">
                <p className="text-[#4b5563] text-[18px]">Select your preferred language below</p>
                <p className="text-[#6b7280]">This helps us serve you better.</p>
              </div>
            </div>

            <div className="space-y-[12px]">
              <p className="text-[#374151] font-[500]">You Selected</p>
              <div className="relative">
                <div className="bg-[#ffffff] rounded-[50px] px-[24px] py-[12px] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] border border-[#e5e7eb] flex items-center justify-between min-w-[200px]">
                  <span className="text-[#1f2937] font-[500]">{selectedLanguage}</span>
                  <div className="w-[12px] h-[12px] bg-[#10b981] rounded-[50%]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="space-y-[24px]">
            <h2 className="text-[28px] font-[700] text-[#1f2937]">
              Choose your preferred language
            </h2>
            
            <div className="grid grid-cols-2 gap-[12px]">
              {languages.map((language, index) => (
                <button
                  key={index}
                  onClick={() => handleLanguageSelect(language.name)}
                  className={`px-[24px] py-[12px] rounded-[50px] text-center font-[500] transition-all duration-[200ms] ${
                    selectedLanguage === language.name
                      ? 'bg-[#1f2937] text-[#ffffff] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] transform scale-[1.05]'
                      : 'bg-[#ffffff] text-[#374151] hover:bg-[#f9fafb] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] hover:scale-[1.02] border border-[#e5e7eb]'
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
    <Footer/>
    </div>
  );
}