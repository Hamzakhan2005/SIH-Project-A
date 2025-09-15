import { useState } from "react";
import {
  ChevronLeft,
  Send,
  Mic,
  Calendar,
  MapPin,
  HelpCircle,
  Navigation,
  Ticket,
} from "lucide-react";

export default function ChatAssistantPage() {
  const [message, setMessage] = useState("");

  const quickActions = [
    { text: "🚌 Schedule of the bus", icon: Calendar },
    { text: "🚍 Track my bus", icon: MapPin },
    { text: "❓ What is my ETA?", icon: HelpCircle },
    { text: "🎯 Find Taxi near me", icon: Navigation },
    { text: "🎫 Ticket Info", icon: Ticket },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle send message logic
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const handleQuickAction = (actionText) => {
    setMessage(actionText.replace(/[🚌🚍❓🎯🎫]/g, "").trim());
  };

  return (
    <div
      className="min-h-[100vh] w-[100%] flex flex-col"
      style={{
        background:
          "linear-gradient(to right,rgb(187, 244, 203) 0%, #ffffff 50%,rgb(248, 219, 186) 100%)",
      }}
    >
      {/* Header with Back Button */}
      <div className="flex items-center p-[16px] pt-[24px]">
        <button className="flex items-center justify-center w-[40px] h-[40px] bg-[#374151] bg-opacity-[0.1] rounded-[50%] hover:bg-opacity-[0.2] transition-all">
          <ChevronLeft className="w-[20px] h-[20px] text-[#374151]" />
        </button>
      </div>

      {/* Main Content Container */}
      <div className="flex-[1] flex flex-col items-center justify-center px-[24px] py-[40px]">
        {/* Assistant Avatar */}
        <div className="mb-[32px]">
          <div className="w-[80px] h-[80px] bg-[#e5e7eb] rounded-[16px] flex items-center justify-center shadow-[0_8px_16px_rgba(0,0,0,0.1)]">
            <div className="w-[32px] h-[32px] bg-[#1f2937] rounded-[8px] flex items-center justify-center transform rotate-45">
              <div className="w-[16px] h-[16px] bg-[#ffffff] rounded-[2px] transform -rotate-45"></div>
            </div>
          </div>
        </div>

        {/* Greeting Text */}
        <div className="text-center mb-[48px] space-y-[8px]">
          <h1 className="text-[32px] font-[700] text-[#ffffff] mb-[4px]">
            Hey Shiva!
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
              className="w-[100%] pl-[20px] pr-[100px] py-[16px] bg-[#4b5563] text-[#ffffff] placeholder-[#9ca3af] rounded-[50px] focus:outline-none focus:ring-[2px] focus:ring-[#10b981] text-[16px]"
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <div className="absolute right-[8px] top-[50%] transform -translate-y-[50%] flex items-center gap-[8px]">
              <button
                onClick={handleSendMessage}
                className="w-[36px] h-[36px] bg-[#10b981] hover:bg-[#059669] rounded-[50%] flex items-center justify-center transition-colors"
              >
                <Send className="w-[16px] h-[16px] text-[#ffffff]" />
              </button>
              <button className="w-[36px] h-[36px] bg-[#6b7280] hover:bg-[#4b5563] rounded-[50%] flex items-center justify-center transition-colors">
                <Mic className="w-[16px] h-[16px] text-[#ffffff]" />
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
                onClick={() => handleQuickAction(action.text)}
                className="px-[20px] py-[12px] bg-[#4b5563] hover:bg-[#374151] text-[#ffffff] text-[14px] font-[500] rounded-[25px] transition-all duration-[200ms] hover:scale-[1.02] shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
              >
                {action.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
