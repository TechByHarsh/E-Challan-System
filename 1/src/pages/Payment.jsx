import React from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useRecordsContext } from "../contexts/RecordsContext";

export default function Payment() {
  const { user } = useAuth();
  const { records, getStats, updateRecord } = useRecordsContext();
  const navigate = useNavigate();

  const stats = getStats();
  const pendingRecords = records.filter((r) => r.status === "Pending");
  const paidRecords = records.filter((r) => r.status === "Paid");

  const handlePayNow = (record) => {
    // Handle both 'type' and 'violationType' property names
    const vType = record.type || record.violationType || "Traffic Violation";
    if (window.confirm(`Pay $${record.amount.toFixed(2)} for ${vType}?`)) {
      updateRecord(record.id, { status: "Paid" });
      alert("Payment successful! Your challan has been marked as Paid.");
    }
  };

  const handleDownloadReceipt = (record) => {
    const receipt = `
TRAFFIC VIOLATION PAYMENT RECEIPT
================================

Receipt ID: R-${record.id}
Violation ID: ${record.id}
Date: ${record.date} ${record.time}
Type: ${record.violationType}
Location: ${record.location}
License Plate: ${record.licensePlate}
Amount Paid: $${record.amount.toFixed(2)}
Status: ${record.status}
Payment Date: ${new Date().toLocaleString()}

Thank you for keeping our roads safe.
    `.trim();

    const blob = new Blob([receipt], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Receipt_${record.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-indigo-50">
      <header className="bg-white/90 backdrop-blur border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M4 7h16M4 17h4m4 0h4m4 0h-3M4 21h16"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-indigo-600 font-semibold">
                Secure Payment Center
              </p>
              <h1 className="text-xl font-bold text-gray-900">Pay Your Traffic Fines</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.email || "User"}</p>
              <p className="text-xs text-gray-500">Logged in</p>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 text-sm font-medium text-indigo-700 border border-indigo-200 rounded-lg bg-white hover:bg-indigo-50 transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Top Summary */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="lg:col-span-2 bg-white/90 backdrop-blur rounded-2xl shadow-sm border border-blue-100 p-6 md:p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Payment Summary</h2>
            <p className="text-sm text-gray-600 mb-6">
              Review your outstanding dues, complete secure payments, and download receipts for your records.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 shadow-sm">
                <p className="text-xs font-medium text-blue-700 uppercase">Total Violations</p>
                <p className="mt-2 text-2xl font-bold text-blue-900">{stats.totalViolations}</p>
              </div>
              <div className="bg-indigo-50 rounded-xl p-4 shadow-sm">
                <p className="text-xs font-medium text-indigo-700 uppercase">Pending Amount</p>
                <p className="mt-2 text-2xl font-bold text-indigo-900">
                  ${stats.pendingAmount.toFixed(2)}
                </p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 shadow-sm">
                <p className="text-xs font-medium text-green-700 uppercase">Paid Fines</p>
                <p className="mt-2 text-2xl font-bold text-green-900">${stats.totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-indigo-600 to-blue-500 rounded-2xl shadow-lg p-6 text-white flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Why pay on time?</h3>
              <p className="text-sm text-indigo-100 mb-4">
                Avoid higher penalties, late fees, and legal complications by paying your challans before the due date.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full" />
                  No queue, pay from anywhere
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full" />
                  Secure online transactions
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full" />
                  Instant payment confirmation
                </li>
              </ul>
            </div>
            <div className="mt-4">
              <img
                src="https://images.pexels.com/photos/4968398/pexels-photo-4968398.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Online payment illustration"
                className="w-full h-32 object-cover rounded-xl border border-white/30"
              />
            </div>
          </div>
        </section>

        {/* Pending Payments Section */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Pending Payments</h3>
              <p className="text-sm text-gray-600">
                Complete your outstanding payments to keep your record clean and avoid penalties.
              </p>
            </div>
            {pendingRecords.length > 0 && (
              <button
                onClick={() => navigate("/view-all-records", { state: { filter: "pending" } })}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-lg border border-indigo-200 hover:bg-indigo-100 transition"
              >
                View all pending challans
              </button>
            )}
          </div>

          {pendingRecords.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pendingRecords.map((record) => (
                <div
                  key={record.id}
                  className="bg-white rounded-xl shadow-sm border border-blue-100 p-4 flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-500">Violation ID</p>
                      <p className="text-sm font-bold text-gray-900">{record.id}</p>
                      <p className="mt-1 text-sm text-gray-700">{record.violationType}</p>
                      <p className="text-xs text-gray-500">{record.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-gray-500">Amount Due</p>
                      <p className="text-xl font-bold text-red-600">${record.amount.toFixed(2)}</p>
                      <p className="mt-1 text-xs text-gray-500">Due: {record.dueDate}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">Issued on: {formatDate(record.date)}</p>
                    <button
                      onClick={() => handlePayNow(record)}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Pay Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-dashed border-indigo-200 p-8 text-center">
              <h4 className="text-lg font-semibold text-gray-900">No pending payments 🎉</h4>
              <p className="mt-2 text-sm text-gray-600">
                You have cleared all your dues. We&apos;ll notify you when a new challan is issued.
              </p>
            </div>
          )}
        </section>

        {/* Payment History Section */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
              <p className="text-sm text-gray-600">
                Track all your completed payments and download receipts for your records.
              </p>
            </div>
          </div>

          {paidRecords.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-indigo-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-indigo-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {paidRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-indigo-50/40">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{record.id}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {formatDate(record.date)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{record.violationType}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                          ${record.amount.toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-green-50 text-green-700 border border-green-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1" /> Paid
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <button
                            onClick={() => handleDownloadReceipt(record)}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            Download Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-dashed border-indigo-200 p-8 text-center">
              <h4 className="text-lg font-semibold text-gray-900">No payments made yet</h4>
              <p className="mt-2 text-sm text-gray-600">
                Once you complete a payment, it will appear here along with a downloadable receipt.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

