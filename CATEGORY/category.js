// Category Page Scripts
document.addEventListener("DOMContentLoaded", () => {
  loadCategories();
});

// Category icons mapping
const categoryIcons = {
  smartphones: "fa-mobile-screen-button",
  laptops: "fa-laptop",
  fragrances: "fa-spray-can",
  skincare: "fa-pump-soap",
  groceries: "fa-shopping-basket",
  "home-decoration": "fa-home",
  furniture: "fa-couch",
  tops: "fa-shirt",
  "womens-dresses": "fa-vest",
  "womens-shoes": "fa-shoe-prints",
  "mens-shirts": "fa-tshirt",
  "mens-shoes": "fa-shoe-prints",
  "mens-watches": "fa-clock",
  "womens-watches": "fa-clock",
  "womens-bags": "fa-bag-shopping",
  "womens-jewellery": "fa-gem",
  sunglasses: "fa-sunglasses",
  automotive: "fa-car",
  motorcycle: "fa-motorcycle",
  lighting: "fa-lightbulb",
};

// Category colors
const categoryColors = [
  "from-sky-400 to-sky-600",
  "from-purple-400 to-purple-600",
  "from-pink-400 to-pink-600",
  "from-green-400 to-green-600",
  "from-orange-400 to-orange-600",
  "from-red-400 to-red-600",
  "from-blue-400 to-blue-600",
  "from-indigo-400 to-indigo-600",
  "from-yellow-400 to-yellow-600",
  "from-teal-400 to-teal-600",
];

// Load all categories
async function loadCategories() {
  try {
    const response = await fetch("https://dummyjson.com/products/categories");
    const categories = await response.json();
    
    const container = document.getElementById("categories-grid");
    container.innerHTML = categories
      .map((category, index) => {
        const slug = category.slug || category;
        const name = category.name || category;
        const icon = categoryIcons[slug] || "fa-tag";
        const colorIndex = index % categoryColors.length;
        const color = categoryColors[colorIndex];
        
        return `
          <a
            href="../PRODUCTS/products.html?category=${slug}"
            class="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-xl transition-all group text-center"
          >
            <div class="h-32 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <i class="fa-solid ${icon} text-5xl text-white"></i>
            </div>
            <h3 class="text-xl font-bold text-slate-800 mb-2 group-hover:text-sky-600 transition-colors">
              ${name}
            </h3>
            <p class="text-slate-500 text-sm">Explore ${name.toLowerCase()} products</p>
            <div class="mt-4 text-sky-600 font-semibold text-sm">
              Shop Now <i class="fa-solid fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
            </div>
          </a>
        `;
      })
      .join("");
  } catch (error) {
    console.error("Error loading categories:", error);
    document.getElementById("categories-grid").innerHTML = `
      <div class="col-span-full text-center py-20">
        <i class="fa-solid fa-exclamation-triangle text-5xl text-slate-200 mb-4"></i>
        <p class="text-slate-500 font-medium">Failed to load categories. Please try again later.</p>
      </div>
    `;
  }
}

