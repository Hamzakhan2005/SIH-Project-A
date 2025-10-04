import { useState } from "react";
import { User, Mail, Phone, Lock, Eye, EyeOff, MapPin } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState("email"); // 'email' or 'phone'
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = () => {
    // API call placeholder
    console.log("Form submitted:", { isLogin, authMethod, formData });
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="min-h-[100vh] w-[100%] flex items-center justify-center bg-[#1a1a1a] px-[24px] py-[40px]">
      <div className="w-[100%] max-w-[900px] bg-[#2a2a2a] rounded-[16px] border border-[#404040] shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="bg-gradient-to-br from-[#10b981] to-[#059669] p-[20px] flex flex-col justify-center items-start text-[#ffffff]">
            <h1 className="text-[32px] font-[700] mb-[8px]">GoLocal</h1>
          </div>

          {/* Right Side - Form */}
          <div className="p-[48px] bg-[#2a2a2a]">
            {/* Toggle Buttons */}
            <div className="flex gap-[8px] mb-[32px] bg-[#1a1a1a] p-[4px] rounded-[8px]">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-[1] py-[10px] rounded-[6px] text-[14px] font-[500] transition-all ${
                  isLogin
                    ? "bg-[#10b981] text-[#ffffff]"
                    : "bg-transparent text-[#9ca3af] hover:text-[#ffffff]"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-[1] py-[10px] rounded-[6px] text-[14px] font-[500] transition-all ${
                  !isLogin
                    ? "bg-[#10b981] text-[#ffffff]"
                    : "bg-transparent text-[#9ca3af] hover:text-[#ffffff]"
                }`}
              >
                Sign Up
              </button>
            </div>

            <h2 className="text-[#ffffff] text-[24px] font-[700] mb-[8px]">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-[#9ca3af] text-[14px] mb-[24px]">
              {isLogin
                ? "Enter your credentials to access your account"
                : "Sign up to access public transport services"}
            </p>

            {/* Authentication Method Selection */}
            <div className="flex gap-[8px] mb-[24px]">
              <button
                onClick={() => setAuthMethod("email")}
                className={`flex-[1] flex items-center justify-center gap-[8px] py-[10px] rounded-[8px] text-[14px] font-[500] transition-all border ${
                  authMethod === "email"
                    ? "bg-[#374151] border-[#10b981] text-[#ffffff]"
                    : "bg-[#1a1a1a] border-[#404040] text-[#9ca3af] hover:border-[#6b7280]"
                }`}
              >
                <Mail className="w-[16px] h-[16px]" />
                Email
              </button>
              <button
                onClick={() => setAuthMethod("phone")}
                className={`flex-[1] flex items-center justify-center gap-[8px] py-[10px] rounded-[8px] text-[14px] font-[500] transition-all border ${
                  authMethod === "phone"
                    ? "bg-[#374151] border-[#10b981] text-[#ffffff]"
                    : "bg-[#1a1a1a] border-[#404040] text-[#9ca3af] hover:border-[#6b7280]"
                }`}
              >
                <Phone className="w-[16px] h-[16px]" />
                Phone
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-[16px]">
              {/* Name field - only for signup */}
              {!isLogin && (
                <div>
                  <label className="block text-[#e5e7eb] text-[14px] font-[500] mb-[8px]">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-[12px] top-[50%] transform -translate-y-[50%] text-[#6b7280] w-[18px] h-[18px]" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Enter your full name"
                      className="w-[100%] pl-[40px] pr-[16px] py-[12px] bg-[#1a1a1a] border border-[#404040] rounded-[8px] text-[#ffffff] placeholder-[#6b7280] focus:outline-none focus:border-[#10b981]"
                    />
                  </div>
                </div>
              )}

              {/* Email or Phone field */}
              {authMethod === "email" ? (
                <div>
                  <label className="block text-[#e5e7eb] text-[14px] font-[500] mb-[8px]">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-[12px] top-[50%] transform -translate-y-[50%] text-[#6b7280] w-[18px] h-[18px]" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="you@example.com"
                      className="w-[100%] pl-[40px] pr-[16px] py-[12px] bg-[#1a1a1a] border border-[#404040] rounded-[8px] text-[#ffffff] placeholder-[#6b7280] focus:outline-none focus:border-[#10b981]"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-[#e5e7eb] text-[14px] font-[500] mb-[8px]">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-[12px] top-[50%] transform -translate-y-[50%] text-[#6b7280] w-[18px] h-[18px]" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="+91 98765 43210"
                      className="w-[100%] pl-[40px] pr-[16px] py-[12px] bg-[#1a1a1a] border border-[#404040] rounded-[8px] text-[#ffffff] placeholder-[#6b7280] focus:outline-none focus:border-[#10b981]"
                    />
                  </div>
                </div>
              )}

              {/* Password field */}
              <div>
                <label className="block text-[#e5e7eb] text-[14px] font-[500] mb-[8px]">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-[12px] top-[50%] transform -translate-y-[50%] text-[#6b7280] w-[18px] h-[18px]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    placeholder="Enter your password"
                    className="w-[100%] pl-[40px] pr-[40px] py-[12px] bg-[#1a1a1a] border border-[#404040] rounded-[8px] text-[#ffffff] placeholder-[#6b7280] focus:outline-none focus:border-[#10b981]"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-[12px] top-[50%] transform -translate-y-[50%] text-[#6b7280] hover:text-[#10b981]"
                  >
                    {showPassword ? (
                      <EyeOff className="w-[18px] h-[18px]" />
                    ) : (
                      <Eye className="w-[18px] h-[18px]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password - only for signup */}
              {!isLogin && (
                <div>
                  <label className="block text-[#e5e7eb] text-[14px] font-[500] mb-[8px]">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-[12px] top-[50%] transform -translate-y-[50%] text-[#6b7280] w-[18px] h-[18px]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      placeholder="Confirm your password"
                      className="w-[100%] pl-[40px] pr-[16px] py-[12px] bg-[#1a1a1a] border border-[#404040] rounded-[8px] text-[#ffffff] placeholder-[#6b7280] focus:outline-none focus:border-[#10b981]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Forgot Password - only for login */}
            {isLogin && (
              <div className="flex justify-end mt-[12px]">
                <button className="text-[#10b981] text-[12px] hover:text-[#059669] transition-colors">
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Terms - only for signup */}
            {!isLogin && (
              <div className="mt-[16px]">
                <label className="flex items-start gap-[8px] cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-[4px] w-[16px] h-[16px] bg-[#1a1a1a] border border-[#404040] rounded-[4px] accent-[#10b981]"
                  />
                  <span className="text-[#9ca3af] text-[12px] leading-[1.4]">
                    I agree to the Terms & Conditions and Privacy Policy of the
                    Government of India
                  </span>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-[100%] bg-[#10b981] hover:bg-[#059669] text-[#ffffff] py-[12px] rounded-[8px] font-[600] text-[16px] mt-[24px] transition-colors"
            >
              {isLogin ? "Login" : "Create Account"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-[16px] my-[24px]">
              <div className="flex-[1] h-[1px] bg-[#404040]"></div>
              <span className="text-[#6b7280] text-[12px]">OR</span>
              <div className="flex-[1] h-[1px] bg-[#404040]"></div>
            </div>

            {/* Alternative Auth */}
            <button className="w-[100%] bg-[#1a1a1a] hover:bg-[#374151] text-[#ffffff] py-[12px] rounded-[8px] font-[500] text-[14px] border border-[#404040] transition-colors flex items-center justify-center gap-[8px]">
              <span className="text-[16px]">🇮🇳</span>
              Continue with Aadhaar
            </button>

            {/* Footer Text */}
            <p className="text-[#6b7280] text-[12px] text-center mt-[24px]">
              Protected by Government of India Security Standards
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
