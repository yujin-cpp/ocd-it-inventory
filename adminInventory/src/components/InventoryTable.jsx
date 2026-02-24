import { useInventory } from '../context/InventoryContext'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'

export default function InventoryTable() {
  const { items, deleteItem } = useInventory()
  const navigate = useNavigate()

  return (
    <table className="table-auto w-full border-collapse border border-gray-200 drop-shadow-sm rounded-lg overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="border px-4 py-2">Name</th>
          <th className="border px-4 py-2">Quantity</th>
          <th className="border px-4 py-2">Category</th>
          <th className="border px-4 py-2">Unit Price</th>
          <th className="border px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map(item => (
          <tr key={item.id} className="hover:bg-gray-50">
            <td className="border px-4 py-2">{item.itemName}</td>
            <td className="border px-4 py-2">{item.quantity}</td>
            <td className="border px-4 py-2">{item.category}</td>
            <td className="border px-4 py-2">₱{item.unitPrice.toFixed(2)}</td>
            <td className="border px-4 py-2 flex gap-2">
              <Button variant="outline" onClick={() => navigate(`/inventory/edit/${item.id}`)}>Edit</Button>
              <Button variant="destructive" onClick={() => deleteItem(item.id)}>Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
