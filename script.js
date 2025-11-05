// script.js
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderProducts();
  handleAddToCart();
  handleSearch(); // 🧩 thêm dòng này để kích hoạt tìm kiếm trên toàn site
});

// 🛍️ Lấy giỏ hàng
function getCart() {
  return JSON.parse(sessionStorage.getItem("cart")) || [];
}

// 🛒 Lưu giỏ hàng
function saveCart(cart) {
  sessionStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// 🔢 Cập nhật số lượng trên biểu tượng giỏ hàng
function updateCartCount() {
  const cart = getCart();
  const cartCount = document.getElementById("cart-count");
  if (cartCount) cartCount.textContent = cart.length;
}

// 🧱 Hiển thị sản phẩm (dùng trong index.html, shop.html)
function renderProducts() {
  const productContainer = document.getElementById("product-list");
  if (!productContainer || typeof products === "undefined") return;

  products.forEach((p) => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-4";

    col.innerHTML = `
      <div class="card shadow-sm border-0 h-100">
        <a href="product-detail.html?id=${p.id}" class="text-decoration-none text-dark">
          <img src="${p.image}" class="card-img-top" alt="${p.name}" style="cursor: pointer;">
          <div class="card-body text-center">
            <h5 class="card-title text-danger fw-bold">${p.name}</h5>
            <p class="text-danger fw-bold">${p.price.toLocaleString()}₫</p>
          </div>
        </a>
        <div class="text-center pb-3">
          <button class="btn btn-outline-danger add-to-cart"
                  data-id="${p.id}" data-name="${p.name}" data-price="${p.price}">
            <i class="bi bi-cart-plus"></i> Thêm vào giỏ
          </button>
        </div>
      </div>
    `;
    productContainer.appendChild(col);
  });
}

// ➕ Thêm sản phẩm vào giỏ hàng
function handleAddToCart() {
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart")) {
      const btn = e.target.closest(".add-to-cart");
      const name = btn.dataset.name;
      const price = parseInt(btn.dataset.price);
      const id = btn.dataset.id;

      let cart = getCart();
      const existing = cart.find((item) => item.id === id);

      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ id, name, price, quantity: 1 });
      }

      saveCart(cart);
      alert("🛒 Đã thêm vào giỏ hàng!");
    }
  });
}

// 🔍 Tìm kiếm sản phẩm theo tên
function handleSearch() {
  const searchInput = document.querySelector(".search-bar input");
  if (!searchInput) return;

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const keyword = searchInput.value.trim();
      if (keyword) {
        window.location.href = `search.html?query=${encodeURIComponent(keyword)}`;
      }
    }
  });
}
