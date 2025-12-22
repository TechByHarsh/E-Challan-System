import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useRecordsContext } from "../contexts/RecordsContext";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { records } = useRecordsContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [isValidVehicle, setIsValidVehicle] = useState(false);

  useEffect(() => {
    const cleanNumber = vehicleNumber.replace(/\s/g, "");
    // Regex for Indian vehicle numbers (e.g. MH12AB1234, DL3C1234)
    const regex = /^[A-Z]{2}\d{1,2}[A-Z]{0,3}\d{4}$/;
    setIsValidVehicle(regex.test(cleanNumber));
  }, [vehicleNumber]);

  // Check for success message from navigation state
  useEffect(() => {
    if (location.state?.message) {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 5000);
      // Clear the state to prevent showing message on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed", error);
      setIsLoggingOut(false);
    }
  };

  const recentRecords = records.slice(0, 5); // Show 5 most recent

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
              {/* Using a text-based logo to approximate the professional look if no asset is available, 
                   or simplifying the existing one to match the clean style of the image. */}
              <div className="flex flex-col">
                <span className="text-2xl font-black text-indigo-900 tracking-tight italic flex items-center">
                  E Challan<span className="text-blue-600">+</span>
                </span>
                <span className="text-[0.6rem] font-bold text-indigo-800 tracking-widest uppercase -mt-1">Your Car App</span>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center gap-8">
              <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Coming Soon
              </button>

              <button onClick={() => navigate("/about-us")} className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition">
                About us
              </button>

              <button className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition">
                E Challan Bussiness
              </button>

              {/* User Profile / Avatar */}
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => user ? navigate("/dashboard") : navigate("/login")}>
                  <div className="w-8 h-8 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center overflow-hidden">
                    {/* Placeholder Avatar based on image */}
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full" />
                  </div>
                  <span className="text-gray-500 text-xs">-</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="min-h-screen">
        {/* Hero - E-Challan Search */}
        <section
          className="min-h-screen bg-white border border-blue-100 rounded-2xl shadow-sm px-6 py-10 lg:px-12 relative overflow-hidden flex items-center"
          style={{
            backgroundImage: 'url("/heroimage.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Subtle line illustration background */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 opacity-10 hidden lg:block">
            <svg viewBox="0 0 100 400" preserveAspectRatio="none" className="w-full h-full text-blue-200">
              <path d="M10 0 L30 80 L10 160 L30 240 L10 320 L30 400" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 opacity-10 hidden lg:block">
            <svg viewBox="0 0 100 400" preserveAspectRatio="none" className="w-full h-full text-blue-200">
              <path d="M70 0 L50 80 L70 160 L50 240 L70 320 L50 400" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>

          {/* Content overlay to keep text readable over background */}
          <div className="relative max-w-3xl mx-auto text-center space-y-6 bg-white/85 rounded-2xl px-6 py-8 shadow-sm">
            <h2 className="text-2xl lg:text-3xl font-bold text-blue-900 leading-snug">
              E-Challan: Check Status by Vehicle Number &amp; Pay Traffic Challan Online
            </h2>

            {/* Search bar */}
            <div className="mt-6 flex flex-col items-center gap-3">
              <div className="w-full max-w-xl flex flex-col sm:flex-row items-stretch gap-3">
                {/* Indian number plate style input */}
                <div className="flex-1 flex items-center bg-white border border-gray-300 rounded-xl shadow-sm px-3 py-2">
                  <div className="flex items-center justify-center px-2 py-1 mr-2 rounded-md border border-gray-300 bg-gray-50">
                    <span className="text-[10px] font-semibold text-blue-700 tracking-[0.12em]">IND</span>
                  </div>
                  <input
                    type="text"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                    placeholder="Enter vehicle number (e.g. MH 12 AB 1234)"
                    className="flex-1 border-none outline-none text-sm sm:text-base text-gray-900 placeholder:text-gray-400 bg-transparent uppercase"
                  />
                </div>
                <button
                  onClick={() => {
                    if (isValidVehicle) {
                      sessionStorage.setItem("searchVehicle", vehicleNumber);
                      navigate("/login", { state: { vehicleNumber } });
                    } else {
                      alert("Please enter a valid vehicle number first.");
                    }
                  }}
                  disabled={!isValidVehicle}
                  className={`sm:w-40 px-6 py-3 rounded-xl text-white text-sm font-semibold shadow-sm transition ${isValidVehicle
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                    }`}
                >
                  Check Challan
                </button>
              </div>
            </div>

            {/* Info highlight & cards */}
            <div className="mt-6 space-y-4">
              <p className="text-xs sm:text-sm text-gray-500">
                <span className="font-semibold text-blue-700">Pay challan on time to avoid</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Card 1 */}
                <div className="bg-white border border-gray-100 rounded-xl shadow-sm px-4 py-4 flex flex-col items-center text-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">Higher legal penalty</p>
                </div>
                {/* Card 2 */}
                <div className="bg-white border border-gray-100 rounded-xl shadow-sm px-4 py-4 flex flex-col items-center text-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M5 6h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">Vehicle impound</p>
                </div>
                {/* Card 3 */}
                <div className="bg-white border border-gray-100 rounded-xl shadow-sm px-4 py-4 flex flex-col items-center text-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5-2.5V19a2 2 0 01-2 2H6a2 2 0 01-2-2V7.5A1.5 1.5 0 015.5 6h13A1.5 1.5 0 0120 7.5zM9 12l2 2 4-4" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">License suspension</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Activity Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 mt-8 space-y-8">
        {/* What is an E-Challan */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-6">
          <div className="space-y-4 text-left">
            <h2 className="text-2xl font-bold text-blue-900">What is an E-Challan?</h2>
            <p className="text-sm text-gray-700">
              An <span className="font-semibold">e-Challan</span> is a digital version of a traffic challan issued by
              traffic authorities for violations such as speeding, signal jumping, or improper parking. Instead of a
              paper slip, your violation is recorded electronically and can be viewed and paid online.
            </p>
            <p className="text-sm text-gray-700">
              With the e-Challan system, you no longer need to visit traffic police stations or stand in long queues.
              Simply enter your vehicle number, review your pending challans, and clear your dues securely from the
              comfort of your home.
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>Instant access to all your traffic violation records</li>
              <li>Secure digital payments via trusted gateways</li>
              <li>Environment-friendly alternative to paper challans</li>
            </ul>
          </div>
          <div className="flex justify-end">
            <img
              src="https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Law and legal system for e-challan"
              className="w-full max-w-sm h-64 object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Traffic Safety Rules Section */}
        <div className="py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-blue-900 mb-2">Traffic Safety Rules</h2>
            <p className="text-sm text-gray-600">Follow these essential rules to avoid e-challan and ensure road safety</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Rule 1: Wear Seatbelt */}
            <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">Wear Seatbelt</h3>
                  <p className="text-sm text-gray-600">Always fasten your seatbelt while driving. It's mandatory and protects you in case of accidents.</p>
                </div>
              </div>
            </div>

            {/* Rule 2: Follow Speed Limits */}
            <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">Follow Speed Limits</h3>
                  <p className="text-sm text-gray-600">Adhere to posted speed limits. Speeding is a major cause of violations and accidents.</p>
                </div>
              </div>
            </div>

            {/* Rule 3: Stop at Red Lights */}
            <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">Stop at Red Lights</h3>
                  <p className="text-sm text-gray-600">Never jump red traffic signals. Wait for the green light to proceed safely.</p>
                </div>
              </div>
            </div>

            {/* Rule 4: No Phone While Driving */}
            <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">No Phone While Driving</h3>
                  <p className="text-sm text-gray-600">Avoid using mobile phones while driving. Use hands-free devices if necessary.</p>
                </div>
              </div>
            </div>

            {/* Rule 5: Use Indicators */}
            <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-yellow-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">Use Turn Signals</h3>
                  <p className="text-sm text-gray-600">Always use indicators before turning or changing lanes to signal your intentions.</p>
                </div>
              </div>
            </div>

            {/* Rule 6: Don't Drink and Drive */}
            <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">Don't Drink and Drive</h3>
                  <p className="text-sm text-gray-600">Never drive under the influence of alcohol. It's illegal and extremely dangerous.</p>
                </div>
              </div>
            </div>

            {/* Rule 7: Wear Helmet */}
            <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">Wear Helmet</h3>
                  <p className="text-sm text-gray-600">Always wear a helmet when riding a two-wheeler. It's mandatory and life-saving.</p>
                </div>
              </div>
            </div>

            {/* Rule 8: No Parking in Restricted Zones */}
            <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">No Parking in Restricted Zones</h3>
                  <p className="text-sm text-gray-600">Park only in designated areas. Avoid no-parking zones to prevent challans.</p>
                </div>
              </div>
            </div>

            {/* Rule 9: Follow Lane Discipline */}
            <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">Follow Lane Discipline</h3>
                  <p className="text-sm text-gray-600">Stay in your lane and avoid unnecessary lane changes. Maintain proper lane discipline.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-blue-900 mb-2">How It Works</h2>
              <p className="text-sm text-gray-600">Simple steps to check and pay your e-challan online</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1: Enter Details */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                </div>
                <div className="mt-6 mb-4 flex justify-center">
                  <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-gray-900" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    {/* Car in background */}
                    <rect x="25" y="105" width="70" height="40" rx="4" />
                    <circle cx="45" cy="145" r="10" />
                    <circle cx="75" cy="145" r="10" />
                    <rect x="30" y="110" width="25" height="18" rx="2" />
                    <rect x="60" y="110" width="25" height="18" rx="2" />
                    <line x1="30" y1="120" x2="55" y2="120" />
                    <line x1="30" y1="125" x2="50" y2="125" />
                    {/* Person holding phone */}
                    <circle cx="150" cy="45" r="14" />
                    <path d="M150 59 L150 105" />
                    <path d="M150 70 L130 82" />
                    <path d="M150 70 L170 82" />
                    <path d="M150 105 L130 130" />
                    <path d="M150 105 L170 130" />
                    {/* Mobile phone */}
                    <rect x="135" y="70" width="35" height="55" rx="4" />
                    <rect x="140" y="80" width="25" height="20" rx="1" />
                    <circle cx="152" cy="115" r="2.5" />
                    <line x1="140" y1="125" x2="165" y2="125" />
                    <line x1="140" y1="130" x2="160" y2="130" />
                  </svg>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Enter Details</h3>
                  <p className="text-sm text-gray-600">Enter your vehicle number to check for pending challans</p>
                </div>
              </div>

              {/* Step 2: View and Pay Challans */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                </div>
                <div className="mt-6 mb-4 flex justify-center">
                  <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-gray-900" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    {/* Person with worried expression */}
                    <circle cx="100" cy="45" r="14" />
                    <path d="M95 43 Q100 47 105 43" strokeWidth="1.5" />
                    <path d="M92 48 L98 48" />
                    <path d="M102 48 L108 48" />
                    <path d="M100 59 L100 105" />
                    <path d="M100 72 L85 82" />
                    <path d="M100 72 L115 82" />
                    <path d="M100 105 L85 130" />
                    <path d="M100 105 L115 130" />
                    {/* Multiple challan papers scattered */}
                    <rect x="25" y="110" width="45" height="35" rx="2" strokeDasharray="3 2" />
                    <line x1="30" y1="120" x2="60" y2="120" />
                    <line x1="30" y1="130" x2="55" y2="130" />
                    <line x1="30" y1="135" x2="50" y2="135" />
                    <rect x="40" y="105" width="45" height="35" rx="2" strokeDasharray="3 2" />
                    <line x1="45" y1="115" x2="75" y2="115" />
                    <line x1="45" y1="125" x2="70" y2="125" />
                    <line x1="45" y1="130" x2="65" y2="130" />
                    <rect x="55" y="115" width="45" height="35" rx="2" strokeDasharray="3 2" />
                    <line x1="60" y1="125" x2="90" y2="125" />
                    <line x1="60" y1="135" x2="85" y2="135" />
                    <line x1="60" y1="140" x2="80" y2="140" />
                    {/* Exclamation marks on papers */}
                    <path d="M35 145 L35 150 M35 152 L35 152" strokeWidth="2" />
                    <path d="M50 140 L50 145 M50 147 L50 147" strokeWidth="2" />
                    <path d="M70 150 L70 155 M70 157 L70 157" strokeWidth="2" />
                  </svg>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">View and Pay Challans</h3>
                  <p className="text-sm text-gray-600">Review your pending challans and pay them securely online</p>
                </div>
              </div>

              {/* Step 3: Settle Challans Easily */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                </div>
                <div className="mt-6 mb-4 flex justify-center">
                  <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-gray-900" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    {/* Happy person */}
                    <circle cx="100" cy="45" r="14" />
                    <path d="M95 47 Q100 51 105 47" strokeWidth="2" />
                    <path d="M100 59 L100 105" />
                    <path d="M100 72 L85 82" />
                    <path d="M100 72 L115 82" />
                    <path d="M100 105 L85 130" />
                    <path d="M100 105 L115 130" />
                    {/* Receipt in hand */}
                    <rect x="70" y="88" width="45" height="55" rx="3" />
                    <line x1="75" y1="100" x2="105" y2="100" />
                    <line x1="75" y1="110" x2="100" y2="110" />
                    <line x1="75" y1="120" x2="105" y2="120" />
                    <line x1="75" y1="130" x2="95" y2="130" />
                    <line x1="75" y1="135" x2="100" y2="135" />
                    {/* Checkmark on receipt */}
                    <circle cx="85" cy="140" r="4" />
                    <path d="M82 140 L84 142 L88 138" strokeWidth="2.5" />
                    {/* "Paid" text indication */}
                    <line x1="80" y1="125" x2="90" y2="125" strokeWidth="1" />
                    <line x1="80" y1="128" x2="88" y2="128" strokeWidth="1" />
                  </svg>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Settle Challans Easily</h3>
                  <p className="text-sm text-gray-600">Get instant confirmation and download your payment receipt</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FastTag Section */}
        <div className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-blue-900 mb-2">FastTag - Electronic Toll Collection</h2>
              <p className="text-sm text-gray-600">Seamless toll payments without stopping at toll plazas</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">What is FastTag?</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  FastTag is an electronic toll collection system that uses Radio Frequency Identification (RFID) technology.
                  It allows you to pay toll charges automatically without stopping at toll plazas, making your journey faster and more convenient.
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  The FastTag is affixed to your vehicle's windshield and is linked to a prepaid account. When you pass through
                  a toll plaza, the toll amount is automatically deducted from your FastTag account.
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
                  <li>No need to stop at toll plazas - drive through seamlessly</li>
                  <li>Save time and fuel with faster toll payments</li>
                  <li>Get cashback and discounts on toll payments</li>
                  <li>Track all your toll transactions online</li>
                </ul>
              </div>
              <div className="flex justify-end">
                <div className="relative">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg flex items-center justify-center">
                    {/* FastTag Logo SVG */}
                    <div className="bg-white rounded-xl p-6 shadow-md">
                      <svg width="280" height="200" viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* FastTag Card/Sticker */}
                        <rect x="40" y="40" width="200" height="120" rx="8" fill="#1e40af" stroke="#1e3a8a" strokeWidth="2" />
                        <rect x="50" y="50" width="180" height="100" rx="4" fill="#3b82f6" />

                        {/* FastTag Text */}
                        <text x="140" y="85" fontSize="32" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="Arial, sans-serif">FASTag</text>

                        {/* RFID Chip Representation */}
                        <rect x="120" y="100" width="40" height="30" rx="2" fill="#60a5fa" opacity="0.8" />
                        <rect x="125" y="105" width="30" height="20" rx="1" fill="#93c5fd" />

                        {/* Signal Waves */}
                        <circle cx="140" cy="115" r="15" stroke="white" strokeWidth="1.5" opacity="0.6" fill="none" strokeDasharray="2 2" />
                        <circle cx="140" cy="115" r="25" stroke="white" strokeWidth="1" opacity="0.4" fill="none" strokeDasharray="2 2" />

                        {/* Vehicle Silhouette */}
                        <rect x="80" y="170" width="120" height="20" rx="3" fill="#64748b" opacity="0.3" />
                        <circle cx="95" cy="190" r="6" fill="#475569" opacity="0.4" />
                        <circle cx="185" cy="190" r="6" fill="#475569" opacity="0.4" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FastTag Benefits Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="text-base font-semibold text-gray-900 mb-2">Save Time</h4>
                <p className="text-sm text-gray-600">No waiting in queues at toll plazas</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-base font-semibold text-gray-900 mb-2">Save Fuel</h4>
                <p className="text-sm text-gray-600">Reduce idling time and fuel consumption</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-base font-semibold text-gray-900 mb-2">Get Discounts</h4>
                <p className="text-sm text-gray-600">Enjoy cashback and special offers</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="text-base font-semibold text-gray-900 mb-2">Track Transactions</h4>
                <p className="text-sm text-gray-600">Monitor all toll payments online</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Insurance Section */}
        <div className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-blue-900 mb-2">Vehicle Insurance</h2>
              <p className="text-sm text-gray-600">Protect your vehicle and comply with legal requirements</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">Why Vehicle Insurance is Essential</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Vehicle insurance is mandatory by law in most countries and provides financial protection against
                  accidents, theft, and damage. It covers third-party liability, own damage, and personal accident coverage,
                  ensuring you're protected on the road.
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Having valid vehicle insurance not only protects you financially but also helps you avoid legal
                  complications and hefty fines. It's a legal requirement to have at least third-party insurance
                  coverage for your vehicle.
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
                  <li>Mandatory by law - avoid penalties and legal issues</li>
                  <li>Financial protection against accidents and damages</li>
                  <li>Coverage for third-party liability and own damage</li>
                  <li>Peace of mind while driving on the road</li>
                </ul>
              </div>
              <div className="flex justify-end">
                <img
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80"
                  alt="Car insurance documents and coverage"
                  className="w-full max-w-md h-auto object-cover rounded-lg"
                />
              </div>
            </div>

            {/* Insurance Cards - 6 Cards Total */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-blue-50 flex items-center justify-center">
                    <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-gray-900 mb-2">Third-Party Insurance</h4>
                    <p className="text-sm text-gray-600">Covers damages to third-party vehicles and property. Mandatory by law and provides basic protection.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-gray-900 mb-2">Comprehensive Insurance</h4>
                    <p className="text-sm text-gray-600">Complete coverage including own damage, theft, and natural disasters. Best protection for your vehicle.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-green-50 flex items-center justify-center">
                    <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-gray-900 mb-2">Personal Accident</h4>
                    <p className="text-sm text-gray-600">Coverage for driver and passengers in case of accidents. Provides medical and disability benefits.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="text-base font-semibold text-gray-900 mb-2">Legal Compliance</h4>
                <p className="text-sm text-gray-600">Stay compliant with traffic laws and avoid penalties</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-base font-semibold text-gray-900 mb-2">Financial Protection</h4>
                <p className="text-sm text-gray-600">Protect yourself from unexpected repair costs</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h4 className="text-base font-semibold text-gray-900 mb-2">Theft Protection</h4>
                <p className="text-sm text-gray-600">Coverage against vehicle theft and damage</p>
              </div>
            </div>
          </div>
        </div>

        {/* How to Avoid Challans Section */}
        <div className="py-8 lg:py-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">How to avoid challans?</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1: Drink and Drive */}
              <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-block px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full">
                    PENALTY • ₹10,000
                  </span>
                  <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center">
                    <svg className="w-8 h-8 text-amber-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                      <line x1="8" y1="8" x2="16" y2="16" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Do not drink and drive for your safety</h3>
                <p className="text-sm text-gray-600">Driving under influence endangers lives and results in heavy penalties.</p>
              </div>

              {/* Card 2: Traffic Signals */}
              <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-block px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full">
                    PENALTY • ₹5000
                  </span>
                  <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center">
                    <svg className="w-8 h-8 text-amber-700" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="10" y="3" width="4" height="18" rx="2" fill="currentColor" />
                      <circle cx="12" cy="7" r="2" fill="#ef4444" />
                      <circle cx="12" cy="12" r="2" fill="#eab308" />
                      <circle cx="12" cy="17" r="2" fill="#22c55e" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Always follow traffic signals and never jump red light</h3>
                <p className="text-sm text-gray-600">Obeying traffic signals prevents accidents and keeps roads safe for everyone.</p>
              </div>

              {/* Card 3: Safety Gears */}
              <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-block px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full">
                    PENALTY • ₹1000
                  </span>
                  <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center">
                    <svg className="w-8 h-8 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h8M12 4v6" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Wear safety gears like seat belt, helmet, child safety belt</h3>
                <p className="text-sm text-gray-600">Safety equipment protects you and your loved ones in case of accidents.</p>
              </div>

              {/* Card 4: Mobile Phone */}
              <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-block px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full">
                    PENALTY • ₹5000
                  </span>
                  <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center">
                    <svg className="w-8 h-8 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="7" y="4" width="10" height="16" rx="2" strokeWidth="2" />
                      <line x1="5" y1="5" x2="19" y2="19" strokeWidth="2.5" stroke="currentColor" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Avoid using mobile phone while driving</h3>
                <p className="text-sm text-gray-600">Distracted driving is a leading cause of road accidents. Stay focused on the road.</p>
              </div>

              {/* Card 5: Valid Documents */}
              <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-block px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full">
                    PENALTY • UPTO ₹10,000
                  </span>
                  <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center">
                    <svg className="w-8 h-8 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Carry valid documents like driving license, RC, PUCC</h3>
                <p className="text-sm text-gray-600">Keep all vehicle documents handy to avoid legal complications and fines.</p>
              </div>

              {/* Card 6: Speed Limit */}
              <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-block px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full">
                    PENALTY • ₹5000
                  </span>
                  <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center">
                    <svg className="w-8 h-8 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" strokeWidth="2" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6l4 2" />
                      <path d="M18 12h3M3 12h3" strokeWidth="2" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Always stick to the speed limit and never rash drive</h3>
                <p className="text-sm text-gray-600">Speeding and rash driving are major causes of fatal accidents. Drive responsibly.</p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 italic">Follow these rules to stay safe and avoid traffic violations</p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium text-green-800">Record added successfully!</p>
            </div>
            <button
              onClick={() => setShowMessage(false)}
              className="text-green-600 hover:text-green-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Recent Activity / Recent Records Section */}
        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <img
                  src="/photo.png"
                  alt="Activity"
                  className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                <p className="text-sm text-gray-600">Your latest violation records</p>
              </div>
            </div>
            {records.length > 0 && (
              <button
                onClick={() => navigate("/view-all-records")}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All →
              </button>
            )}
          </div>

          {records.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.id}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(record.date)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{record.violationType}</td>
                      <td className="px-4 py-4 text-sm text-gray-600 max-w-xs truncate">{record.location}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ${record.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                            record.status === "Paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No records yet</h3>
              <p className="mt-2 text-sm text-gray-500">
                Get started by adding your first traffic violation record.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => navigate("/add-record")}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Your First Record
                </button>
              </div>
            </div>
          )}
        </div> */}
      </section>

      {/* Footer Section */}
      <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* About Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">E-Challan Portal</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Your trusted platform for checking traffic violations, paying challans online, and staying updated with traffic rules and regulations.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => navigate("/dashboard")} className="text-gray-300 hover:text-white transition text-sm">
                    Dashboard
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/payment")} className="text-gray-300 hover:text-white transition text-sm">
                    Payment
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/view-all-records")} className="text-gray-300 hover:text-white transition text-sm">
                    View All Records
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/violations-analytics")} className="text-gray-300 hover:text-white transition text-sm">
                    Analytics
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/about-us")} className="text-gray-300 hover:text-white transition text-sm">
                    About Us
                  </button>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition text-sm">
                    Traffic Rules
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition text-sm">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition text-sm">
                    Help & Support
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition text-sm">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition text-sm">
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Us / Reach Out */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Reach Out</h4>
              <p className="text-gray-300 text-sm mb-4">
                Connect with us on social media for updates and support.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-all transform hover:scale-110"
                  title="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-sky-500 hover:bg-sky-600 rounded-full flex items-center justify-center transition-all transform hover:scale-110"
                  title="Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 hover:opacity-90 rounded-full flex items-center justify-center transition-all transform hover:scale-110"
                  title="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-700 hover:bg-blue-800 rounded-full flex items-center justify-center transition-all transform hover:scale-110"
                  title="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
              <div className="mt-4">
                <p className="text-gray-300 text-sm mb-2">Contact Support:</p>
                <a href="mailto:support@echallan.gov.in" className="text-blue-400 hover:text-blue-300 text-sm">
                  support@echallan.gov.in
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm text-center md:text-left">
                © {new Date().getFullYear()} E-Challan Portal. All rights reserved. | Government of India
              </p>
              <div className="flex gap-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Sitemap
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
