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

  const currentPage = window.location.pathname.split("/").pop();

  // Nếu trang shop.html
  if (currentPage === "shop.html") {
    const displayProducts = products.slice(0, 5); // 5 sản phẩm
    // Tạo 2 hàng
    const row1 = document.createElement("div");
    row1.className = "row g-4";
    productContainer.appendChild(row1);

    const row2 = document.createElement("div");
    row2.className = "row g-4 justify-content-center mt-2"; // căn giữa hàng 2
    productContainer.appendChild(row2);

    displayProducts.forEach((p, index) => {
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
            <a href="story.html?id=${p.id}" class="btn btn-outline-secondary">
              <i class="bi bi-book-half"></i> Câu chuyện
            </a>
          </div>
        </div>
      `;
      if (index < 3) {
        row1.appendChild(col); // 3 sản phẩm đầu hàng 1
      } else {
        row2.appendChild(col); // 2 sản phẩm còn lại hàng 2
      }
    });

    // Nút xem thêm sản phẩm dưới hàng 2
    const viewMore = document.createElement("div");
    viewMore.className = "text-center mt-4 w-100";
    viewMore.innerHTML = `
      <button class="btn btn-outline-danger px-4 py-2 fw-bold rounded-pill shadow-sm">
        <i class="bi bi-plus-circle"></i> Xem thêm sản phẩm tương lai
      </button>
    `;
    productContainer.appendChild(viewMore);

    return; // thoát hàm để không chạy code index.html phía dưới
  }

  // Nếu trang index.html hoặc các trang khác, giữ nguyên code cũ
  const displayProducts = currentPage === "index.html"
    ? products.slice(0, 3)
    : products;

  displayProducts.forEach((p) => {
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
          <a href="story.html?id=${p.id}" class="btn btn-outline-secondary">
            <i class="bi bi-book-half"></i> Câu chuyện
          </a>
        </div>
      </div>
    `;
    productContainer.appendChild(col);
  });

  // Nếu trang index.html, thêm nút "Xem thêm sản phẩm"
  if (currentPage === "index.html") {
    const viewMore = document.createElement("div");
    viewMore.className = "text-center mt-4";
    viewMore.innerHTML = `
      <a href="shop.html" class="btn btn-danger px-4">
        Xem thêm sản phẩm
      </a>
    `;
    productContainer.parentElement.appendChild(viewMore);
  }
}



// ➕ Thêm sản phẩm vào giỏ hàng
function handleAddToCart() {
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart") || e.target.closest(".add-to-cart")) {
      const btn = e.target.closest(".add-to-cart");
      const name = btn.dataset.name;
      const price = parseInt(btn.dataset.price);
      const id = btn.dataset.id;

      // 🔢 Lấy số lượng từ input (nếu có)
      const quantityInput = document.getElementById(`quantity-${id}`);
      const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

      let cart = getCart();
      const existing = cart.find((item) => item.id === id);

      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.push({ id, name, price, quantity });
      }

      saveCart(cart);
      alert(`🛒 ${name} (${quantity} chiếc) đã được thêm vào giỏ hàng!`);
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
// ✅ Hiển thị tên người dùng khi đăng nhập thành công
function handleUserDisplay() {
  const userSection = document.getElementById("user-section");
  if (!userSection) return;

  const user = JSON.parse(sessionStorage.getItem("user"));

  if (user && user.name) {
    userSection.innerHTML = `
      <div class="dropdown">
        <button class="btn btn-light dropdown-toggle d-flex align-items-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          <img src="${user.avatar || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}" 
               alt="Avatar" class="rounded-circle me-2 border border-1 border-danger" width="35" height="35">
          <span class="fw-semibold text-dark">${user.name}</span>
        </button>
        <ul class="dropdown-menu dropdown-menu-end shadow-sm">
          <li><a class="dropdown-item" href="profile.html"><i class="bi bi-person-circle me-2"></i>Trang cá nhân</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item text-danger" href="#" id="logout-btn"><i class="bi bi-box-arrow-right me-2"></i>Đăng xuất</a></li>
        </ul>
      </div>
    `;

    document.getElementById("logout-btn").addEventListener("click", (e) => {
      e.preventDefault();
      sessionStorage.removeItem("user");
      location.reload();
    });
  }
}

