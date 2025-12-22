import React, { createContext, useContext, useState, useMemo } from "react";
import { challanService } from "../services/challanService";

const RecordsContext = createContext(null);

export function RecordsProvider({ children }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load records for a specific vehicle
  const fetchRecordsByVehicle = async (vehicleNumber) => {
    setLoading(true);
    setError(null);
    try {
      const data = await challanService.getChallansByVehicleNumber(vehicleNumber);
      setRecords(data);
    } catch (err) {
      setError("Failed to fetch records");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Clear records (e.g. on logout)
  const clearRecords = () => {
    setRecords([]);
  };

  const getStats = () => {
    const totalViolations = records.length;
    const pendingPayments = records.filter((r) => r.status === "Pending").length;
    const paidFines = records.filter((r) => r.status === "Paid").length;
    const totalAmount = records.reduce((sum, r) => sum + r.amount, 0);
    const pendingAmount = records
      .filter((r) => r.status === "Pending")
      .reduce((sum, r) => sum + r.amount, 0);

    return {
      totalViolations,
      pendingPayments,
      paidFines,
      totalAmount,
      pendingAmount,
    };
  };

  // Update a record (e.g. mark as Paid)
  const updateRecord = async (id, updates) => {
    try {
      // Optimistic update or wait for server
      await challanService.updateChallan(id, updates);
      // Refresh logic or manual update
      setRecords(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    } catch (err) {
      console.error("Failed to update record", err);
      // Optionally handle error state
    }
  };

  const value = useMemo(
    () => ({
      records,
      loading,
      error,
      fetchRecordsByVehicle,
      clearRecords,
      getStats,
      updateRecord,
    }),
    [records, loading, error]
  );

  return <RecordsContext.Provider value={value}>{children}</RecordsContext.Provider>;
}

export function useRecordsContext() {
  const context = useContext(RecordsContext);
  if (!context) {
    throw new Error("useRecordsContext must be used within a RecordsProvider");
  }
  return context;
}

