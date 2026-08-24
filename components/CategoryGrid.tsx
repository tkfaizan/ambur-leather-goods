import Link from "next/link";
import Image from "next/image";
import { CategoryWithCount } from "@/types";

export function CategoryGrid({ categories }: { categories: CategoryWithCount[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {categories.map((cat) => (
        <Link key={cat.id} href={`/categories/${cat.slug}`} className="group card overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
            {cat.image ? (
              <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-leather-100 text-leather-700 font-serif text-4xl font-bold">{cat.name[0]}</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white font-semibold text-lg">{cat.name}</h3>
              <p className="text-white/80 text-sm">{cat._count?.products || 0} products</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
