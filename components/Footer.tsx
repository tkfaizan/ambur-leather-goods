import Link from "next/link";
import { prisma } from "@/lib/db";

export async function Footer() {
  let settings = null;
  let categories: { id: number; name: string; slug: string }[] = [];

  try {
    settings = await prisma.setting.findFirst();
    categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      take: 6,
    });
  } catch (e) {
    // Database not ready yet — render empty footer
  }

  return (
    <footer className="bg-brand-dark text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="font-serif font-bold text-2xl mb-4">AMBUR Leather Goods</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium handcrafted leather goods from Ambur, Tamil Nadu.
              Manufacturing genuine leather products since generations.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Categories</h4>
            <ul className="space-y-2">
              {categories.map(cat => (
                <li key={cat.id}>
                  <Link href={`/categories/${cat.slug}`} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
              {categories.length === 0 && <li className="text-gray-500 text-sm">No categories</li>}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white text-sm">Home</Link></li>
              <li><Link href="/products" className="text-gray-400 hover:text-white text-sm">All Products</Link></li>
              <li><Link href="/cart" className="text-gray-400 hover:text-white text-sm">Cart</Link></li>
              <li><a href={`https://wa.me/${settings?.whatsappNumber || "919629292165"}`} target="_blank" className="text-gray-400 hover:text-white text-sm">Contact on WhatsApp</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {settings?.address ? <li>{settings.address}</li> : <li>Ambur, Tamil Nadu, India</li>}
              {settings?.email && <li>{settings.email}</li>}
              {settings?.businessPhone && <li>Phone: +{settings.businessPhone}</li>}
            </ul>
            <div className="flex gap-4 mt-4">
              {settings?.instagramUrl && <a href={settings.instagramUrl} target="_blank" className="text-gray-400 hover:text-white text-sm">Instagram</a>}
              {settings?.facebookUrl && <a href={settings.facebookUrl} target="_blank" className="text-gray-400 hover:text-white text-sm">Facebook</a>}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} {settings?.businessName || "AMBUR Leather Goods"}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
