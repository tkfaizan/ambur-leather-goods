import { Truck, Shield, RefreshCw, Headphones } from "lucide-react";

export function FeaturesBar() {
  const features = [
    { icon: Truck, title: "Free Shipping", desc: "On orders above ₹999" },
    { icon: Shield, title: "Genuine Leather", desc: "100% authentic products" },
    { icon: RefreshCw, title: "Easy Returns", desc: "7-day return policy" },
    { icon: Headphones, title: "WhatsApp Support", desc: "Quick response time" },
  ];

  return (
    <section className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-12 h-12 bg-leather-50 rounded-full flex items-center justify-center flex-shrink-0"><f.icon className="w-6 h-6 text-leather-700" /></div>
              <div>
                <h4 className="font-semibold text-sm text-gray-900">{f.title}</h4>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
