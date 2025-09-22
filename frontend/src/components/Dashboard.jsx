import { useState } from "react";
import {
  Menu,
  X,
  Bus,
  Calendar,
  DollarSign,
  MessageSquare,
  MapPin,
  Edit,
  Trash2,
  Plus,
  User,
  LogOut,
  Eye,
  Clock,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [loginData, setLoginData] = useState({ username: "", password: "" });

  // Mock data
  const busSchedules = [
    {
      id: 1,
      busNo: "LKO-001",
      route: "Hazratganj - Alambagh",
      eta: "15:30",
      fare: 25,
      status: "Active",
    },
    {
      id: 2,
      busNo: "LKO-002",
      route: "Charbagh - Gomti Nagar",
      eta: "16:45",
      fare: 30,
      status: "Active",
    },
    {
      id: 3,
      busNo: "LKO-003",
      route: "Aliganj - Mahanagar",
      eta: "17:20",
      fare: 20,
      status: "Delayed",
    },
    {
      id: 4,
      busNo: "LKO-004",
      route: "Indira Nagar - Aminabad",
      eta: "18:10",
      fare: 35,
      status: "Active",
    },
  ];

  const liveGPSData = [
    {
      busNo: "LKO-001",
      location: "Near Hazratganj Metro",
      speed: "35 km/h",
      passengers: 28,
    },
    {
      busNo: "LKO-002",
      location: "Charbagh Railway Station",
      speed: "0 km/h",
      passengers: 45,
    },
    {
      busNo: "LKO-003",
      location: "Aliganj Crossing",
      speed: "25 km/h",
      passengers: 32,
    },
    {
      busNo: "LKO-004",
      location: "Indira Nagar Market",
      speed: "40 km/h",
      passengers: 18,
    },
  ];

  const complaints = [
    {
      id: 1,
      busNo: "LKO-002",
      issue: "AC not working",
      priority: "High",
      time: "2 hours ago",
    },
    {
      id: 2,
      busNo: "LKO-001",
      issue: "Late arrival",
      priority: "Medium",
      time: "4 hours ago",
    },
    {
      id: 3,
      busNo: "LKO-003",
      issue: "Rude behavior",
      priority: "High",
      time: "6 hours ago",
    },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    // API placeholder for login
    console.log("Login API call:", loginData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginData({ username: "", password: "" });
  };

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: TrendingUp },
    { id: "buses", label: "Live Bus Data", icon: Bus },
    { id: "schedules", label: "Manage Schedules", icon: Calendar },
    { id: "fares", label: "Fares", icon: DollarSign },
    { id: "complaints", label: "Complaints", icon: MessageSquare },
  ];

  if (!isLoggedIn) {
    return (
      <div className="min-h-[100vh] flex items-center justify-center">
        <div className="  p-[32px] rounded-[16px] shadow-[0_8px_24px_rgba(0,0,0,0.1)] w-[100%] max-w-[400px] mx-[24px]">
          <div className="text-center mb-[24px]">
            <div className="w-[64px] h-[64px] bg-[#10b981] rounded-[16px] flex items-center justify-center mx-auto mb-[16px]">
              <User className="w-[32px] h-[32px] text-[#ffffff]" />
            </div>
            <h1 className="text-[24px] font-[700] text-[#1f2937] mb-[8px]">
              Admin Login
            </h1>
            <p className="text-[#6b7280] text-[14px]">
              Access the transport management dashboard
            </p>
          </div>

          <div className="space-y-[16px]">
            <div>
              <label className="block text-[#374151] text-[14px] font-[500] mb-[8px]">
                Username
              </label>
              <input
                type="text"
                value={loginData.username}
                onChange={(e) =>
                  setLoginData({ ...loginData, username: e.target.value })
                }
                className="w-[100%] px-[16px] py-[12px] border border-[#d1d5db] rounded-[8px] focus:outline-none focus:border-[#10b981] text-[#1f2937]"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label className="block text-[#374151] text-[14px] font-[500] mb-[8px]">
                Password
              </label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                className="w-[100%] px-[16px] py-[12px] border border-[#d1d5db] rounded-[8px] focus:outline-none focus:border-[#10b981] text-[#1f2937]"
                placeholder="Enter your password"
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-[100%] bg-[#10b981] hover:bg-[#059669] text-[#ffffff] py-[12px] rounded-[8px] font-[600] transition-colors"
            >
              Login to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100vh] bg-[#f9fafb] flex">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static top-0 left-0 w-[280px] h-[100vh] bg-[#1f2937] transition-transform duration-[300ms] z-[40]`}
      >
        <div className="p-[24px]">
          <div className="flex items-center justify-between mb-[32px]">
            <div className="flex items-center gap-[12px]">
              <div className="w-[40px] h-[40px] bg-[#10b981] rounded-[12px] flex items-center justify-center">
                <Bus className="w-[20px] h-[20px] text-[#ffffff]" />
              </div>
              <h2 className="text-[#ffffff] text-[18px] font-[700]">
                GoLocal Admin
              </h2>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-[#9ca3af] hover:text-[#ffffff]"
            >
              <X className="w-[24px] h-[24px]" />
            </button>
          </div>

          <nav className="space-y-[8px]">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-[100%] flex items-center gap-[12px] px-[16px] py-[12px] rounded-[8px] text-[14px] font-[500] transition-colors ${
                  activeSection === item.id
                    ? "bg-[#10b981] text-[#ffffff]"
                    : "text-[#9ca3af] hover:text-[#ffffff] hover:bg-[#374151]"
                }`}
              >
                <item.icon className="w-[20px] h-[20px]" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="absolute bottom-[24px] left-[24px] right-[24px]">
            <button
              onClick={handleLogout}
              className="w-[100%] flex items-center gap-[12px] px-[16px] py-[12px] text-[#dc2626] hover:bg-[#374151] rounded-[8px] text-[14px] font-[500] transition-colors"
            >
              <LogOut className="w-[20px] h-[20px]" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-[#F9F5F0] flex-[1] flex flex-col">
        {/* Top Bar */}
        <div className=" border-b border-[#e5e7eb] px-[24px] py-[16px] flex items-center justify-between">
          <div className="flex items-center gap-[16px]">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-[#6b7280] hover:text-[#1f2937]"
            >
              <Menu className="w-[24px] h-[24px]" />
            </button>
            <h1 className="text-[#1f2937] text-[24px] font-[700] capitalize">
              {activeSection}
            </h1>
          </div>
          <div className="text-[#6b7280] text-[14px]">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-[1] p-[24px] overflow-auto">
          {activeSection === "dashboard" && (
            <div className=" grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
              {/* Stats Cards */}
              <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px] mb-[24px]">
                <div className="bg-[#F2EAD3] p-[20px] rounded-[12px] border border-[#e5e7eb]">
                  <div className="flex items-center gap-[12px] mb-[8px]">
                    <Bus className="w-[20px] h-[20px] text-[#10b981]" />
                    <span className="text-[#6b7280] text-[14px]">
                      Active Buses
                    </span>
                    <button className="bg-[#10b981] hover:bg-[#059669] text-[#F2EAD3] px-[16px] py-[8px] rounded-[8px] text-[14px] font-[500] flex items-center gap-[8px]">
                      <Plus className="w-[16px] h-[16px]" />
                      Add Bus
                    </button>
                  </div>
                  <p className="text-[#1f2937] text-[28px] font-[700]">24</p>
                </div>

                <div className="bg-[#F2EAD3] p-[20px] rounded-[12px] border border-[#e5e7eb]">
                  <div className="flex items-center gap-[12px] mb-[8px]">
                    <Clock className="w-[20px] h-[20px] text-[#f59e0b]" />
                    <span className="text-[#6b7280] text-[14px]">
                      Avg Delay
                    </span>
                  </div>
                  <p className="text-[#1f2937] text-[28px] font-[700]">8min</p>
                </div>

                <div className="bg-[#F2EAD3] p-[20px] rounded-[12px] border border-[#e5e7eb]">
                  <div className="flex items-center gap-[12px] mb-[8px]">
                    <MessageSquare className="w-[20px] h-[20px] text-[#dc2626]" />
                    <span className="text-[#6b7280] text-[14px]">
                      Complaints
                    </span>
                    <button className="bg-[#10b981] hover:bg-[#059669] text-[#F2EAD3] px-[16px] py-[8px] rounded-[8px] text-[14px] font-[500] flex items-center gap-[8px]">
                      <Plus className="w-[16px] h-[16px]" />
                      Review Complaints
                    </button>
                  </div>
                  <p className="text-[#1f2937] text-[28px] font-[700]">3</p>
                </div>

                <div className="bg-[#F2EAD3] p-[20px] rounded-[12px] border border-[#e5e7eb]">
                  <div className="flex items-center gap-[12px] mb-[8px]">
                    <TrendingUp className="w-[20px] h-[20px] text-[#059669]" />
                    <span className="text-[#6b7280] text-[14px]">Revenue</span>
                  </div>
                  <p className="text-[#1f2937] text-[28px] font-[700]">
                    ₹12.5K
                  </p>
                </div>
              </div>

              {/* Bus Schedules Table */}
              <div className="lg:col-span-2 bg-[#F2EAD3] rounded-[12px] border border-[#e5e7eb] overflow-hidden">
                <div className="p-[20px] border-b border-[#e5e7eb] flex items-center justify-between">
                  <h3 className="text-[#1f2937] text-[18px] font-[600]">
                    Bus Schedules
                  </h3>
                  <button className="bg-[#10b981] hover:bg-[#059669] text-[#F2EAD3] px-[16px] py-[8px] rounded-[8px] text-[14px] font-[500] flex items-center gap-[8px]">
                    <Plus className="w-[16px] h-[16px]" />
                    Add Schedule
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-[100%]">
                    <thead className="bg-[#f9fafb]">
                      <tr>
                        <th className="text-left px-[20px] py-[12px] text-[#374151] text-[12px] font-[600] uppercase">
                          Bus No
                        </th>
                        <th className="text-left px-[20px] py-[12px] text-[#374151] text-[12px] font-[600] uppercase">
                          Route
                        </th>
                        <th className="text-left px-[20px] py-[12px] text-[#374151] text-[12px] font-[600] uppercase">
                          ETA
                        </th>
                        <th className="text-left px-[20px] py-[12px] text-[#374151] text-[12px] font-[600] uppercase">
                          Fare
                        </th>
                        <th className="text-left px-[20px] py-[12px] text-[#374151] text-[12px] font-[600] uppercase">
                          Status
                        </th>
                        <th className="text-left px-[20px] py-[12px] text-[#374151] text-[12px] font-[600] uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {busSchedules.map((bus) => (
                        <tr key={bus.id} className="border-t border-[#e5e7eb]">
                          <td className="px-[20px] py-[16px] text-[#1f2937] font-[500]">
                            {bus.busNo}
                          </td>
                          <td className="px-[20px] py-[16px] text-[#6b7280]">
                            {bus.route}
                          </td>
                          <td className="px-[20px] py-[16px] text-[#6b7280]">
                            {bus.eta}
                          </td>
                          <td className="px-[20px] py-[16px] text-[#6b7280]">
                            ₹{bus.fare}
                          </td>
                          <td className="px-[20px] py-[16px]">
                            <span
                              className={`px-[8px] py-[4px] rounded-[16px] text-[12px] font-[500] ${
                                bus.status === "Active"
                                  ? "bg-[#d1fae5] text-[#065f46]"
                                  : "bg-[#fef3c7] text-[#92400e]"
                              }`}
                            >
                              {bus.status}
                            </span>
                          </td>
                          <td className="px-[20px] py-[16px]">
                            <div className="flex gap-[8px]">
                              <button className="text-[#6b7280] hover:text-[#10b981] p-[4px]">
                                <Edit className="w-[16px] h-[16px]" />
                              </button>
                              <button className="text-[#6b7280] hover:text-[#dc2626] p-[4px]">
                                <Trash2 className="w-[16px] h-[16px]" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Live GPS Panel */}
              <div className="bg-[#F2EAD3] rounded-[12px] border border-[#e5e7eb]">
                <div className="p-[20px] border-b border-[#e5e7eb]">
                  <h3 className="text-[#1f2937] text-[18px] font-[600] flex items-center gap-[8px]">
                    <MapPin className="w-[20px] h-[20px] text-[#10b981]" />
                    Live GPS Feed
                  </h3>
                </div>
                <div className="p-[20px] space-y-[16px]">
                  {liveGPSData.map((bus) => (
                    <div
                      key={bus.busNo}
                      className="p-[16px] bg-[#f9fafb] rounded-[8px] border border-[#e5e7eb]"
                    >
                      <div className="flex items-center justify-between mb-[8px]">
                        <span className="text-[#1f2937] font-[600]">
                          {bus.busNo}
                        </span>
                        <span className="text-[#6b7280] text-[12px]">
                          {bus.speed}
                        </span>
                      </div>
                      <p className="text-[#6b7280] text-[14px] mb-[4px]">
                        {bus.location}
                      </p>
                      <p className="text-[#10b981] text-[12px]">
                        Passengers: {bus.passengers}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === "fares" && (
            <div className="max-w-[800px]">
              <div className="bg-[#F2EAD3] rounded-[12px] border border-[#e5e7eb] p-[24px]">
                <h3 className="text-[#1f2937] text-[20px] font-[600] mb-[24px]">
                  Update Fare Structure
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                  <div>
                    <label className="block text-[#374151] text-[14px] font-[500] mb-[8px]">
                      Base Fare (₹)
                    </label>
                    <input
                      type="number"
                      className="w-[100%] px-[16px] py-[12px] border border-[#d1d5db] rounded-[8px] focus:outline-none focus:border-[#10b981]"
                      placeholder="20"
                    />
                  </div>
                  <div>
                    <label className="block text-[#374151] text-[14px] font-[500] mb-[8px]">
                      Per KM Rate (₹)
                    </label>
                    <input
                      type="number"
                      className="w-[100%] px-[16px] py-[12px] border border-[#d1d5db] rounded-[8px] focus:outline-none focus:border-[#10b981]"
                      placeholder="5"
                    />
                  </div>
                  <div>
                    <label className="block text-[#374151] text-[14px] font-[500] mb-[8px]">
                      Peak Hour Multiplier
                    </label>
                    <select className="w-[100%] px-[16px] py-[12px] border border-[#d1d5db] rounded-[8px] focus:outline-none focus:border-[#10b981]">
                      <option>1.5x</option>
                      <option>2.0x</option>
                      <option>2.5x</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#374151] text-[14px] font-[500] mb-[8px]">
                      Student Discount (%)
                    </label>
                    <input
                      type="number"
                      className="w-[100%] px-[16px] py-[12px] border border-[#d1d5db] rounded-[8px] focus:outline-none focus:border-[#10b981]"
                      placeholder="20"
                    />
                  </div>
                </div>
                <button className="bg-[#10b981] hover:bg-[#059669] text-[#F2EAD3] px-[24px] py-[12px] rounded-[8px] font-[600] mt-[24px]">
                  Update Fares
                </button>
              </div>
            </div>
          )}

          {activeSection === "complaints" && (
            <div className="bg-[#F2EAD3] rounded-[12px] border border-[#e5e7eb] overflow-hidden">
              <div className="p-[20px] border-b border-[#e5e7eb]">
                <h3 className="text-[#1f2937] text-[18px] font-[600]">
                  Recent Complaints
                </h3>
              </div>
              <div className="p-[20px] space-y-[16px]">
                {complaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    className="p-[16px] border border-[#e5e7eb] rounded-[8px] flex items-start justify-between"
                  >
                    <div className="flex-[1]">
                      <div className="flex items-center gap-[12px] mb-[8px]">
                        <span className="text-[#1f2937] font-[600]">
                          {complaint.busNo}
                        </span>
                        <span
                          className={`px-[8px] py-[2px] rounded-[12px] text-[12px] font-[500] ${
                            complaint.priority === "High"
                              ? "bg-[#fecaca] text-[#991b1b]"
                              : "bg-[#fef3c7] text-[#92400e]"
                          }`}
                        >
                          {complaint.priority}
                        </span>
                      </div>
                      <p className="text-[#6b7280] mb-[4px]">
                        {complaint.issue}
                      </p>
                      <p className="text-[#9ca3af] text-[12px]">
                        {complaint.time}
                      </p>
                    </div>
                    <div className="flex gap-[8px]">
                      <button className="text-[#6b7280] hover:text-[#10b981] p-[8px]">
                        <Eye className="w-[16px] h-[16px]" />
                      </button>
                      <button className="text-[#6b7280] hover:text-[#dc2626] p-[8px]">
                        <AlertCircle className="w-[16px] h-[16px]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-[#000000] bg-opacity-[0.5] z-[30] md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
