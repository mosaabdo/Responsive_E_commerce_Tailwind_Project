// --- 1. الإعدادات والمتغيرات ---
const container = document.getElementById("pagination-container");
const productsSection = document.querySelector("#productd");
const upButton = document.querySelector("#up");
const categoryFilter = document.querySelector("#category-filter");
const brandFilter = document.querySelector("#brand-filter");
const searchInput = document.querySelector("#search-input");
const sortFilter = document.querySelector("#sort-filter");
const priceRange = document.querySelector("#price-range");
const priceValue = document.querySelector("#price-value");
const stockCheckbox = document.querySelector("#stock-only");
const clearBtn = document.querySelector("#clear-filters");

const LIMIT = 28;
let currentPage = parseInt(localStorage.getItem("currentPage")) || 1;
let currentCategory = "";
let currentBrand = "";
let searchQuery = "";
let maxPrice = 2000;
let sortBy = "";
let onlyInStock = false;

// --- 2. جلب البيانات المساعدة (الأقسام) ---
async function fetchCategories() {
  try {
    const res = await fetch("https://dummyjson.com/products/categories");
    const categories = await res.json();
    categoryFilter.innerHTML =
      '<option value="">All Categories</option>' +
      categories
        .map(
          (cat) =>
            `<option value="${cat.slug || cat}">${cat.name || cat}</option>`
        )
        .join("");
  } catch (err) {
    console.error(err);
  }
}

// --- 3. الدالة الرئيسية لجلب وفلترة البيانات ---
async function fetchAndRender(page) {
  // نجلب 100 منتج لنتمكن من عمل فلترة متقدمة (Client-side)
  let url = `https://dummyjson.com/products?limit=100`;

  if (searchQuery)
    url = `https://dummyjson.com/products/search?q=${searchQuery}&limit=100`;
  else if (currentCategory)
    url = `https://dummyjson.com/products/category/${currentCategory}?limit=100`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    let products = data.products;

    // تحديث قائمة الماركات ديناميكياً بناءً على المنتجات المتاحة
    updateBrandFilter(products);

    // [التطبيق الفعلي للفلاتر]
    if (currentBrand)
      products = products.filter((p) => p.brand === currentBrand);
    if (onlyInStock) products = products.filter((p) => p.stock > 0);
    products = products.filter((p) => p.price <= maxPrice);

    // [الترتيب]
    if (sortBy === "price-asc") products.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc")
      products.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating-desc")
      products.sort((a, b) => b.rating - a.rating);

    // [الترقيم اليدوي]
    const totalPages = Math.ceil(products.length / LIMIT);
    const startIndex = (page - 1) * LIMIT;
    const paginatedProducts = products.slice(startIndex, startIndex + LIMIT);

    displayProducts(paginatedProducts);
    renderPagination(page, totalPages);
  } catch (error) {
    console.error("Error:", error);
  }
}

// تحديث قائمة الماركات بناءً على الأقسام
function updateBrandFilter(products) {
  const brands = [...new Set(products.map((p) => p.brand).filter((b) => b))];
  const currentSelection = brandFilter.value;
  brandFilter.innerHTML =
    '<option value="">All Brands</option>' +
    brands
      .map(
        (b) =>
          `<option value="${b}" ${
            b === currentSelection ? "selected" : ""
          }>${b}</option>`
      )
      .join("");
}

// --- 4. رسم المنتجات والترقيم ---
function displayProducts(products) {
  if (products.length === 0) {
    productsSection.innerHTML = `
      <div class="col-span-full text-center py-20">
        <i class="fa-solid fa-box-open text-5xl text-slate-200 mb-4 block"></i>
        <p class="text-slate-500 font-medium">No products match your current filters.</p>
      </div>`;
    return;
  }

  productsSection.innerHTML = products
    .map(
      (product) => `
    <div class="bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl p-4 flex flex-col h-full group">
        <div class="relative w-full h-48 mb-4 bg-slate-50 rounded-xl overflow-hidden">
            <img src="${product.thumbnail}" alt="${
        product.title
      }" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500">
            ${
              product.stock < 10
                ? `<span class="absolute top-2 right-2 bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-1 rounded-full italic">Only ${product.stock} left</span>`
                : ""
            }
            <span class="absolute bottom-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold shadow-sm">$${
              product.price
            }</span>
        </div>

        <div class="flex flex-col flex-grow">
            <div class="flex justify-between items-start mb-1">
                <h3 class="text-sm font-bold text-slate-800 line-clamp-2 h-10 leading-tight">${
                  product.title
                }</h3>
            </div>
            
            <div class="flex items-center gap-2 mb-4">
                <span class="text-[10px] font-bold uppercase tracking-widest text-sky-600 bg-sky-50 px-2 py-0.5 rounded">${
                  product.brand || "Generic"
                }</span>
                <span class="text-[10px] font-bold text-yellow-600"><i class="fa-solid fa-star mr-1"></i>${
                  product.rating
                }</span>
            </div>

            <button onclick="addToCart(${
              product.id
            })" class="mt-auto w-full bg-slate-900 hover:bg-sky-600 text-white font-bold py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg active:scale-95">
                <i class="fa-solid fa-cart-plus text-sm"></i>
                <span class="text-sm">Add to Cart</span>
            </button>
        </div>
    </div>
  `
    )
    .join("");
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
    "fixed top-20 right-6 bg-sky-600 text-white px-6 py-3 rounded-xl shadow-lg z-50";
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

function renderPagination(current, total) {
  container.innerHTML = "";
  if (total <= 1) return;

  const nav = document.createElement("div");
  nav.className = "flex items-center gap-3";

  const createBtn = (label, target, isId) => {
    const b = document.createElement("button");
    b.innerText = label;
    b.disabled = isId;
    b.className =
      "px-4 py-2 bg-slate-800 text-white rounded-lg disabled:opacity-20 text-xs font-bold cursor-pointer";
    b.onclick = () => {
      currentPage = target;
      localStorage.setItem("currentPage", currentPage);
      fetchAndRender(currentPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    return b;
  };

  nav.appendChild(createBtn("← Prev", current - 1, current === 1));
  const pageIndicator = document.createElement("span");
  pageIndicator.className = "text-xs font-bold text-slate-500";
  pageIndicator.innerText = `Page ${current} / ${total}`;
  nav.appendChild(pageIndicator);
  nav.appendChild(createBtn("Next →", current + 1, current === total));

  container.appendChild(nav);
}

// --- 5. مستمعي الأحداث (Event Listeners) ---
categoryFilter.addEventListener("change", (e) => {
  currentCategory = e.target.value;
  currentBrand = "";
  currentPage = 1;
  fetchAndRender(1);
});
brandFilter.addEventListener("change", (e) => {
  currentBrand = e.target.value;
  currentPage = 1;
  fetchAndRender(1);
});
sortFilter.addEventListener("change", (e) => {
  sortBy = e.target.value;
  fetchAndRender(currentPage);
});
stockCheckbox.addEventListener("change", (e) => {
  onlyInStock = e.target.checked;
  currentPage = 1;
  fetchAndRender(1);
});
priceRange.addEventListener("input", (e) => {
  maxPrice = e.target.value;
  priceValue.innerText = `$${maxPrice}`;
  currentPage = 1;
  fetchAndRender(1);
});

let debounce;
searchInput.addEventListener("input", (e) => {
  clearTimeout(debounce);
  debounce = setTimeout(() => {
    searchQuery = e.target.value;
    currentPage = 1;
    fetchAndRender(1);
  }, 500);
});

clearBtn.addEventListener("click", () => {
  localStorage.setItem("currentPage", 1);
  location.reload(); // أسرع طريقة لمسح كل الحالات
});

// --- البداية ---
// Check for category in URL parameters
const urlParams = new URLSearchParams(window.location.search);
const categoryParam = urlParams.get("category");
if (categoryParam) {
  currentCategory = categoryParam;
}

fetchCategories().then(() => {
  // Set the category filter if category is in URL
  if (categoryParam && categoryFilter) {
    categoryFilter.value = categoryParam;
  }
  fetchAndRender(currentPage);
});

window.addEventListener("scroll", () => {
  if (upButton) {
    if (window.scrollY > 500) {
      upButton.classList.remove("hidden");
      upButton.classList.add("fixed"); // للتأكد أنه يظهر فوق العناصر
    } else {
      upButton.classList.add("hidden");
    }
  }
});

if (upButton) {
  upButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
