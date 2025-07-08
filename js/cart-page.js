// cart-page.js
document.addEventListener("DOMContentLoaded", function () {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItemsList = document.querySelector(".cart-items-list");
  const cartEmpty = document.querySelector(".cart-empty");
  const itemsCountElement = document.querySelector(".items-count");
  const totalPriceElement = document.querySelector(".total-price");
  const checkoutBtn = document.querySelector(".checkout-btn");

  function renderCartItems() {
    cartItemsList.innerHTML = "";

    if (cart.length === 0) {
      cartEmpty.style.display = "block";
      cartItemsList.style.display = "none";
      checkoutBtn.disabled = true;
      return;
    }

    cartEmpty.style.display = "none";
    cartItemsList.style.display = "block";

    let totalPrice = 0;
    let totalItems = 0;

    cart.forEach((item) => {
      totalPrice += item.price * item.quantity;
      totalItems += item.quantity;

      const cartItemElement = document.createElement("div");
      cartItemElement.className = "cart-item";
      cartItemElement.innerHTML = `
        <img src="images/kitten.jpg" alt="${item.title}" class="cart-item-img">
        <div class="cart-item-details">
          <h3 class="cart-item-title">${item.title}</h3>
          <p class="cart-item-price">${item.price} руб</p>
        </div>
        <div class="cart-item-controls">
          <div class="quantity-control">
            <button class="quantity-btn minus" data-id="${item.id}">-</button>
            <span class="quantity-value">${item.quantity}</span>
            <button class="quantity-btn plus" data-id="${item.id}">+</button>
          </div>
          <button class="remove-item" data-id="${item.id}">Удалить</button>
        </div>
      `;

      cartItemsList.appendChild(cartItemElement);
    });

    itemsCountElement.textContent = totalItems;
    totalPriceElement.textContent = `${totalPrice} руб`;
    checkoutBtn.disabled = false;
  }

  function updateCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCartItems();
    updateCartHeader();
  }

  function updateCartHeader() {
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    document.querySelector(".cart p").textContent = `${total} руб`;
    document.querySelector(".cart-badge").textContent = itemCount;
  }

  // Обработчики событий
  cartItemsList.addEventListener("click", function (e) {
    const target = e.target;
    const id = target.getAttribute("data-id");

    if (target.classList.contains("plus")) {
      const item = cart.find((item) => item.id === id);
      if (item) item.quantity += 1;
      updateCart();
    }

    if (target.classList.contains("minus")) {
      const item = cart.find((item) => item.id === id);
      if (item) {
        item.quantity -= 1;
        if (item.quantity <= 0) {
          cart.splice(cart.indexOf(item), 1);
        }
      }
      updateCart();
    }

    if (target.classList.contains("remove-item")) {
      const index = cart.findIndex((item) => item.id === id);
      if (index !== -1) cart.splice(index, 1);
      updateCart();
    }
  });

  checkoutBtn.addEventListener("click", function () {
    if (cart.length > 0) {
      // Здесь можно добавить логику оформления заказа
      alert("Заказ оформлен!");
      localStorage.removeItem("cart");
      window.location.href = "index.html";
    }
  });

  // Инициализация
  renderCartItems();
  updateCartHeader();
});
