
// ==========================================
// NOWPAD - CARRITO + CHECKOUT + WHATSAPP
// ==========================================

const WHATSAPP_NUMBER = "573213599499";

// ==========================================
// CARGAR CARRITO
// ==========================================

let cart = [];

try {
    cart = JSON.parse(localStorage.getItem("nowpadCart")) || [];
    if (!Array.isArray(cart)) cart = [];
} catch (error) {
    cart = [];
}

let selectedProduct = null;
let selectedSize = null;

// ==========================================
// GUARDAR CARRITO
// ==========================================

function saveCart() {
    localStorage.setItem("nowpadCart", JSON.stringify(cart));
}

// ==========================================
// ABRIR PRODUCTO
// ==========================================

function openProduct(nombre, precio, color, descripcion, imagen) {
    selectedProduct = { nombre, precio, color, descripcion, imagen };
    selectedSize = null;

    const image = document.getElementById("detail-image");
    const name = document.getElementById("detail-name");
    const price = document.getElementById("detail-price");
    const description = document.getElementById("detail-description");
    const colorElement = document.getElementById("detail-color");
    const modal = document.getElementById("product-modal");

    if (image) image.src = imagen;
    if (name) name.textContent = nombre;
    if (price) price.textContent = "$" + Number(precio).toLocaleString("es-CO");
    if (description) description.textContent = descripcion;
    if (colorElement) colorElement.textContent = "Color: " + color;

    document.querySelectorAll(".sizes button").forEach(button => {
        button.classList.remove("selected");
    });

    if (modal) modal.classList.add("active");
}

// ==========================================
// CERRAR PRODUCTO
// ==========================================

function closeProduct() {
    const modal = document.getElementById("product-modal");
    if (modal) modal.classList.remove("active");

    selectedProduct = null;
    selectedSize = null;
}

// ==========================================
// SELECCIONAR TALLA
// ==========================================

function selectSize(button) {
    document.querySelectorAll(".sizes button").forEach(btn => {
        btn.classList.remove("selected");
    });

    button.classList.add("selected");
    selectedSize = button.textContent.trim();
}

// ==========================================
// AGREGAR AL CARRITO
// ==========================================

function addSelectedProduct() {
    if (!selectedProduct) return;

    if (!selectedSize) {
        alert("Por favor selecciona una talla.");
        return;
    }

    const existingProduct = cart.find(item =>
        item.nombre === selectedProduct.nombre &&
        item.talla === selectedSize
    );

    if (existingProduct) {
        existingProduct.cantidad++;
    } else {
        cart.push({
            nombre: selectedProduct.nombre,
            precio: Number(selectedProduct.precio),
            color: selectedProduct.color,
            talla: selectedSize,
            imagen: selectedProduct.imagen,
            cantidad: 1
        });
    }

    saveCart();
    updateCartUI();
    closeProduct();
    openCart();
}

// ==========================================
// ABRIR CARRITO
// ==========================================

function openCart() {
    const cartElement = document.getElementById("cart");
    if (cartElement) cartElement.classList.add("active");
    updateCartUI();
}

// ==========================================
// CERRAR CARRITO
// ==========================================

function closeCart() {
    const cartElement = document.getElementById("cart");
    if (cartElement) cartElement.classList.remove("active");
}

// ==========================================
// AUMENTAR CANTIDAD
// ==========================================

function increaseQuantity(index) {
    if (!cart[index]) return;

    cart[index].cantidad++;
    saveCart();
    updateCartUI();
}

// ==========================================
// DISMINUIR CANTIDAD
// ==========================================

function decreaseQuantity(index) {
    if (!cart[index]) return;

    if (cart[index].cantidad > 1) {
        cart[index].cantidad--;
    } else {
        cart.splice(index, 1);
    }

    saveCart();
    updateCartUI();
}

// ==========================================
// ELIMINAR PRODUCTO
// ==========================================

function removeFromCart(index) {
    if (!cart[index]) return;

    cart.splice(index, 1);
    saveCart();
    updateCartUI();
}

// ==========================================
// ACTUALIZAR CARRITO
// ==========================================

function updateCartUI() {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const cartCount = document.getElementById("cart-count");

    let total = 0;
    let quantityTotal = 0;

    cart.forEach(item => {
        total += Number(item.precio) * Number(item.cantidad);
        quantityTotal += Number(item.cantidad);
    });

    if (cartCount) cartCount.textContent = quantityTotal;
    if (cartTotal) cartTotal.textContent = "$" + total.toLocaleString("es-CO");
    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <p>Tu carrito está vacío.</p>
            </div>
        `;
        return;
    }

    cartItems.innerHTML = cart.map((item, index) => {
        const subtotal = Number(item.precio) * Number(item.cantidad);

        return `
            <div class="cart-item">
                <img src="${item.imagen}" alt="${item.nombre}">
                <div class="cart-item-info">
                    <h3>${item.nombre}</h3>
                    <p>Talla: ${item.talla}</p>
                    <p>Color: ${item.color}</p>
                    <strong>$${subtotal.toLocaleString("es-CO")}</strong>

                    <div class="quantity">
                        <button type="button" onclick="decreaseQuantity(${index})">−</button>
                        <span>${item.cantidad}</span>
                        <button type="button" onclick="increaseQuantity(${index})">+</button>
                    </div>

                    <button type="button" class="remove-product"
                        onclick="removeFromCart(${index})">
                        ELIMINAR
                    </button>
                </div>
            </div>
        `;
    }).join("");
}

// ==========================================
// FINALIZAR COMPRA
// ==========================================

function openCheckout() {
    if (cart.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    const cartElement = document.getElementById("cart");
    const checkoutElement = document.getElementById("checkout-modal");

    if (cartElement) cartElement.classList.remove("active");
    if (checkoutElement) checkoutElement.classList.add("active");

    updateCheckoutSummary();
}

// ==========================================
// CERRAR CHECKOUT
// ==========================================

function closeCheckout() {
    const checkoutElement = document.getElementById("checkout-modal");
    if (checkoutElement) checkoutElement.classList.remove("active");
}

// ==========================================
// RESUMEN DEL CHECKOUT
// ==========================================

function updateCheckoutSummary() {
    const summary = document.getElementById("checkout-summary");
    if (!summary) return;

    if (cart.length === 0) {
        summary.innerHTML = "<p>Tu carrito está vacío.</p>";
        return;
    }

    let total = 0;

    summary.innerHTML = cart.map(item => {
        const subtotal = Number(item.precio) * Number(item.cantidad);
        total += subtotal;

        return `
            <div class="checkout-item">
                <img src="${item.imagen}" alt="${item.nombre}">
                <div>
                    <strong>${item.nombre}</strong>
                    <p>Talla: ${item.talla}</p>
                    <p>Color: ${item.color}</p>
                    <p>Cantidad: ${item.cantidad}</p>
                </div>
                <strong>$${subtotal.toLocaleString("es-CO")}</strong>
            </div>
        `;
    }).join("") + `
        <div class="checkout-total">
            <span>TOTAL</span>
            <strong>$${total.toLocaleString("es-CO")}</strong>
        </div>
    `;
}

// ==========================================
// CALCULAR TOTAL
// ==========================================

function calculateCartTotal() {
    return cart.reduce((total, item) => {
        return total + Number(item.precio) * Number(item.cantidad);
    }, 0);
}

// ==========================================
// NÚMERO DE PEDIDO
// ==========================================

function generateOrderNumber() {
    return "NOW-" + Date.now().toString().slice(-6);
}

// ==========================================
// ENVIAR PEDIDO POR WHATSAPP
// ==========================================

function sendOrderWhatsApp(customerData) {
    const orderNumber = generateOrderNumber();
    const total = calculateCartTotal();

    let products = "";

    cart.forEach((item, index) => {
        const subtotal = Number(item.precio) * Number(item.cantidad);

        products +=
            `${index + 1}. ${item.nombre}\n` +
            `Talla: ${item.talla}\n` +
            `Color: ${item.color}\n` +
            `Cantidad: ${item.cantidad}\n` +
            `Precio: $${Number(item.precio).toLocaleString("es-CO")}\n` +
            `Subtotal: $${subtotal.toLocaleString("es-CO")}\n\n`;
    });

    const message =
        `🛒 *NUEVO PEDIDO NOWPAD*\n\n` +
        `Número de pedido: ${orderNumber}\n\n` +
        `CLIENTE\n` +
        `Nombre: ${customerData.name}\n` +
        `Teléfono: ${customerData.phone}\n\n` +
        `ENVÍO\n` +
        `Dirección: ${customerData.address}\n` +
        `Ciudad: ${customerData.city}\n\n` +
        `MÉTODO DE PAGO\n${customerData.payment}\n\n` +
        `PRODUCTOS\n${products}` +
        `TOTAL: $${total.toLocaleString("es-CO")}\n\n` +
        `NOWPAD - NOW PEOPLE ARE DIFFERENT.`;

    const whatsappURL =
        "https://wa.me/" + WHATSAPP_NUMBER +
        "?text=" + encodeURIComponent(message);

    window.open(whatsappURL, "_blank");
    return orderNumber;
}

// ==========================================
// FORMULARIO CHECKOUT
// ==========================================

function initCheckoutForm() {
    const form = document.getElementById("checkout-form");
    if (!form) return;

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const name = document.getElementById("customer-name").value.trim();
        const phone = document.getElementById("customer-phone").value.trim();
        const address = document.getElementById("customer-address").value.trim();
        const city = document.getElementById("customer-city").value.trim();
        const payment = document.getElementById("payment-method").value;

        if (cart.length === 0) {
            alert("Tu carrito está vacío.");
            return;
        }

        if (!name || !phone || !address || !city || !payment) {
            alert("Por favor, completa todos los campos del pedido.");
            return;
        }

        const customerData = { name, phone, address, city, payment };

        const orderNumber = sendOrderWhatsApp(customerData);

        localStorage.setItem("nowpadLastOrder", JSON.stringify({
            orderNumber,
            customer: customerData,
            products: cart,
            total: calculateCartTotal(),
            date: new Date().toLocaleString("es-CO")
        }));

        alert(
            "Tu pedido está preparado en WhatsApp. " +
            "Pulsa Enviar allí para confirmar el pedido."
        );

        cart = [];
        localStorage.removeItem("nowpadCart");
        updateCartUI();
        closeCheckout();
    });
}

// ==========================================
// FORMULARIO DE CONTACTO - WHATSAPP
// ==========================================

function initContactForm() {
    const contactForm = document.getElementById("contact-form");
    if (!contactForm) return;

    contactForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const name = contactForm.querySelector('input[type="text"]').value.trim();
        const email = contactForm.querySelector('input[type="email"]').value.trim();
        const message = contactForm.querySelector("textarea").value.trim();

        if (!name || !email || !message) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        const whatsappMessage =
            "HOLA, NOWPAD. 🖤\n\n" +
            "Quiero ponerme en contacto con ustedes.\n\n" +
            "NOMBRE: " + name + "\n" +
            "CORREO: " + email + "\n\n" +
            "MENSAJE:\n" + message + "\n\n" +
            "NOW PEOPLE ARE DIFFERENT.";

        const whatsappURL =
            "https://wa.me/" + WHATSAPP_NUMBER +
            "?text=" + encodeURIComponent(whatsappMessage);

        const newWindow = window.open(whatsappURL, "_blank");

        if (newWindow) {
            alert(
                "WhatsApp se abrió con tu mensaje preparado. " +
                "Pulsa Enviar en WhatsApp para hacérnoslo llegar."
            );
        } else {
            window.location.href = whatsappURL;
        }
    });
}

// ==========================================
// MENÚ MOBILE
// ==========================================

function toggleMenu() {
    const nav = document.getElementById("nav");
    if (nav) nav.classList.toggle("active");
}

// ==========================================
// INICIAR
// ==========================================

document.addEventListener("DOMContentLoaded", function() {
    updateCartUI();
    initCheckoutForm();
    initContactForm();
});
