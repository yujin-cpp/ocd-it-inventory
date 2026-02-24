import { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Label } from './ui/label'

export default function InventoryForm({ initialData = {}, onSubmit }) {
  const [itemName, setItemName] = useState(initialData.itemName || '')
  const [category, setCategory] = useState(initialData.category || '')
  const [location, setLocation] = useState(initialData.location || '')
  const [quantity, setQuantity] = useState(initialData.quantity || 0)
  const [unitPrice, setUnitPrice] = useState(initialData.unitPrice || 0)
  const [description, setDescription] = useState(initialData.description || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      itemName,
      itemCode: `${itemName.substring(0, 3).toUpperCase()}-${Date.now()}`,
      category,
      location,
      quantity: Number(quantity),
      unitPrice: Number(unitPrice),
      status: 'Active',
      description
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-300 rounded-lg p-6 space-y-4 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Item Name *</Label>
          <Input value={itemName} onChange={e => setItemName(e.target.value)} placeholder="Item Name" required />
        </div>
        <div className="space-y-1">
          <Label>Category *</Label>
          <Input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category" required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Location *</Label>
          <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="Location" required />
        </div>
        <div className="space-y-1">
          <Label>Quantity *</Label>
          <Input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="0" required />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-1">
          <Label>Unit Price *</Label>
          <Input type="number" step="0.01" value={unitPrice} onChange={e => setUnitPrice(e.target.value)} placeholder="0.00" required />
        </div>
      </div>

      <div className="space-y-1">
        <Label>Description</Label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Item Description" rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
      </div>

      <Button type="submit" className="cursor-pointer w-full">Save Item</Button>
    </form>
  )
}
