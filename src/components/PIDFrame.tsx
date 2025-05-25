export default function PIDFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-black p-4 border-[0.375em] border-neutral-200 border-t-neutral-100 border-l-neutral-100 shadow-lg">
      {children}
    </div>
  )
}
