document.addEventListener("DOMContentLoaded", () => {
  const btnConcluir = document.getElementById("btnConfirmOrder");
  const btnNewOrder = document.getElementById("btnNewOrder");
  const listaCarrinho = document.getElementById("listaCarrinho");
  const empty = document.getElementById("empty");
  const pedidos = document.getElementById("pedidos");
  const compra = document.getElementById("compra");
  const carrinhoH3 = document.querySelector("#carrinho h3");
  const buyContent = document.getElementById("content");
  const priceContent = document.getElementById("totalPriceContent");
  let cartItems = [];
  let total = 0;

  // Fetch menu items and create menu
  fetch("data.json")
    .then((response) => response.json())
    .then((menuItems) => {
      createMenu(menuItems);
      setupEventListeners();
    });

  function createMenu(items) {
    const menuContainer = document.getElementById("restaurante");

    items.forEach((item) => {
      const comidaDiv = document.createElement("div");
      comidaDiv.classList.add("comidas");
      comidaDiv.innerHTML = `
              <picture>
                <source media="(max-width: 700px)" srcset="${
                  item.image.mobile
                }" type="image/png" />
                <img src="${item.image.desktop}" alt="${
        item.name
      }" class="imgFood" />
              </picture>
              <div class="btn">
                <button class="btnAddCart" data-name="${
                  item.name
                }" data-price="${item.price}" data-image="${
        item.image.thumbnail
      }">
                  <img src="assets/images/icon-add-to-cart.svg" alt="add-cart" class="add" />Add to Cart
                </button>
              </div>
              <p>${item.category}</p>
              <h2>${item.name}</h2>
              <h3>$${item.price.toFixed(2)}</h3>
            `;
      menuContainer.appendChild(comidaDiv);
    });
  }

  function setupEventListeners() {
    document.querySelectorAll(".btnAddCart").forEach((button) => {
      button.addEventListener("click", () => {
        const name = button.getAttribute("data-name");
        const price = parseFloat(button.getAttribute("data-price"));
        const image = button.getAttribute("data-image");

        addItemToCart(name, price, image);

        // Remove qualquer conteúdo adicional existente no botão
        const existingBtnContent = button.querySelector(".btn-content");
        if (existingBtnContent) {
          existingBtnContent.remove();
        }

        // Limpa o conteúdo anterior do botão e adiciona o estilo e conteúdo novo
        button.innerHTML = ``;
        button.classList.add("btn-active");

        // Adiciona o novo conteúdo adicional
        const btnContent = document.createElement("div");
        btnContent.classList.add("btn-content");
        btnContent.innerHTML = `
          <img src="assets/images/icon-decrement-quantity.svg" alt="decrement" class="btn-icon" id="icon-decrement" />
          <span class="btn-number">1</span>
          <img src="assets/images/icon-increment-quantity.svg" alt="increment" class="btn-icon" id="icon-increment" />
        `;
        button.appendChild(btnContent);

        // Desabilita o botão de adicionar
        button.disabled = true;

        setupQuantityButtons(button);

        updateCartVisibility();
      });
    });

    btnConcluir.addEventListener("click", () => {
      compra.style.display = "flex";
      displayCartItemsInBuy();
    });

    btnNewOrder.addEventListener("click", () => {
      resetCart();
      updateCartVisibility();
      compra.style.display = "none";
    });

    // Event delegation for remove button
    document.addEventListener("click", (event) => {
      if (event.target && event.target.id === "btnTirar") {
        const itemName = event.target.getAttribute("data-name");
        removeItemFromCart(itemName);
        updateCartVisibility();
      }
    });
  }

  function setupQuantityButtons(button) {
    const incrementBtn = button.querySelector("#icon-increment");
    const decrementBtn = button.querySelector("#icon-decrement");
    const quantitySpan = button.querySelector(".btn-number");

    incrementBtn.addEventListener("click", () => {
      const name = button.getAttribute("data-name");
      const item = cartItems.find((item) => item.name === name);

      if (item) {
        item.quantity += 1;
        quantitySpan.textContent = item.quantity;
        renderCartItems();
        updateCartItemCount();
      }
    });

    decrementBtn.addEventListener("click", () => {
      const name = button.getAttribute("data-name");
      const item = cartItems.find((item) => item.name === name);

      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
          quantitySpan.textContent = item.quantity;
          renderCartItems();
          updateCartItemCount();
        } else {
          // Remove item from cart if quantity is 1 and decrement button is clicked
          removeItemFromCart(name);
          button.innerHTML = `
            <img src="assets/images/icon-add-to-cart.svg" alt="add-cart" class="add" />Add to Cart
          `;
          button.classList.remove("btn-active");
          button.disabled = false;
          listaCarrinho.style.display = "none";
          empty.style.display = "flex";
          btnConcluir.style.display = "none";
        }
      }
    });
  }

  function addItemToCart(name, price, image) {
    const existingItem = cartItems.find((item) => item.name === name);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.push({ name, price, image, quantity: 1 });
    }

    renderCartItems();
  }

  function removeItemFromCart(name) {
    cartItems = cartItems.filter((item) => item.name !== name);

    renderCartItems();
    updateCartVisibility();

    const addButton = Array.from(document.querySelectorAll(".btnAddCart")).find(
      (button) => button.getAttribute("data-name") === name
    );

    if (addButton) {
      addButton.disabled = false;
      const existingBtnContent = addButton.querySelector(".btn-content");
      if (existingBtnContent) {
        existingBtnContent.remove();
      }
      addButton.innerHTML = `
        <img src="assets/images/icon-add-to-cart.svg" alt="add-cart" class="add" />Add to Cart
      `;
      addButton.classList.remove("btn-active");
    }
  }

  function resetCart() {
    // Limpa o carrinho
    cartItems = [];
    total = 0;
    pedidos.innerHTML = "";
    document.getElementById("preco").textContent = "$0.00";
    carrinhoH3.textContent = "Your Cart (0)";
    listaCarrinho.style.display = "none";
    empty.style.display = "flex";
    btnConcluir.style.display = "none";

    // Reabilita todos os botões de adicionar ao carrinho
    document.querySelectorAll(".btnAddCart").forEach((button) => {
      button.disabled = false;
      button.classList.remove("btn-active");
      const existingBtnContent = button.querySelector(".btn-content");
      if (existingBtnContent) {
        existingBtnContent.remove();
      }
      button.innerHTML = `
        <img src="assets/images/icon-add-to-cart.svg" alt="add-cart" class="add" />Add to Cart
      `;
    });
  }

  function renderCartItems() {
    pedidos.innerHTML = ""; // Limpa os itens existentes

    cartItems.forEach((item) => {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("item");

      itemDiv.innerHTML = `
        <div class="itemDetails">
          <div id="nomePedido">${item.name}</div>
          <div>
            <span id="qntPedido">${item.quantity}x</span>
            <span id="pricePedido">@ $${item.price.toFixed(2)}</span>
            <span id="totalPrice">$${(item.price * item.quantity).toFixed(
              2
            )}</span>
          </div>
        </div>
        <div class="btnContainer">
          <img src="assets/images/icon-remove-item.svg" alt="remove-item" class="btnRemove" id="btnTirar" data-name="${
            item.name
          }" />
        </div>
      `;
      pedidos.appendChild(itemDiv);
    });

    total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    document.getElementById("preco").textContent = `$${total.toFixed(2)}`;

    updateCartItemCount();
  }

  function updateCartItemCount() {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    carrinhoH3.textContent = `Your Cart (${totalItems})`;
  }

  function updateCartVisibility() {
    if (pedidos.children.length > 0) {
      listaCarrinho.style.display = "flex";
      empty.style.display = "none";
      btnConcluir.style.display = "block";
    } else {
      listaCarrinho.style.display = "none";
      empty.style.display = "flex";
      btnConcluir.style.display = "none";
    }
  }

  function displayCartItemsInBuy() {
    buyContent.innerHTML = "";
    let totalBuy = 0;

    cartItems.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      totalBuy += itemTotal;

      const itemDiv = document.createElement("div");
      itemDiv.classList.add("item");

      itemDiv.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="itemImage"/>
        <div class="itemDetails">
          <h2 id="nomeBuy">${item.name}</h2>
          <div class="itemPrice">
            <h3 id="qntBuy">${item.quantity}x</h3>
            <div id="priceBuy">@ $${item.price.toFixed(2)}</div>
          </div>
        </div>
        <div id="totalBuy">$${itemTotal.toFixed(2)}</div>
      `;

      buyContent.appendChild(itemDiv);
    });

    priceContent.innerText = `$${totalBuy.toFixed(2)}`;
  }
});
