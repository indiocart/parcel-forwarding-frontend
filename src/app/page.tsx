import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      
      {/* HERO */}
      <section className="relative text-center py-36 bg-gradient-to-br from-sky-50 via-white to-blue-50 overflow-hidden">
        {/* Floating gradient shapes */}
<div className="absolute top-0 left-0 w-72 h-72 bg-sky-200 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
<div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-30 translate-x-1/2 translate-y-1/2"></div>
        <div className="max-w-5xl mx-auto px-6">
          
          <h1 className="text-6xl md:text-7xl font-extrabold leading-tight mb-6 tracking-tight">
            Shop From <span className="text-sky-500">India</span>.  
            We Deliver <span className="text-sky-500">Worldwide</span> 🌍
          </h1>

          <p className="text-xl text-gray-600 mb-10">
            Buy products from Indian websites even if they don’t ship to your country.  
            We purchase, store and ship your parcels globally.
          </p>

          <div className="flex justify-center gap-6">
            <button className="bg-sky-500 hover:bg-sky-600 text-white px-10 py-4 rounded-xl text-lg font-semibold shadow-xl hover:scale-105 transition">
              Start Shopping
            </button>

            <button className="border border-sky-500 text-sky-500 px-10 py-4 rounded-xl text-lg font-semibold hover:bg-sky-50">
              How It Works
            </button>
          </div>

        </div>

      </section>

      {/* STATS */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-3 text-center gap-10 px-6">
          
          <div>
            <h2 className="text-4xl font-bold text-sky-500">500+</h2>
            <p className="text-gray-600 mt-2">Orders Delivered</p>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-sky-500">40+</h2>
            <p className="text-gray-600 mt-2">Countries Served</p>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-sky-500">99%</h2>
            <p className="text-gray-600 mt-2">Happy Customers</p>
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="px-10 py-20">
        <h2 className="text-4xl text-center font-bold">
          Why Choose IndioCart?
        </h2>

        <div className="grid md:grid-cols-3 gap-10 mt-16">

        {/* Card 1 */}
        <div className="p-10 rounded-2xl shadow-lg hover:shadow-2xl transition bg-white text-center">
          <div className="text-5xl mb-4">🛒</div>
          <h3 className="text-2xl font-bold mb-3">Shop Any Indian Website</h3>
          <p className="text-gray-600">
            Amazon, Flipkart, Myntra or any local Indian store.
          </p>
        </div>

        {/* Card 2 */}
        <div className="p-10 rounded-2xl shadow-lg hover:shadow-2xl transition bg-white text-center">
          <div className="text-5xl mb-4">📦</div>
          <h3 className="text-2xl font-bold mb-3">We Buy For You</h3>
          <p className="text-gray-600">
            Place orders even without Indian cards or payment methods.
          </p>
        </div>

        {/* Card 3 */}
        <div className="p-10 rounded-2xl shadow-lg hover:shadow-2xl transition bg-white text-center">
          <div className="text-5xl mb-4">✈️</div>
          <h3 className="text-2xl font-bold mb-3">Fast Worldwide Shipping</h3>
          <p className="text-gray-600">
            Safe and reliable international delivery.
          </p>
        </div>

      </div>
      </section>
    {/* HOW IT WORKS */}
    <section className="bg-slate-100 py-24 px-10">
      <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>

      <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">

  {/* Step 1 */}
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
    <img src="/images/shop.jpg" alt="Shop online" className="h-56 w-full object-cover"/>
    <div className="p-8 text-center">
      <div className="text-4xl mb-3">1️⃣</div>
      <h3 className="text-xl font-bold mb-2">Send Product Link</h3>
      <p className="text-gray-600">Share product link from any Indian website.</p>
    </div>
  </div>

  {/* Step 2 */}
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
    <img src="/images/warehouse.jpg" alt="Warehouse" className="h-56 w-full object-cover"/>
    <div className="p-8 text-center">
      <div className="text-4xl mb-3">2️⃣</div>
      <h3 className="text-xl font-bold mb-2">We Purchase & Store</h3>
      <p className="text-gray-600">We buy and safely store in our warehouse.</p>
    </div>
  </div>

  {/* Step 3 */}
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
    <img src="/images/shipping.jpg" alt="Shipping" className="h-56 w-full object-cover"/>
    <div className="p-8 text-center">
      <div className="text-4xl mb-3">3️⃣</div>
      <h3 className="text-xl font-bold mb-2">We Ship Worldwide</h3>
      <p className="text-gray-600">Fast & secure international delivery.</p>
    </div>
  </div>

</div>
      
    </section>

    {/* TESTIMONIALS */}
    <section className="py-24 px-10">
      <h2 className="text-4xl font-bold text-center mb-16">
        Loved by Customers Worldwide ❤️
      </h2>

      <div className="grid grid-cols-3 gap-10">
        
        <div className="shadow-lg p-8 rounded-xl">
          <p className="mb-4">
            “Finally I can shop from Indian stores! IndioCart delivered safely to USA.”
          </p>
          <h4 className="font-semibold">— Sarah, USA</h4>
        </div>

        <div className="shadow-lg p-8 rounded-xl">
          <p className="mb-4">
            “Amazing service and very fast shipping. Highly recommended!”
          </p>
          <h4 className="font-semibold">— Ahmed, UAE</h4>
        </div>

        <div className="shadow-lg p-8 rounded-xl">
          <p className="mb-4">
            “Customer support was super helpful and responsive.”
          </p>
          <h4 className="font-semibold">— Daniel, UK</h4>
        </div>

      </div>
    </section>

    {/* FINAL CTA */}
<section className="py-28 bg-gradient-to-r from-sky-500 to-indigo-500 text-white text-center">
  <h2 className="text-5xl font-bold mb-6">
    Start Shopping From India Today 🌍
  </h2>

  <p className="text-xl mb-10">
    Join hundreds of international customers using IndioCart.
  </p>

  <button className="bg-white text-sky-600 px-10 py-5 rounded-xl text-xl font-bold shadow-xl hover:scale-105 transition">
    Create Free Account
  </button>
</section>
    {/* FOOTER */}
    <footer className="bg-slate-900 text-white py-12 px-10">
      <div className="flex justify-between">
        
        <div>
          <h3 className="text-2xl font-bold mb-3">IndioCart</h3>
          <p>Shop from India. Ship Worldwide.</p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Quick Links</h4>
          <p>How it works</p>
          <p>Pricing</p>
          <p>Contact</p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Contact</h4>
          <p>Email: support@indiocart.com</p>
          <p>India</p>
        </div>

      </div>

      <p className="text-center mt-10 text-sm">
        © 2026 IndioCart. All rights reserved.
      </p>
    </footer>
    </main>
  )
}