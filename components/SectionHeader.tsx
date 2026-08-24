export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-10">
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
      <div className="w-16 h-1 bg-brand-gold mx-auto mt-4 rounded-full" />
    </div>
  );
}
