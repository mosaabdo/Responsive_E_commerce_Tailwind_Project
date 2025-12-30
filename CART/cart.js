// Cart Management
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Load cart items on page load
document.addEventListener("DOMContentLoaded", () => {
  loadCartItems();
  updateOrderSummary();
});

// Load and display cart items
async function loadCartItems() {
  const cartItemsContainer = document.getElementById("cart-items");
  const emptyCartDiv = document.getElementById("empty-cart");

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "";
    emptyCartDiv.classList.remove("hidden");
    return;
  }

  emptyCartDiv.classList.add("hidden");
  
  // Fetch product details for each cart item
  const itemsHTML = await Promise.all(
    cart.map(async (item) => {
      try {
        const response = await fetch(
          `https://dummyjson.com/products/${item.id}`
        );
        const product = await response.json();
        return createCartItemHTML(product, item.quantity);
      } catch (error) {
        console.error("Error fetching product:", error);
        return "";
      }
    })
  );

  cartItemsContainer.innerHTML = itemsHTML.join("");
  attachEventListeners();
}

// Create HTML for a cart item
function createCartItemHTML(product, quantity) {
  const total = (product.price * quantity).toFixed(2);
  return `
    <div class="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row gap-6" data-id="${product.id}">
      <div class="w-full md:w-32 h-32 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0">
        <img
          src="${product.thumbnail}"
          alt="${product.title}"
          class="w-full h-full object-contain"
        />
      </div>
      
      <div class="flex-grow">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-lg font-bold text-slate-800 mb-2">${product.title}</h3>
            <p class="text-sm text-slate-500">${product.brand || "Generic"}</p>
          </div>
          <button
            onclick="removeFromCart(${product.id})"
            class="text-red-500 hover:text-red-700 text-xl"
          >
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
        
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2 border border-slate-200 rounded-lg">
              <button
                onclick="updateQuantity(${product.id}, -1)"
                class="px-3 py-1 text-slate-600 hover:bg-slate-100"
              >
                <i class="fa-solid fa-minus text-xs"></i>
              </button>
              <span class="px-4 py-1 font-bold text-slate-800" id="qty-${product.id}">${quantity}</span>
              <button
                onclick="updateQuantity(${product.id}, 1)"
                class="px-3 py-1 text-slate-600 hover:bg-slate-100"
              >
                <i class="fa-solid fa-plus text-xs"></i>
              </button>
            </div>
            <span class="text-lg font-bold text-slate-800">$${product.price}</span>
          </div>
          <div class="text-right">
            <p class="text-sm text-slate-500">Total</p>
            <p class="text-xl font-bold text-sky-600">$${total}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Update quantity
function updateQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId);
  if (!item) return;

  item.quantity += change;
  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  loadCartItems();
  updateOrderSummary();
}

// Remove from cart
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCartItems();
  updateOrderSummary();
}

// Update order summary
async function updateOrderSummary() {
  if (cart.length === 0) {
    document.getElementById("subtotal").textContent = "$0.00";
    document.getElementById("shipping").textContent = "$0.00";
    document.getElementById("tax").textContent = "$0.00";
    document.getElementById("total").textContent = "$0.00";
    document.getElementById("checkout-btn").disabled = true;
    return;
  }

  // Fetch actual prices
  const prices = await Promise.all(
    cart.map(async (item) => {
      try {
        const response = await fetch(
          `https://dummyjson.com/products/${item.id}`
        );
        const product = await response.json();
        return product.price * item.quantity;
      } catch (error) {
        return 0;
      }
    })
  );

  const actualSubtotal = prices.reduce((sum, price) => sum + price, 0);
  const shipping = actualSubtotal > 50 ? 0 : 10;
  const tax = actualSubtotal * 0.1;
  const total = actualSubtotal + shipping + tax;

  document.getElementById("subtotal").textContent = `$${actualSubtotal.toFixed(2)}`;
  document.getElementById("shipping").textContent = shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`;
  document.getElementById("tax").textContent = `$${tax.toFixed(2)}`;
  document.getElementById("total").textContent = `$${total.toFixed(2)}`;
  document.getElementById("checkout-btn").disabled = false;
}

// Attach event listeners
function attachEventListeners() {
  // Checkout button
  document.getElementById("checkout-btn").addEventListener("click", () => {
    alert("Checkout functionality coming soon!");
  });
}

// Global functions for onclick handlers
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;

