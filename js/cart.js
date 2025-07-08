// js/cart.js
class CartSystem {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem("cart")) || [];
    this.init();
  }

  init() {
    // Инициализация для главной страницы
    if (document.querySelector(".box button")) {
      this.setupProductPage();
    }

    // Инициализация для страницы корзины
    if (document.querySelector(".cart-items-list")) {
      this.setupCartPage();
    }

    // Обновляем UI при загрузке
    this.updateUI();
  }

  // Основные методы корзины
  addItem(productId, title, price, image = "images/kitten.jpg") {
    const existingItem = this.cart.find((item) => item.id === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push({
        id: productId,
        title: title,
        price: price,
        image: image,
        quantity: 1,
      });
    }

    this.save();
    this.updateUI();
    this.showNotification(`${title} добавлен в корзину`);
  }

  removeItem(productId) {
    this.cart = this.cart.filter((item) => item.id !== productId);
    this.save();
    this.updateUI();
  }

  updateQuantity(productId, newQuantity) {
    const item = this.cart.find((item) => item.id === productId);
    if (item) {
      if (newQuantity <= 0) {
        this.removeItem(productId);
      } else {
        item.quantity = newQuantity;
      }
    }
    this.save();
    this.updateUI();
  }

  getTotal() {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  getItemCount() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  save() {
    localStorage.setItem("cart", JSON.stringify(this.cart));
  }

  // Обновление интерфейса
  updateUI() {
    // Обновляем шапку на всех страницах
    const total = this.getTotal();
    const count = this.getItemCount();

    document.querySelectorAll(".cart-total").forEach((el) => {
      el.textContent = `${total} руб`;
    });

    document.querySelectorAll(".cart-badge").forEach((el) => {
      el.textContent = count;
    });

    // Обновляем страницу корзины, если она есть
    if (document.querySelector(".cart-items-list")) {
      this.updateCartPage();
    }
  }

  // Уведомления
  showNotification(message) {
    const notification = document.createElement("div");
    notification.className = "cart-notification";
    notification.innerHTML = `<span>✓</span> ${message}`;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("fade-out");
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }

  // Логика для главной страницы
  setupProductPage() {
    document.querySelectorAll(".box button").forEach((button) => {
      button.addEventListener("click", (e) => {
        const productElement = e.target.closest(".box");
        const productId = productElement.getAttribute("data-id");
        const title = productElement.querySelector(".title").textContent;
        const price = parseInt(
          productElement.querySelector(".prise").textContent
        );
        const image = productElement.querySelector("img").src;

        this.addItem(productId, title, price, image);
      });
    });
  }

  // Логика для страницы корзины
  setupCartPage() {
    this.updateCartPage();

    document
      .querySelector(".cart-items-list")
      .addEventListener("click", (e) => {
        const target = e.target;
        const id = target.getAttribute("data-id");

        if (target.classList.contains("plus")) {
          const item = this.cart.find((item) => item.id === id);
          if (item) this.updateQuantity(id, item.quantity + 1);
        }

        if (target.classList.contains("minus")) {
          const item = this.cart.find((item) => item.id === id);
          if (item) this.updateQuantity(id, item.quantity - 1);
        }

        if (target.classList.contains("remove-item")) {
          this.removeItem(id);
        }
      });

    document.querySelector(".checkout-btn")?.addEventListener("click", () => {
      if (this.cart.length > 0) {
        alert("Заказ оформлен!");
        this.cart = [];
        this.save();
        this.updateUI();
        setTimeout(() => (window.location.href = "index.html"), 500);
      }
    });
  }

  updateCartPage() {
    const cartItemsList = document.querySelector(".cart-items-list");
    const cartEmpty = document.querySelector(".cart-empty");
    const itemsCountElement = document.querySelector(".items-count");
    const totalPriceElement = document.querySelector(".total-price");
    const checkoutBtn = document.querySelector(".checkout-btn");

    cartItemsList.innerHTML = "";

    if (this.cart.length === 0) {
      cartEmpty.style.display = "block";
      cartItemsList.style.display = "none";
      if (checkoutBtn) checkoutBtn.disabled = true;
      return;
    }

    cartEmpty.style.display = "none";
    cartItemsList.style.display = "block";

    this.cart.forEach((item) => {
      const cartItemElement = document.createElement("div");
      cartItemElement.className = "cart-item";
      cartItemElement.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="cart-item-img">
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

    if (itemsCountElement) itemsCountElement.textContent = this.getItemCount();
    if (totalPriceElement)
      totalPriceElement.textContent = `${this.getTotal()} руб`;
    if (checkoutBtn) checkoutBtn.disabled = false;
  }
}

// Создаем экземпляр корзины при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  window.cartSystem = new CartSystem();
});
