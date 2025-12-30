// Home Page Scripts
document.addEventListener("DOMContentLoaded", () => {
  loadElectronics();
  loadFashion();
  loadBestSellers();
});

// Load Electronics Products
async function loadElectronics() {
  try {
    const response = await fetch(
      "https://dummyjson.com/products/category/smartphones?limit=10"
    );
    const data = await response.json();
    const container = document.getElementById("electronics-carousel");
    container.innerHTML = data.products
      .map(
        (product) => `
      <div class="min-w-[250px] bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all group">
        <div class="relative w-full h-48 mb-4 bg-slate-50 rounded-xl overflow-hidden">
          <img
            src="${product.thumbnail}"
            alt="${product.title}"
            class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
          />
          <span class="absolute bottom-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
            $${product.price}
          </span>
        </div>
        <h3 class="text-sm font-bold text-slate-800 mb-2 line-clamp-2">${product.title}</h3>
        <div class="flex items-center gap-2 mb-4">
          <span class="text-xs text-yellow-600">
            <i class="fa-solid fa-star"></i> ${product.rating}
          </span>
        </div>
        <button
          onclick="addToCart(${product.id})"
          class="w-full bg-slate-900 hover:bg-sky-600 text-white font-bold py-2 rounded-xl transition-all text-sm"
        >
          Add to Cart
        </button>
      </div>
    `
      )
      .join("");
  } catch (error) {
    console.error("Error loading electronics:", error);
  }
}

// Load Fashion Products
async function loadFashion() {
  try {
    const response = await fetch(
      "https://dummyjson.com/products/category/womens-dresses?limit=10"
    );
    const data = await response.json();
    const container = document.getElementById("fashion-carousel");
    container.innerHTML = data.products
      .map(
        (product) => `
      <div class="min-w-[250px] bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all group">
        <div class="relative w-full h-48 mb-4 bg-slate-50 rounded-xl overflow-hidden">
          <img
            src="${product.thumbnail}"
            alt="${product.title}"
            class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
          />
          <span class="absolute bottom-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
            $${product.price}
          </span>
        </div>
        <h3 class="text-sm font-bold text-slate-800 mb-2 line-clamp-2">${product.title}</h3>
        <div class="flex items-center gap-2 mb-4">
          <span class="text-xs text-yellow-600">
            <i class="fa-solid fa-star"></i> ${product.rating}
          </span>
        </div>
        <button
          onclick="addToCart(${product.id})"
          class="w-full bg-slate-900 hover:bg-sky-600 text-white font-bold py-2 rounded-xl transition-all text-sm"
        >
          Add to Cart
        </button>
      </div>
    `
      )
      .join("");
  } catch (error) {
    console.error("Error loading fashion:", error);
  }
}

// Load Best Sellers
async function loadBestSellers() {
  try {
    const response = await fetch("https://dummyjson.com/products?limit=8");
    const data = await response.json();
    // Sort by rating to get best sellers
    const bestSellers = data.products
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8);

    const container = document.getElementById("bestsellers-grid");
    container.innerHTML = bestSellers
      .map(
        (product) => `
      <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all group">
        <div class="relative w-full h-48 mb-4 bg-slate-50 rounded-xl overflow-hidden">
          <img
            src="${product.thumbnail}"
            alt="${product.title}"
            class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
          />
          <span class="absolute top-2 right-2 bg-yellow-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
            Best Seller
          </span>
          <span class="absolute bottom-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
            $${product.price}
          </span>
        </div>
        <h3 class="text-sm font-bold text-slate-800 mb-2 line-clamp-2">${product.title}</h3>
        <div class="flex items-center gap-2 mb-4">
          <span class="text-xs text-yellow-600">
            <i class="fa-solid fa-star"></i> ${product.rating}
          </span>
        </div>
        <button
          onclick="addToCart(${product.id})"
          class="w-full bg-slate-900 hover:bg-sky-600 text-white font-bold py-2 rounded-xl transition-all text-sm"
        >
          Add to Cart
        </button>
      </div>
    `
      )
      .join("");
  } catch (error) {
    console.error("Error loading best sellers:", error);
  }
}

// Scroll carousel
function scrollCarousel(carouselId, direction) {
  const carousel = document.getElementById(`${carouselId}-carousel`);
  const scrollAmount = 300;
  carousel.scrollBy({
    left: direction * scrollAmount,
    behavior: "smooth",
  });
}

// Add to cart function
function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  // Show notification
  const notification = document.createElement("div");
  notification.className =
    "fixed top-20 right-6 bg-sky-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-fade-in";
  notification.innerHTML = `
    <div class="flex items-center gap-2">
      <i class="fa-solid fa-check-circle"></i>
      <span>Product added to cart!</span>
    </div>
  `;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Make functions global
window.scrollCarousel = scrollCarousel;
window.addToCart = addToCart;
