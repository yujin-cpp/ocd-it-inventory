import { createContext, useContext, useState, useEffect } from "react";
import {
  getInventoryItems,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  searchInventoryItems,
} from "../services/api";

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load items on mount
  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getInventoryItems();
      setItems(data || []);
    } catch (err) {
      setError(err.message || "Failed to load items");
      console.error("Error loading items:", err);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item) => {
    try {
      setLoading(true);
      setError(null);
      const newItem = await createInventoryItem(item);
      setItems([...items, newItem]);
      return newItem;
    } catch (err) {
      setError(err.message || "Failed to add item");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateItemData = async (id, updatedItem) => {
    try {
      setLoading(true);
      setError(null);
      const updated = await updateInventoryItem(id, updatedItem);
      setItems(items.map((item) => (item.id === id ? updated : item)));
      return updated;
    } catch (err) {
      setError(err.message || "Failed to update item");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteItemData = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await deleteInventoryItem(id);
      setItems(items.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete item");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const searchItems = async (searchTerm) => {
    try {
      setLoading(true);
      setError(null);
      const results = await searchInventoryItems(searchTerm);
      setItems(results || []);
      return results;
    } catch (err) {
      setError(err.message || "Failed to search items");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshItems = async () => {
    await loadItems();
  };

  return (
    <InventoryContext.Provider
      value={{
        items,
        loading,
        error,
        addItem,
        updateItem: updateItemData,
        deleteItem: deleteItemData,
        searchItems,
        refreshItems,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within InventoryProvider");
  }
  return context;
};