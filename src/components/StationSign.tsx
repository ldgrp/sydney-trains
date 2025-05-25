export default function StationSign({ title }: { title: string }) {
  return (
    <div className="text-4xl font-medium font-sydney-trains text-white bg-sydney-trains shadow-md py-1.5 px-2 text-center tracking-tight w-sm hover:bg-sydney-trains/80 transition-colors">
      {title}
    </div>
  )
}
