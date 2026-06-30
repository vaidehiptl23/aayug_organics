// Product database
const products = [
  { id: 1, name: "A2 Gir Cow Ghee", category: "ghee", price: 699, originalPrice: 849, rating: 4.8, reviews: 124, badge: "Bestseller", emoji: "🥛" },
  { id: 2, name: "Raw Forest Honey", category: "honey", price: 549, originalPrice: 599, rating: 4.7, reviews: 89, badge: "Organic", emoji: "🍯" },
  { id: 3, name: "Cold-Pressed Coconut Oil", category: "oils", price: 449, rating: 4.6, reviews: 56, badge: "New", emoji: "🥥" },
  { id: 4, name: "Organic Turmeric Powder", category: "spices", price: 249, originalPrice: 299, rating: 4.9, reviews: 203, badge: "17% OFF", emoji: "🌿" },
  { id: 5, name: "A2 Bilona Cow Ghee", category: "ghee", price: 799, originalPrice: 899, rating: 4.8, reviews: 234, badge: "Bestseller", emoji: "🥛" },
  { id: 6, name: "Wild Forest Honey", category: "honey", price: 599, rating: 4.9, reviews: 312, badge: "Bestseller", emoji: "🍯" },
  { id: 7, name: "Cold-Pressed Virgin Coconut Oil", category: "oils", price: 499, originalPrice: 549, rating: 4.7, reviews: 189, badge: "Bestseller", emoji: "🫒" },
  { id: 8, name: "Lakadong Turmeric Powder", category: "spices", price: 349, originalPrice: 399, rating: 4.8, reviews: 267, badge: "Bestseller", emoji: "🌿" },
  { id: 9, name: "Panchamrit Ghee with Herbs", category: "ghee", price: 1099, originalPrice: 1299, rating: 4.7, reviews: 52, badge: "New", emoji: "🥛" },
  { id: 10, name: "Buffalo Ghee – Vedic Style", category: "ghee", price: 699, rating: 4.5, reviews: 87, emoji: "🥛" },
  { id: 11, name: "Jamun Honey", category: "honey", price: 449, originalPrice: 499, rating: 4.6, reviews: 78, badge: "New", emoji: "🍯" },
  { id: 12, name: "Kachi Ghani Mustard Oil", category: "oils", price: 349, rating: 4.6, reviews: 156, badge: "Bestseller", emoji: "🫒" },
  { id: 13, name: "Malabar Black Pepper – Whole", category: "spices", price: 349, rating: 4.6, reviews: 112, emoji: "🌿" },
  { id: 14, name: "Tulsi Infused Honey", category: "honey", price: 449, rating: 4.4, reviews: 63, emoji: "🍯" },
  { id: 15, name: "Wood-Pressed Sesame Oil", category: "oils", price: 399, originalPrice: 449, rating: 4.5, reviews: 94, badge: "New", emoji: "🫒" },
  { id: 16, name: "Stone-Ground Garam Masala", category: "spices", price: 299, rating: 4.3, reviews: 45, badge: "New", emoji: "🌿" }
];

// Initialise localStorage if empty
if (!localStorage.getItem("cart")) {
  // Prepopulate with a couple of items to match the "4 items" in the original storefront screenshots
  localStorage.setItem("cart", JSON.stringify([
    { productId: 5, quantity: 2 },
    { productId: 6, quantity: 1 },
    { productId: 8, quantity: 1 }
  ]));
}
if (!localStorage.getItem("wishlist")) {
  localStorage.setItem("wishlist", JSON.stringify([5, 6, 7, 8]));
}

// State Accessors
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateBadges();
}

function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
}

function saveWishlist(wishlist) {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  updateBadges();
}

// Toast Notification
function showToast(message) {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }
  
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span>✔</span> <span>${message}</span>`;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = "slideIn 0.3s ease reverse forwards";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Cart Logic
function addToCart(productId, quantity = 1, silent = false) {
  const cart = getCart();
  const existing = cart.find(item => item.productId === productId);
  
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }
  
  saveCart(cart);
  if (!silent) {
    const product = products.find(p => p.id === productId);
    showToast(`${product.name} added to cart!`);
  }
}

function updateQuantity(productId, quantity) {
  let cart = getCart();
  const item = cart.find(item => item.productId === productId);
  if (item) {
    item.quantity = Math.max(1, quantity);
    saveCart(cart);
  }
}

function removeFromCart(productId) {
  let cart = getCart();
  const product = products.find(p => p.id === productId);
  cart = cart.filter(item => item.productId !== productId);
  saveCart(cart);
  showToast(`${product.name} removed from cart!`);
}

function clearCart() {
  saveCart([]);
  showToast("Cart cleared!");
}

// Wishlist Logic
function toggleWishlist(productId) {
  let wishlist = getWishlist();
  const product = products.find(p => p.id === productId);
  const index = wishlist.indexOf(productId);
  
  if (index > -1) {
    wishlist.splice(index, 1);
    showToast(`${product.name} removed from wishlist!`);
  } else {
    wishlist.push(productId);
    showToast(`${product.name} added to wishlist!`);
  }
  
  saveWishlist(wishlist);
  
  // Update UI heart icons if they exist on the page
  const buttons = document.querySelectorAll(`[data-wishlist-id="${productId}"]`);
  buttons.forEach(btn => {
    btn.classList.toggle("active", wishlist.includes(productId));
  });
}

function moveToCart(productId) {
  addToCart(productId, 1, true);
  let wishlist = getWishlist();
  wishlist = wishlist.filter(id => id !== productId);
  saveWishlist(wishlist);
  const product = products.find(p => p.id === productId);
  showToast(`${product.name} moved to cart!`);
  
  // Reload page if we are on the wishlist page
  if (window.location.pathname.includes("wishlist.html")) {
    renderWishlistPage();
  }
}

// Badge Counts Update
function updateBadges() {
  const cart = getCart();
  const wishlist = getWishlist();
  
  const cartTotalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistTotalQty = wishlist.length;
  
  const cartBadges = document.querySelectorAll(".cart-count");
  cartBadges.forEach(badge => badge.textContent = cartTotalQty);
  
  const wishlistBadges = document.querySelectorAll(".wishlist-count");
  wishlistBadges.forEach(badge => badge.textContent = wishlistTotalQty);
}

// Global UI Setup on DOM Load
document.addEventListener("DOMContentLoaded", () => {
  updateBadges();
  
  // Mobile drawer controls
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileNavOverlay = document.querySelector(".mobile-nav-overlay");
  const mobileNavDrawer = document.querySelector(".mobile-nav-drawer");
  const mobileDrawerClose = document.querySelector(".mobile-drawer-close");
  
  if (menuToggle && mobileNavDrawer) {
    menuToggle.addEventListener("click", () => {
      mobileNavOverlay.classList.add("active");
      mobileNavDrawer.classList.add("active");
    });
    
    const closeDrawer = () => {
      mobileNavOverlay.classList.remove("active");
      mobileNavDrawer.classList.remove("active");
    };
    
    if (mobileDrawerClose) mobileDrawerClose.addEventListener("click", closeDrawer);
    if (mobileNavOverlay) mobileNavOverlay.addEventListener("click", closeDrawer);
  }
  
  // Search Overlay controls
  const searchBtn = document.querySelector(".search-btn");
  const searchOverlay = document.querySelector(".search-overlay");
  const searchClose = document.querySelector(".search-close");
  const searchInput = document.querySelector(".search-input");
  const searchResults = document.querySelector(".search-results");
  
  if (searchBtn && searchOverlay) {
    searchBtn.addEventListener("click", () => {
      searchOverlay.classList.add("active");
      if (searchInput) {
        searchInput.focus();
        searchInput.value = "";
      }
      if (searchResults) {
        searchResults.classList.remove("active");
        searchResults.innerHTML = "";
      }
    });
    
    const closeSearch = () => {
      searchOverlay.classList.remove("active");
    };
    
    if (searchClose) searchClose.addEventListener("click", closeSearch);
    
    // Live Search Keyup
    if (searchInput && searchResults) {
      searchInput.addEventListener("keyup", (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query.length < 2) {
          searchResults.classList.remove("active");
          return;
        }
        
        const filtered = products.filter(p => p.name.toLowerCase().includes(query));
        searchResults.innerHTML = "";
        
        if (filtered.length === 0) {
          searchResults.innerHTML = `<div style="padding: 1rem; text-align: center; color: var(--color-text-muted)">No products found</div>`;
        } else {
          filtered.forEach(p => {
            const item = document.createElement("a");
            item.href = `products.html?search=${encodeURIComponent(p.name)}`;
            item.className = "search-result-item";
            item.innerHTML = `
              <div class="search-result-img">${p.emoji}</div>
              <div class="search-result-info">
                <h4>${p.name}</h4>
                <p>₹${p.price}</p>
              </div>
            `;
            searchResults.appendChild(item);
          });
        }
        searchResults.classList.add("active");
      });
    }
  }
  
  // Back to top scroll handler
  const backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTop.classList.add("active");
      } else {
        backToTop.classList.remove("active");
      }
    });
    
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
