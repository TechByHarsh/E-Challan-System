const API_URL = "http://localhost:5000/api/challans";

export const challanService = {
  // Fetch all challans
  getAllChallans: async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Network response was not ok");
      return await response.json();
    } catch (error) {
      console.error("Error fetching challans:", error);
      return [];
    }
  },

  // Fetch challans by vehicle number
  getChallansByVehicleNumber: async (vehicleNumber) => {
    try {
      const response = await fetch(`${API_URL}?vehicleNumber=${vehicleNumber}`);
      if (!response.ok) throw new Error("Network response was not ok");
      return await response.json();
    } catch (error) {
      console.error("Error fetching records:", error);
      throw error;
    }
  },

  // Get challan by ID
  getChallanById: async (id) => {
    // This endpoint isn't explicitly implemented in the simple server yet, 
    // but usually you'd have /:id. For now filtering client side or mock 
    // behavior if we don't add the route. 
    // Let's assume we might just filter from getAll or add the route later.
    // I didn't add /:id in routes yet, so I'll stick to client side finding for safety or update routes.
    // Actually, I'll update routes to include /:id later if needed.
    // For now, simpler:
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      return data.find(c => c.id === id);
    } catch (e) {
      return null;
    }
  },

  // Create a new challan
  createChallan: async (challanData) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(challanData),
      });
      if (!response.ok) throw new Error("Failed to create record");
      return await response.json();
    } catch (error) {
      console.error("Error creating record:", error);
      throw error;
    }
  },
};
