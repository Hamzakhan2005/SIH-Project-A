import { useState } from "react";
import { ChevronLeft, Search, User, MapPin, Send, Mic } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ChatAssistantPage() {
  const [message, setMessage] = useState("");

  const quickActions = [
    "🚌 Schedule of the bus",
    "🚍 Track my bus",
    "❓ What is my ETA?",
    "🎯 Find Taxi near me",
    "🎫 Ticket Info",
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const handleQuickAction = (actionText) => {
    setMessage(actionText.replace(/[🚌🚍❓🎯🎫]/g, "").trim());
  };

  return (
    <div>
      <Navbar />

      <div className="min-h-[100vh] w-[100%] flex flex-col bg-[#1a1a1a]">
        {/* Main Content Container */}
        <div className="flex-[1] flex flex-col items-center justify-center px-[24px] py-[40px]">
          {/* Assistant Avatar */}
          <div className="mb-[32px]">
            <div className="w-[80px] h-[80px] bg-[#d1d5db] rounded-[16px] flex items-center justify-center shadow-[0_8px_16px_rgba(0,0,0,0.3)]">
              <div className="w-[32px] h-[32px] bg-[#1f2937] rounded-[8px] flex items-center justify-center transform rotate-45">
                <div className="w-[16px] h-[16px] bg-[#ffffff] rounded-[2px] transform -rotate-45"></div>
              </div>
            </div>
          </div>

          {/* Greeting Text */}
          <div className="text-center mb-[48px] space-y-[8px]">
            <h1 className="text-[32px] font-[700] text-[#ffffff] mb-[4px]">
              Hey Hamza!
            </h1>
            <h2 className="text-[28px] font-[600] text-[#ffffff] mb-[12px]">
              How can I help with your journey??
            </h2>
            <p className="text-[#6b7280] text-[16px]">
              Ready to assist you with anything you need.
            </p>
          </div>

          {/* Chat Input */}
          <div className="w-[100%] max-w-[600px] mb-[32px]">
            <div className="relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask anything you need"
                className="w-[80%] ml-[0.5rem] pl-[20px] pr-[100px] py-[16px] bg-[#4b5563] text-[#ffffff] placeholder-[#9ca3af] rounded-[50px] focus:outline-none focus:ring-[2px] focus:ring-[#10b981] text-[16px] border border-[#6b7280]"
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <div className="absolute right-[10px] top-[50%] transform -translate-y-[50%] flex items-center gap-[8px]">
                <button
                  onClick={handleSendMessage}
                  className="w-[36px] h-[36px] bg-[#d1d5db] hover:bg-[#e5e7eb] rounded-[50%] flex items-center justify-center transition-colors"
                >
                  <Send className="w-[16px] h-[16px] text-[#1f2937]" />
                </button>
                <button className="w-[36px] h-[36px] bg-[#d1d5db] hover:bg-[#e5e7eb] rounded-[50%] flex items-center justify-center transition-colors">
                  <Mic className="w-[16px] h-[16px] text-[#1f2937]" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="w-[100%] max-w-[800px]">
            <div className="flex flex-wrap items-center justify-center gap-[12px]">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action)}
                  className="px-[20px] py-[12px] bg-[#4b5563] hover:bg-[#374151] text-[#ffffff] text-[14px] font-[500] rounded-[25px] transition-all duration-[200ms] hover:scale-[1.02] shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-[#6b7280]"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
