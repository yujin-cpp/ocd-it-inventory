import axios from "axios";

const API_BASE_URL = "http://localhost:5278/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Get all inventory items
export const getInventoryItems = async () => {
  try {
    const response = await apiClient.get("/inventory");
    return response.data;
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    throw new Error("Failed to fetch inventory items");
  }
};

// Get single inventory item by ID
export const getInventoryItemById = async (id) => {
  try {
    const response = await apiClient.get(`/inventory/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching item ${id}:`, error);
    throw new Error("Failed to fetch inventory item");
  }
};

// Create new inventory item
export const createInventoryItem = async (item) => {
  try {
    const response = await apiClient.post("/inventory", item);
    return response.data;
  } catch (error) {
    console.error("Error creating inventory item:", error);
    throw new Error("Failed to create inventory item");
  }
};

// Update inventory item
export const updateInventoryItem = async (id, item) => {
  try {
    const response = await apiClient.put(`/inventory/${id}`, item);
    return response.data;
  } catch (error) {
    console.error(`Error updating item ${id}:`, error);
    throw new Error("Failed to update inventory item");
  }
};

// Delete inventory item
export const deleteInventoryItem = async (id) => {
  try {
    await apiClient.delete(`/inventory/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting item ${id}:`, error);
    throw new Error("Failed to delete inventory item");
  }
};

// Search inventory items
export const searchInventoryItems = async (searchTerm) => {
  try {
    const response = await apiClient.get(`/inventory/search/${searchTerm}`);
    return response.data;
  } catch (error) {
    console.error("Error searching inventory:", error);
    throw new Error("Failed to search inventory");
  }
};

// Get items by status
export const getInventoryItemsByStatus = async (status) => {
  try {
    const response = await apiClient.get(`/inventory/status/${status}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching items with status ${status}:`, error);
    throw new Error("Failed to fetch items by status");
  }
};