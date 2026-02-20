export default function Header({ title }) {
  return (
    <header className="bg-transparent p-4 shadow-sm rounded-lg">
      <h1 className="text-xl font-bold">{title}</h1>
    </header>
  )
}
