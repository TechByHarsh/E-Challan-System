import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function AdminDashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!sessionStorage.getItem("isAdmin")) {
            navigate("/admin");
        }
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-gray-900 border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-xl font-bold text-white">Admin Dashboard</span>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={() => {
                                    sessionStorage.removeItem("isAdmin");
                                    navigate("/admin");
                                }}
                                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Add Record Card */}
                    <Link
                        to="/admin/add-record"
                        className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition duration-300 pointer-events-auto"
                    >
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">New Entry</dt>
                                        <dd>
                                            <div className="text-lg font-medium text-gray-900">Add Record</div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-5 py-3">
                            <div className="text-sm">
                                <span className="font-medium text-blue-700 hover:text-blue-900">Create new challan &rarr;</span>
                            </div>
                        </div>
                    </Link>

                    {/* View Records Link (reusing existing view, maybe filtered or just a link) */}
                    <a
                        href="/"
                        target="_blank"
                        rel="noreferrer"
                        className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition duration-300"
                    >
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Monitoring</dt>
                                        <dd>
                                            <div className="text-lg font-medium text-gray-900">View Site</div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-5 py-3">
                            <div className="text-sm">
                                <span className="font-medium text-green-700 hover:text-green-900">Go to Landing Page &rarr;</span>
                            </div>
                        </div>
                    </a>
                </div>
            </main>
        </div>
    );
}
