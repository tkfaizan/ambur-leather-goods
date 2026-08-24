import { MessageCircle } from "lucide-react";

export function WhatsAppCTA() {
  return (
    <section className="bg-leather-900 text-white py-16 md:py-24 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Order Directly on WhatsApp</h2>
        <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">Prefer to chat? Send us your requirements on WhatsApp and we will help you place your order instantly.</p>
        <a href="https://wa.me/919629292165" target="_blank" className="btn-whatsapp text-lg px-8 py-4 inline-flex"><MessageCircle className="w-6 h-6" /> Chat on WhatsApp</a>
      </div>
    </section>
  );
}
