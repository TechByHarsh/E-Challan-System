import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useRecordsContext } from "../contexts/RecordsContext";

export default function ViewAllRecords() {
  const { user } = useAuth();
  const { records, updateRecord, deleteRecord } = useRecordsContext();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all"); // all, pending, paid
  const [filterViolationType, setFilterViolationType] = useState("all");
  const [filterVehicleNumber, setFilterVehicleNumber] = useState("");
  const [sortBy, setSortBy] = useState("date"); // date, amount, type

  // Get unique violation types from records
  const violationTypes = [...new Set(records.map((record) => record.violationType))].sort();

  const filteredRecords = records
    .filter((record) => {
      // Status filter
      if (filter !== "all" && record.status.toLowerCase() !== filter.toLowerCase()) {
        return false;
      }
      // Violation type filter
      if (filterViolationType !== "all" && record.violationType !== filterViolationType) {
        return false;
      }
      // Vehicle number (license plate) filter
      if (filterVehicleNumber && !record.licensePlate.toUpperCase().includes(filterVehicleNumber.toUpperCase())) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date) - new Date(a.date);
      } else if (sortBy === "amount") {
        return b.amount - a.amount;
      } else if (sortBy === "type") {
        return a.violationType.localeCompare(b.violationType);
      }
      return 0;
    });

  const clearFilters = () => {
    setFilter("all");
    setFilterViolationType("all");
    setFilterVehicleNumber("");
  };

  const hasActiveFilters = filter !== "all" || filterViolationType !== "all" || filterVehicleNumber !== "";

  const handleStatusChange = (id, newStatus) => {
    updateRecord(id, { status: newStatus });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      deleteRecord(id);
    }
  };

  const handlePayNow = (record) => {
    // Navigate to payment page for consistent flow
    navigate("/payment");
  };

  const handleDownloadReceipt = (record) => {
    // Create a simple receipt text
    const receipt = `
TRAFFIC VIOLATION RECEIPT
========================

Violation ID: ${record.id}
Date: ${formatDate(record.date)} at ${record.time}
Type: ${record.violationType}
Location: ${record.location}
License Plate: ${record.licensePlate}
Amount Paid: $${record.amount.toFixed(2)}
Status: ${record.status}
Payment Date: ${new Date().toLocaleDateString()}

Thank you for your payment.
    `.trim();

    // Create a blob and download
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-blue-600 font-semibold">Traffic Violation & Fines</p>
            <h1 className="text-2xl font-bold text-gray-900">All Records</h1>
            <p className="text-sm text-gray-600">View and manage all violation records</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              Back to Dashboard
            </button>

          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters and Sort */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Violation Type</label>
                <select
                  value={filterViolationType}
                  onChange={(e) => setFilterViolationType(e.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[180px]"
                >
                  <option value="all">All Types</option>
                  {violationTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Vehicle Number</label>
                <input
                  type="text"
                  value={filterVehicleNumber}
                  onChange={(e) => setFilterVehicleNumber(e.target.value)}
                  placeholder="Enter license plate"
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="date">Date (Newest)</option>
                  <option value="amount">Amount (Highest)</option>
                  <option value="type">Type (A-Z)</option>
                </select>
              </div>
              {hasActiveFilters && (
                <div>
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredRecords.length}</span> of{" "}
                <span className="font-semibold">{records.length}</span> records
              </p>
              {hasActiveFilters && (
                <p className="text-xs text-gray-500">
                  {filter !== "all" && <span>Status: {filter} </span>}
                  {filterViolationType !== "all" && <span>Type: {filterViolationType} </span>}
                  {filterVehicleNumber && <span>Vehicle: {filterVehicleNumber.toUpperCase()} </span>}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Records Table */}
        {filteredRecords.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      License Plate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div>{formatDate(record.date)}</div>
                        <div className="text-xs text-gray-500">{record.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.violationType}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{record.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {record.licensePlate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ${record.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={record.status}
                          onChange={(e) => handleStatusChange(record.id, e.target.value)}
                          className={`text-xs font-medium rounded-full px-3 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 ${record.status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-orange-100 text-orange-800"
                            }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-3">
                          {record.status === "Pending" ? (
                            <button
                              onClick={() => handlePayNow(record)}
                              className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
                            >
                              Pay Now
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDownloadReceipt(record)}
                              className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition flex items-center gap-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Download Receipt
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(record.id)}
                            className="text-red-600 hover:text-red-700 font-medium text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
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
            <h3 className="mt-4 text-lg font-medium text-gray-900">No records found</h3>
            <p className="mt-2 text-sm text-gray-500">
              {!hasActiveFilters
                ? "Get started by adding your first violation record."
                : "No records match the current filters. Try adjusting your search criteria."}
            </p>

          </div>
        )}
      </main>
    </div>
  );
}

