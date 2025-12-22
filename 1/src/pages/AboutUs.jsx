import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AboutUs() {
  const navigate = useNavigate();

  const missionItems = [
    'Reduce traffic violations through awareness and education',
    'Provide transparent violation tracking and payment systems',
    'Enhance road safety for all community members',
    'Leverage technology for efficient violation management'
  ];

  const stats = [
    { number: '10K+', label: 'Violations Processed' },
    { number: '95%', label: 'Payment Rate' },
    { number: '30%', label: 'Reduction in Violations' },
    { number: '24/7', label: 'Support Available' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-indigo-600 font-semibold">Traffic Violation & Fines</p>
                <h1 className="text-2xl font-bold text-gray-900">About Us</h1>
              </div>
            </div>
           
            <div className="flex items-center gap-4">
             
              <button
                onClick={() => navigate("/LandingPage")}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition shadow-sm"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Making Roads Safer, One Violation at a Time</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We are committed to creating safer roads through efficient violation management and driver education.
          </p>
        </section>

        {/* Mission Section */}
        <section className="bg-white rounded-2xl shadow-sm p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <div className="bg-indigo-100 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 mb-6">
                To enhance road safety by providing a transparent and efficient system for managing traffic violations,
                ensuring accountability, and promoting responsible driving behavior across our communities.
              </p>
              <ul className="space-y-3">
                {missionItems.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2 mt-8 md:mt-0">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-8 h-full">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-6">
                    <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Impact in Numbers</h4>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    {stats.map((stat, index) => (
                      <div key={index} className="bg-white p-4 rounded-xl shadow-sm">
                        <p className="text-2xl font-bold text-indigo-600">{stat.number}</p>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}