// ==========================================
// NOWPAD - CARRITO + CHECKOUT + EMAILJS
// ==========================================

// ==========================================
// CONFIGURACIÓN WHATSAPP
// ==========================================

const WHATSAPP_NUMBER = "573213599499";

// ==========================================
// CARGAR CARRITO
// ==========================================

let cart = [];

try {

    cart = JSON.parse(
        localStorage.getItem("nowpadCart")
    ) || [];

} catch (error) {

    cart = [];

}


let selectedProduct = null;
let selectedSize = null;


// ==========================================
// GUARDAR CARRITO
// ==========================================

function saveCart() {

    localStorage.setItem(
        "nowpadCart",
        JSON.stringify(cart)
    );

}


// ==========================================
// ABRIR PRODUCTO
// ==========================================

function openProduct(
    nombre,
    precio,
    color,
    descripcion,
    imagen
) {

    selectedProduct = {

        nombre: nombre,
        precio: precio,
        color: color,
        descripcion: descripcion,
        imagen: imagen

    };

    selectedSize = null;


    const image =
        document.getElementById("detail-image");

    const name =
        document.getElementById("detail-name");

    const price =
        document.getElementById("detail-price");

    const description =
        document.getElementById("detail-description");

    const colorElement =
        document.getElementById("detail-color");

    const modal =
        document.getElementById("product-modal");


    if (image) {

        image.src = imagen;

    }


    if (name) {

        name.textContent = nombre;

    }


    if (price) {

        price.textContent =
            "$" + precio.toLocaleString("es-CO");

    }


    if (description) {

        description.textContent =
            descripcion;

    }


    if (colorElement) {

        colorElement.textContent =
            "Color: " + color;

    }


    document
        .querySelectorAll(".sizes button")
        .forEach(button => {

            button.classList.remove("selected");

        });


    if (modal) {

        modal.classList.add("active");

    }

}


// ==========================================
// CERRAR PRODUCTO
// ==========================================

function closeProduct() {

    const modal =
        document.getElementById("product-modal");


    if (modal) {

        modal.classList.remove("active");

    }


    selectedProduct = null;
    selectedSize = null;

}


// ==========================================
// SELECCIONAR TALLA
// ==========================================

function selectSize(button) {

    document
        .querySelectorAll(".sizes button")
        .forEach(btn => {

            btn.classList.remove("selected");

        });


    button.classList.add("selected");

    selectedSize =
        button.textContent.trim();

}


// ==========================================
// AGREGAR AL CARRITO
// ==========================================

function addSelectedProduct() {

    if (!selectedProduct) {

        return;

    }


    if (!selectedSize) {

        alert(
            "Por favor selecciona una talla."
        );

        return;

    }


    const existingProduct =
        cart.find(item =>

            item.nombre === selectedProduct.nombre &&
            item.talla === selectedSize

        );


    if (existingProduct) {

        existingProduct.cantidad++;

    } else {

        cart.push({

            nombre:
                selectedProduct.nombre,

            precio:
                selectedProduct.precio,

            color:
                selectedProduct.color,

            talla:
                selectedSize,

            imagen:
                selectedProduct.imagen,

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

    const cartElement =
        document.getElementById("cart");


    if (cartElement) {

        cartElement.classList.add("active");

    }


    updateCartUI();

}


// ==========================================
// CERRAR CARRITO
// ==========================================

function closeCart() {

    const cartElement =
        document.getElementById("cart");


    if (cartElement) {

        cartElement.classList.remove("active");

    }

}


// ==========================================
// AUMENTAR CANTIDAD
// ==========================================

function increaseQuantity(index) {

    if (!cart[index]) {

        return;

    }


    cart[index].cantidad++;

    saveCart();

    updateCartUI();

}


// ==========================================
// DISMINUIR CANTIDAD
// ==========================================

function decreaseQuantity(index) {

    if (!cart[index]) {

        return;

    }


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

    if (!cart[index]) {

        return;

    }


    cart.splice(index, 1);

    saveCart();

    updateCartUI();

}


// ==========================================
// ACTUALIZAR CARRITO
// ==========================================

function updateCartUI() {

    const cartItems =
        document.getElementById("cart-items");

    const cartTotal =
        document.getElementById("cart-total");

    const cartCount =
        document.getElementById("cart-count");


    let total = 0;

    let quantityTotal = 0;


    cart.forEach(item => {

        total +=
            item.precio * item.cantidad;

        quantityTotal +=
            item.cantidad;

    });


    if (cartCount) {

        cartCount.textContent =
            quantityTotal;

    }


    if (cartTotal) {

        cartTotal.textContent =
            "$" + total.toLocaleString("es-CO");

    }


    if (!cartItems) {

        return;

    }


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <p>
                    Tu carrito está vacío.
                </p>

            </div>

        `;

        return;

    }


    cartItems.innerHTML =

        cart.map((item, index) => {

            const subtotal =
                item.precio * item.cantidad;


            return `

                <div class="cart-item">

                    <img
                        src="${item.imagen}"
                        alt="${item.nombre}"
                    >


                    <div class="cart-item-info">

                        <h3>
                            ${item.nombre}
                        </h3>


                        <p>
                            Talla: ${item.talla}
                        </p>


                        <p>
                            Color: ${item.color}
                        </p>


                        <strong>
                            $${subtotal.toLocaleString("es-CO")}
                        </strong>


                        <div class="quantity">

                            <button
                                onclick="decreaseQuantity(${index})"
                            >
                                −
                            </button>


                            <span>
                                ${item.cantidad}
                            </span>


                            <button
                                onclick="increaseQuantity(${index})"
                            >
                                +
                            </button>

                        </div>


                        <button
                            class="remove-product"
                            onclick="removeFromCart(${index})"
                        >
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

        alert(
            "Tu carrito está vacío."
        );

        return;

    }


    // IMPORTANTE:
    // Ya NO mandamos a checkout.html


    const cartElement =
        document.getElementById("cart");


    const checkoutElement =
        document.getElementById("checkout-modal");


    if (cartElement) {

        cartElement.classList.remove("active");

    }


    if (checkoutElement) {

        checkoutElement.classList.add("active");

    }


    updateCheckoutSummary();

}


// ==========================================
// CERRAR CHECKOUT
// ==========================================

function closeCheckout() {

    const checkoutElement =
        document.getElementById("checkout-modal");


    if (checkoutElement) {

        checkoutElement.classList.remove("active");

    }

}


// ==========================================
// RESUMEN DEL CHECKOUT
// ==========================================

function updateCheckoutSummary() {

    const summary =
        document.getElementById("checkout-summary");


    if (!summary) {

        return;

    }


    if (cart.length === 0) {

        summary.innerHTML = `

            <p>
                Tu carrito está vacío.
            </p>

        `;

        return;

    }


    let total = 0;


    summary.innerHTML =

        cart.map(item => {

            const subtotal =
                item.precio * item.cantidad;


            total += subtotal;


            return `

                <div class="checkout-item">

                    <img
                        src="${item.imagen}"
                        alt="${item.nombre}"
                    >


                    <div>

                        <strong>
                            ${item.nombre}
                        </strong>


                        <p>
                            Talla: ${item.talla}
                        </p>


                        <p>
                            Color: ${item.color}
                        </p>


                        <p>
                            Cantidad: ${item.cantidad}
                        </p>

                    </div>


                    <strong>
                        $${subtotal.toLocaleString("es-CO")}
                    </strong>

                </div>

            `;

        }).join("") +

        `

        <div class="checkout-total">

            <span>
                TOTAL
            </span>


            <strong>
                $${total.toLocaleString("es-CO")}
            </strong>

        </div>

        `;

}


// ==========================================
// CALCULAR TOTAL
// ==========================================

function calculateCartTotal() {

    return cart.reduce(
        (total, item) => {

            return total +
                (item.precio * item.cantidad);

        },
        0
    );

}


// ==========================================
// PRODUCTOS PARA EL CORREO
// ==========================================

function createOrderProductsText() {

    return cart.map(item => {

        const subtotal =
            item.precio * item.cantidad;


        return `

${item.nombre}
Talla: ${item.talla}
Color: ${item.color}
Cantidad: ${item.cantidad}
Precio: $${item.precio.toLocaleString("es-CO")}
Subtotal: $${subtotal.toLocaleString("es-CO")}

        `;

    }).join(
        "\n--------------------\n"
    );

}


// ==========================================
// NÚMERO DE PEDIDO
// ==========================================

function generateOrderNumber() {

    const number =
        Date.now()
            .toString()
            .slice(-6);


    return "NOW-" + number;

}

// ==========================================
// ENVIAR PEDIDO POR WHATSAPP
// ==========================================

function sendOrderWhatsApp(customerData) {

    const orderNumber = generateOrderNumber();

    const total = calculateCartTotal();

    let products = "";

    cart.forEach((item, index) => {

        const subtotal =
            item.precio * item.cantidad;

        products +=
            `${index + 1}. ${item.nombre}\n` +
            `   Talla: ${item.talla}\n` +
            `   Color: ${item.color}\n` +
            `   Cantidad: ${item.cantidad}\n` +
            `   Precio: $${item.precio.toLocaleString("es-CO")}\n` +
            `   Subtotal: $${subtotal.toLocaleString("es-CO")}\n\n`;

    });


    const message =

        `🛒 *NUEVO PEDIDO NOWPAD*\n\n` +

        `📋 *Número de pedido:* ${orderNumber}\n\n` +

        `👤 *CLIENTE*\n` +
        `Nombre: ${customerData.name}\n` +
        `Teléfono: ${customerData.phone}\n\n` +

        `📍 *ENVÍO*\n` +
        `Dirección: ${customerData.address}\n` +
        `Ciudad: ${customerData.city}\n\n` +

        `💳 *MÉTODO DE PAGO*\n` +
        `${customerData.payment}\n\n` +

        `👕 *PRODUCTOS*\n` +
        `${products}` +

        `💰 *TOTAL: $${total.toLocaleString("es-CO")}*\n\n` +

        `━━━━━━━━━━━━━━━━━━\n` +
        `NOWPAD\n` +
        `NOW PEOPLE ARE DIFFERENT.`;


    const whatsappURL =
        "https://wa.me/" +
        WHATSAPP_NUMBER +
        "?text=" +
        encodeURIComponent(message);


    window.open(
        whatsappURL,
        "_blank"
    );


    return orderNumber;

}


// ==========================================
// FORMULARIO CHECKOUT
// ==========================================

function initCheckoutForm() {

    const form =
        document.getElementById(
            "checkout-form"
        );


    if (!form) {

        return;

    }


    form.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            // ==============================
            // DATOS
            // ==============================

            const name =
                document.getElementById(
                    "customer-name"
                ).value.trim();


            const phone =
                document.getElementById(
                    "customer-phone"
                ).value.trim();


            const address =
                document.getElementById(
                    "customer-address"
                ).value.trim();


            const city =
                document.getElementById(
                    "customer-city"
                ).value.trim();


            const payment =
                document.getElementById(
                    "payment-method"
                ).value;


            // ==============================
            // VALIDAR
            // ==============================

            if (cart.length === 0) {

                alert(
                    "Tu carrito está vacío."
                );

                return;

            }


            if (!name) {

                alert(
                    "Escribe tu nombre completo."
                );

                return;

            }


            if (!phone) {

                alert(
                    "Escribe tu teléfono."
                );

                return;

            }


            if (!address) {

                alert(
                    "Escribe la dirección de envío."
                );

                return;

            }


            if (!city) {

                alert(
                    "Escribe la ciudad."
                );

                return;

            }


            if (!payment) {

                alert(
                    "Selecciona un método de pago."
                );

                return;

            }


            // ==============================
            // BOTÓN
            // ==============================

            const button =
                form.querySelector(
                    "button[type='submit']"
                );


            const originalText =
                button
                    ? button.textContent
                    : "CONFIRMAR PEDIDO →";


            if (button) {

                button.disabled = true;

                button.textContent =
                    "ENVIANDO PEDIDO...";

            }


            // ==============================
            // DATOS DEL PEDIDO
            // ==============================

            const customerData = {

                name:
                    name,

                phone:
                    phone,

                address:
                    address,

                city:
                    city,

                payment:
                    payment,

                email:
                    ""

            };


            try {

                // ==========================
                // ENVIAR EMAIL
                // ==========================
const orderNumber =
    sendOrderWhatsApp(
        customerData
    );

                // ==========================
                // GUARDAR ÚLTIMO PEDIDO
                // ==========================

                localStorage.setItem(
                    "nowpadLastOrder",

                    JSON.stringify({

                        orderNumber:
                            orderNumber,

                        customer:
                            customerData,

                        products:
                            cart,

                        total:
                            calculateCartTotal(),

                        date:
                            new Date().toLocaleString(
                                "es-CO"
                            )

                    })
                );


                // ==========================
                // MOSTRAR ÉXITO
                // ==========================

                const checkoutBox =
                    document.querySelector(
                        ".checkout-box"
                    );


                if (checkoutBox) {

                    checkoutBox.innerHTML = `

                        <button
                            class="close-checkout"
                            onclick="closeCheckout()"
                        >
                            ×
                        </button>


                        <p class="section-tag">
                            NOWPAD / PEDIDO
                        </p>


                        <h2>
                            ¡PEDIDO<br>
                            <span>REALIZADO!</span>
                        </h2>


                        <div
                            style="
                                text-align:center;
                                margin:30px 0;
                            "
                        >

                            <div
                                style="
                                    font-size:60px;
                                    margin-bottom:20px;
                                "
                            >
                                ✓
                            </div>


                            <p>
                                Gracias por tu compra,
                                <strong>${name}</strong>.
                            </p>


                            <p>
                                Hemos recibido correctamente
                                tu pedido.
                            </p>


                            <p
                                style="
                                    margin-top:20px;
                                    font-weight:700;
                                "
                            >
                                Número de pedido:
                            </p>


                            <h3>
                                ${orderNumber}
                            </h3>


                            <p
                                style="
                                    margin-top:20px;
                                "
                            >
                                Te contactaremos para
                                confirmar los detalles
                                de tu pedido.
                            </p>

                        </div>


                        <button
                            type="button"
                            onclick="closeCheckout()"
                        >
                            VOLVER A LA TIENDA →
                        </button>

                    `;

                }


                // ==========================
                // VACIAR CARRITO
                // ==========================

                cart = [];

                localStorage.removeItem(
                    "nowpadCart"
                );


                updateCartUI();


            } catch (error) {

                console.error(
                    "Error al enviar pedido:",
                    error
                );


                alert(
                    "No se pudo enviar el pedido por correo. " +
                    "Revisa la configuración de EmailJS."
                );


                if (button) {

                    button.disabled = false;

                    button.textContent =
                        originalText;

                }

            }

        }
    );

}


// ==========================================
// FORMULARIO DE CONTACTO
// ==========================================

function initContactForm() {

    const contactForm =
        document.getElementById(
            "contact-form"
        );


    if (!contactForm) {

        return;

    }


    contactForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            alert(
                "¡Gracias por contactarnos! " +
                "Nos pondremos en contacto contigo."
            );


            contactForm.reset();

        }
    );

}


// ==========================================
// MENÚ MOBILE
// ==========================================

function toggleMenu() {

    const nav =
        document.getElementById("nav");


    if (nav) {

        nav.classList.toggle(
            "active"
        );

    }

}


// ==========================================
// INICIAR
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateCartUI();

        initCheckoutForm();

        initContactForm();

    }
);