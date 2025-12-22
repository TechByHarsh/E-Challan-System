import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useRecordsContext } from "../contexts/RecordsContext";

export default function ViolationsAnalytics() {
  const { user } = useAuth();
  const { records, getStats } = useRecordsContext();
  const navigate = useNavigate();
  const stats = getStats();

  // Calculate status breakdown
  const statusBreakdown = useMemo(() => {
    const pending = records.filter((r) => r.status === "Pending").length;
    const paid = records.filter((r) => r.status === "Paid").length;
    const total = records.length;
    return { pending, paid, total };
  }, [records]);

  // Calculate violation type breakdown
  const violationTypeBreakdown = useMemo(() => {
    const breakdown = {};
    records.forEach((record) => {
      breakdown[record.violationType] = (breakdown[record.violationType] || 0) + 1;
    });
    return Object.entries(breakdown)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);
  }, [records]);

  // Calculate time-based breakdown (by month)
  const timeBreakdown = useMemo(() => {
    const monthly = {};
    records.forEach((record) => {
      const date = new Date(record.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const monthName = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      if (!monthly[monthKey]) {
        monthly[monthKey] = { name: monthName, count: 0, amount: 0 };
      }
      monthly[monthKey].count += 1;
      monthly[monthKey].amount += record.amount;
    });
    return Object.entries(monthly)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, data]) => ({ key, ...data }));
  }, [records]);

  // Calculate time-based breakdown (by day of week)
  const dayOfWeekBreakdown = useMemo(() => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const breakdown = days.map((day) => ({ day, count: 0 }));
    records.forEach((record) => {
      const date = new Date(record.date);
      const dayIndex = date.getDay();
      breakdown[dayIndex].count += 1;
    });
    return breakdown;
  }, [records]);

  // Calculate time-based breakdown (by hour)
  const hourBreakdown = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0, label: `${i}:00` }));
    records.forEach((record) => {
      if (record.time) {
        const hour = parseInt(record.time.split(":")[0]);
        if (!isNaN(hour) && hour >= 0 && hour < 24) {
          hours[hour].count += 1;
        }
      }
    });
    return hours;
  }, [records]);

  // Pie chart for status breakdown
  const StatusPieChart = () => {
    const { pending, paid, total } = statusBreakdown;
    if (total === 0) {
      return (
        <div className="flex items-center justify-center h-48">
          <p className="text-gray-500">No data available</p>
        </div>
      );
    }

    const pendingPercent = (pending / total) * 100;
    const paidPercent = (paid / total) * 100;

    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const pendingDash = (pendingPercent / 100) * circumference;
    const paidDash = (paidPercent / 100) * circumference;

    return (
      <div className="relative flex items-center justify-center">
        <svg width="200" height="200" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="currentColor"
            strokeWidth="20"
            fill="none"
            className="text-blue-100"
          />
          {/* Pending segment */}
          {pending > 0 && (
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="currentColor"
              strokeWidth="20"
              fill="none"
              strokeDasharray={`${pendingDash} ${circumference}`}
              strokeDashoffset="0"
              className="text-orange-500"
              strokeLinecap="round"
            />
          )}
          {/* Paid segment */}
          {paid > 0 && (
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="currentColor"
              strokeWidth="20"
              fill="none"
              strokeDasharray={`${paidDash} ${circumference}`}
              strokeDashoffset={-pendingDash}
              className="text-green-500"
              strokeLinecap="round"
            />
          )}
        </svg>
        <div className="absolute text-center">
          <p className="text-2xl font-bold text-blue-900">{total}</p>
          <p className="text-sm text-blue-700">Total</p>
        </div>
      </div>
    );
  };

  const maxTypeCount = Math.max(...violationTypeBreakdown.map((v) => v.count), 1);
  const maxTimeCount = Math.max(...timeBreakdown.map((t) => t.count), 1);
  const maxDayCount = Math.max(...dayOfWeekBreakdown.map((d) => d.count), 1);
  const maxHourCount = Math.max(...hourBreakdown.map((h) => h.count), 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <header className="bg-white border-b border-blue-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-blue-600 font-semibold">Traffic Violation & Fines</p>
            <h1 className="text-2xl font-bold text-blue-900">Violations Analytics</h1>
            <p className="text-sm text-gray-600">Detailed breakdown and insights</p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md border border-blue-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Violations</p>
                <p className="text-2xl font-bold text-blue-900">{stats.totalViolations}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-blue-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{statusBreakdown.pending}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-blue-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Paid</p>
                <p className="text-2xl font-bold text-green-600">{statusBreakdown.paid}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-white rounded-xl shadow-md border border-blue-200 p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-blue-900">Status Breakdown</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center">
              <div className="relative">
                <StatusPieChart />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">Pending</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-orange-600">{statusBreakdown.pending}</p>
                  <p className="text-xs text-gray-600">
                    {statusBreakdown.total > 0 ? ((statusBreakdown.pending / statusBreakdown.total) * 100).toFixed(1) : 0}%
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">Paid</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">{statusBreakdown.paid}</p>
                  <p className="text-xs text-gray-600">
                    {statusBreakdown.total > 0 ? ((statusBreakdown.paid / statusBreakdown.total) * 100).toFixed(1) : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Violation Type Breakdown */}
        <div className="bg-white rounded-xl shadow-md border border-blue-200 p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-blue-900">Violation Type Breakdown</h2>
          </div>
          <div className="space-y-4">
            {violationTypeBreakdown.length > 0 ? (
              violationTypeBreakdown.map((item, index) => {
                const percentage = (item.count / maxTypeCount) * 100;
                const barColors = [
                  "bg-blue-500",
                  "bg-blue-400",
                  "bg-blue-300",
                  "bg-blue-200",
                  "bg-blue-100",
                ];
                const colorClass = barColors[Math.min(index, barColors.length - 1)];
                return (
                  <div key={item.type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{item.type}</span>
                      <span className="text-sm font-bold text-blue-900">{item.count}</span>
                    </div>
                    <div className="w-full bg-blue-100 rounded-full h-4 overflow-hidden">
                      <div
                        className={`${colorClass} h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                        style={{ width: `${percentage}%` }}
                      >
                        {percentage > 15 && (
                          <span className="text-xs font-medium text-white">{item.count}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-8">No violation types found</p>
            )}
          </div>
        </div>

        {/* Time-Based Breakdown - Monthly */}
        <div className="bg-white rounded-xl shadow-md border border-blue-200 p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-blue-900">Monthly Breakdown</h2>
          </div>
          <div className="space-y-4">
            {timeBreakdown.length > 0 ? (
              timeBreakdown.map((item) => {
                const percentage = (item.count / maxTimeCount) * 100;
                return (
                  <div key={item.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{item.name}</span>
                      <div className="text-right">
                        <span className="text-sm font-bold text-blue-900">{item.count} violations</span>
                        <span className="text-xs text-gray-500 ml-2">${item.amount.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="w-full bg-blue-100 rounded-full h-6 overflow-hidden">
                      <div
                        className="bg-blue-500 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                        style={{ width: `${percentage}%` }}
                      >
                        {percentage > 20 && (
                          <span className="text-xs font-medium text-white">{item.count}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-8">No monthly data available</p>
            )}
          </div>
        </div>

        {/* Time-Based Breakdown - Day of Week */}
        <div className="bg-white rounded-xl shadow-md border border-blue-200 p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-blue-900">Day of Week Breakdown</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {dayOfWeekBreakdown.map((item) => {
              const percentage = maxDayCount > 0 ? (item.count / maxDayCount) * 100 : 0;
              return (
                <div key={item.day} className="text-center space-y-2">
                  <p className="text-xs font-medium text-gray-600">{item.day.substring(0, 3)}</p>
                  <div className="relative h-32 bg-blue-100 rounded-lg overflow-hidden flex items-end">
                    <div
                      className="w-full bg-blue-500 transition-all duration-500"
                      style={{ height: `${percentage}%` }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-900">{item.count}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Time-Based Breakdown - Hour of Day */}
        <div className="bg-white rounded-xl shadow-md border border-blue-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-blue-900">Hour of Day Breakdown</h2>
          </div>
          <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
            {hourBreakdown.map((item) => {
              const percentage = maxHourCount > 0 ? (item.count / maxHourCount) * 100 : 0;
              return (
                <div key={item.hour} className="text-center space-y-1">
                  <p className="text-xs text-gray-600">{item.hour}</p>
                  <div className="relative h-24 bg-blue-100 rounded overflow-hidden flex items-end">
                    <div
                      className="w-full bg-blue-500 transition-all duration-500"
                      style={{ height: `${percentage}%` }}
                    ></div>
                    {item.count > 0 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{item.count}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

