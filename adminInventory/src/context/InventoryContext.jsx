import { createContext, useContext, useState } from "react";

const InventoryContext = createContext()

export const InventoryProvider = ({ children }) => {
    const [items, setItems] = useState([])

    const addItem = (item) => setItems([...items, item])
    const updateItem = (id, updatedItem) => {
        setItems(items.map(item => item.id === id ? updatedItem : item))
    }
    const deleteItem = (id) => setItems(items.filter(item => item.id !== id))

    return (
        <InventoryContext.Provider value={{ items, addItem, updateItem, deleteItem }}>
            {children}
        </InventoryContext.Provider>
    )
}

export const useInventory = () => useContext(InventoryContext)