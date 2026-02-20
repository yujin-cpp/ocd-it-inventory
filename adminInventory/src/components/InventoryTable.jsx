import { Button } from "./ui/button"

export default function InventoryTable({
  items = [],
  onDelete,
  onEdit,
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <table className="w-full table-fixed text-left">

        {/* Define fixed column widths */}
        <colgroup>
          <col className="w-[35%]" />
          <col className="w-[25%]" />
          <col className="w-[20%]" />
          <col className="w-[20%]" />
        </colgroup>

        <thead className="border-b bg-gray-50">
          <tr>
            <th className="p-3 font-medium">Item</th>
            <th className="p-3 font-medium">Category</th>
            <th className="p-3 font-medium">Quantity</th>
            <th className="p-3 font-medium">Actions</th>
          </tr>
        </thead>

        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan="4" className="p-4 text-center text-gray-500">
                No items found
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">

                {/* truncate prevents resizing */}
                <td className="p-3 truncate">{item.name}</td>

                <td className="p-3 truncate">
                  {item.category}
                </td>

                <td className="p-3">
                  {item.quantity}
                </td>

                <td className="p-2">
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(item)}
                    >
                      Edit
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(item.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>

              </tr>
            ))
          )}
        </tbody>

      </table>
    </div>
  )
}
