import React, { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useRecordsContext } from "../contexts/RecordsContext";

export default function UserDashboard() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const { records, fetchRecordsByVehicle, loading, error, clearRecords } = useRecordsContext();

    const [vehicleNumber, setVehicleNumber] = React.useState("");
    const [searchInput, setSearchInput] = React.useState("");
    const [isValidSearch, setIsValidSearch] = React.useState(false);

    // Validation Effect
    useEffect(() => {
        const cleanNumber = searchInput.replace(/\s/g, "");
        const regex = /^[A-Z]{2}\d{1,2}[A-Z]{0,3}\d{4}$/;
        setIsValidSearch(regex.test(cleanNumber));
    }, [searchInput]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (isValidSearch) {
            const vNum = searchInput;
            setVehicleNumber(vNum);
            sessionStorage.setItem("searchVehicle", vNum); // Persist search
            fetchRecordsByVehicle(vNum);
        } else {
            alert("Please enter a valid vehicle number first.");
        }
    };

    useEffect(() => {
        // checks state first, then session storage
        const stateVehicle = location.state?.vehicleNumber;
        const sessionVehicle = sessionStorage.getItem("searchVehicle");
        const vNum = stateVehicle || sessionVehicle;

        if (vNum) {
            setVehicleNumber(vNum);
            // Sync search input if it's empty or different
            if (!searchInput) setSearchInput(vNum);

            fetchRecordsByVehicle(vNum);
            // DO NOT CLEAR SESSION STORAGE HERE to allow persistence across navigation
            if (stateVehicle) {
                // If it came from state (Landing Page), save it to session for persistence
                sessionStorage.setItem("searchVehicle", stateVehicle);
            }
        } else {
            clearRecords();
        }
    }, [location.state]);

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-gray-900">E-Challan</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-700">Welcome, <span className="font-semibold">{user?.email || "User"}</span></span>
                            <button
                                onClick={logout}
                                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* Vehicle Search Box */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Check Another Vehicle
                            </label>
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
                                placeholder="Enter Vehicle Number (e.g., MH12AB1234)"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all uppercase"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!isValidSearch}
                            className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${isValidSearch
                                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl translate-y-0 active:translate-y-0.5"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                }`}
                        >
                            Check Challan
                        </button>
                    </form>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600">Manage your profile and view your traffic violation records.</p>
                </div>

                {/* Vehicle Search Results Section */}
                {vehicleNumber && (
                    <div className="mb-10">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Search Results for <span className="text-blue-600">{vehicleNumber}</span>
                            </h2>
                        </div>

                        {loading ? (
                            <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                                <p className="text-gray-500">Fetching records...</p>
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
                                {error}
                            </div>
                        ) : records.length === 0 ? (
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
                                <p className="text-gray-500">No challans found for this vehicle.</p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-4 font-bold">ID</th>
                                                <th className="px-6 py-4 font-bold">Date & Time</th>
                                                <th className="px-6 py-4 font-bold">Type</th>
                                                <th className="px-6 py-4 font-bold">Location</th>
                                                <th className="px-6 py-4 font-bold">License Plate</th>
                                                <th className="px-6 py-4 font-bold">Amount</th>
                                                <th className="px-6 py-4 font-bold">Status</th>
                                                <th className="px-6 py-4 font-bold">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {records.map((record) => (
                                                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-blue-600">{record.id}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium text-gray-900">{record.date}</div>
                                                        <div className="text-gray-500 text-xs">{record.time}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                                                            {record.type}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600">{record.location}</td>
                                                    <td className="px-6 py-4 font-mono font-medium text-gray-900">{record.licensePlate}</td>
                                                    <td className="px-6 py-4 font-medium text-gray-900">₹{record.amount}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${record.status === 'Paid'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'
                                                            }`}>
                                                            {record.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {record.status === 'Pending' && (
                                                            <button
                                                                onClick={() => navigate("/payment")}
                                                                className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                                                            >
                                                                Pay Now
                                                            </button>
                                                        )}
                                                        {record.status === 'Paid' && (
                                                            <button className="text-gray-400 cursor-not-allowed font-medium">
                                                                Paid
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card 1: View Records */}
                    <Link to="/view-all-records" className="block group">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">View Records</h3>
                            <p className="text-sm text-gray-600">Access and review all your past traffic challans and payment history.</p>
                        </div>
                    </Link>

                    {/* Card 2: Make Payment */}
                    <Link to="/payment" className="block group">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Make Payment</h3>
                            <p className="text-sm text-gray-600">Clear your pending dues securely using our online payment gateway.</p>
                        </div>
                    </Link>

                    {/* Card 3: Profile Settings */}
                    <Link to="/profile" className="block group">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">My Profile</h3>
                            <p className="text-sm text-gray-600">Update your personal information and vehicle details.</p>
                        </div>
                    </Link>
                </div>
            </main>
        </div>
    );
}
