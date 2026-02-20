import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Label } from "./ui/label"

export default function InventoryForm({
  initialData = {},
  onSubmit,
  onCancel,
}) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      category: "",
      quantity: "",
    },
  })

  useEffect(() => {
    if (initialData?.id) {
      reset(initialData)
    }
  }, [initialData, reset])

  const submitHandler = (data) => {
    const item = {
      id: initialData?.id ?? crypto.randomUUID(),
      name: data.name,
      category: data.category,
      quantity: Number(data.quantity),
    }

    onSubmit(item)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <div className="flex flex-col gap-1">
        <Label className="ml-1">Name</Label>
        <Input {...register("name", { required: true })} />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="ml-1">Category</Label>
        <Input {...register("category", { required: true })} />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="ml-1">Quantity</Label>
        <Input type="number" {...register("quantity", { required: true })} />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#A31F35] text-white">
          Save
        </Button>
      </div>
    </form>
  )
}
