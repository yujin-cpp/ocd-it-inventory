import { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Label } from './ui/label'

export default function InventoryForm({ initialData = {}, onSubmit }) {
  const [name, setName] = useState(initialData.name || '')
  const [quantity, setQuantity] = useState(initialData.quantity || 0)
  const [category, setCategory] = useState(initialData.category || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ id: initialData.id || Date.now(), name, quantity, category })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-300 rounded-lg p-6 space-y-4 max-w-md">
      <div className="space-y-1">
        <Label>Name</Label>
        <Input value={name} onChange={e => setName(e.target.value)} placeholder="Item Name" required />
      </div>
      <div className="space-y-1">
        <Label>Quantity</Label>
        <Input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} required />
      </div>
      <div className="space-y-1">
        <Label>Category</Label>
        <Input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category" required />
      </div>
      <Button type="submit" className="cursor-pointer">Save Item</Button>
    </form>
  )
}
