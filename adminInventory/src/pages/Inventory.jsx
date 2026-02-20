import { useState } from "react"

import Layout from "../components/Layout"
import InventoryForm from "../components/InventoryForm"
import InventoryTable from "../components/InventoryTable"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "../components/ui/dialog"

import { Button } from "../components/ui/button"

export default function Inventory() {
  const [items, setItems] = useState([
    { id: "1", name: "Printer Paper", quantity: 50, category: "Office" },
    { id: "2", name: "Mouse", quantity: 20, category: "Electronics" },
  ])

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  // Add or Edit
  const handleSubmit = (item) => {
    if (editingItem) {
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? item : i))
      )
    } else {
      setItems((prev) => [...prev, item])
    }

    setEditingItem(null)
    setDialogOpen(false)
  }

  // Delete
  const handleDelete = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  // Edit open dialog
  const handleEdit = (item) => {
    setEditingItem(item)
    setDialogOpen(true)
  }

  // Add new open dialog
  const handleAddNew = () => {
    setEditingItem(null)
    setDialogOpen(true)
  }

  return (
    <Layout title="Inventory">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          Supplies and Materials
        </h2>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleAddNew}
              className="bg-[#A31F35] text-white hover:bg-[#8b1a2d]"
            >
              + Add Item
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Item" : "Add Item"}
              </DialogTitle>

              <DialogDescription>
                Manage your inventory item
              </DialogDescription>
            </DialogHeader>

            <InventoryForm
              initialData={editingItem}
              onSubmit={handleSubmit}
              onCancel={() => setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <InventoryTable
        items={items}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

    </Layout>
  )
}
