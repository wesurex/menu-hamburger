//const elements

const menu = document.querySelector('#menu'),
    cartBtn = document.querySelector('#cart-btn'),
    cartModal = document.querySelector('#cart-modal'),
    cartItensContainer = document.querySelector('#cart-items'),
    cartTotal = document.querySelector('#cart-total'),
    checkoutBtn = document.querySelector('#checkout-btn'),
    closeModalBtn = document.querySelector('#close-modal-btn'),
    cartCounter = document.querySelector('#cart-count'),
    addressInput = document.querySelector('#address'),
    addressWarn = document.querySelector('#address-warn'),
    spanItem = document.querySelector('#date-span');

let cart = [];
//open modal of cart

cartBtn.addEventListener('click', () => {
    updateCartModal();
    cartModal.classList.remove('hidden');
    cartModal.classList.add('flex');
});

//close modal when click outside or button "fechar"

cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.classList.remove('flex');
        cartModal.classList.add('hidden');
    }
})

closeModalBtn.addEventListener('click', () => {
    cartModal.classList.remove('flex');
    cartModal.classList.add('hidden');
})

menu.addEventListener('click', (e) => {
    let parentButton = e.target.closest('.add-to-cart-btn')

    if (parentButton) {
        const name = parentButton.getAttribute('data-name'),
            price = parseFloat(parentButton.getAttribute('data-price'));
        addToCart(name, price);
    }
})

//function for add to cart

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name)

    if (existingItem) {
        //If the item already exists, increase the quantity by 1
        existingItem.quantity += 1;
    } else {

        cart.push({
            name,
            price,
            quantity: 1,
        })

    }
    Toastify({
        text: "Item adicionado no carrinho!",
        duration: 3000,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#22c55e",
        },
    }).showToast();
    updateCartModal()
}

// att is cart

function updateCartModal() {
    cartItensContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add('flex', 'justify-between', 'mb-4', 'flex-col');

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium pb-1">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>

                <button class="remove-from-cart-btn" data-name="${item.name}">
                Remover
                </button>
            
        </div>
        `

        total += item.price * item.quantity;

        cartItensContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR",{
        style: "currency",
        currency: "BRL"
    })

    cartCounter.innerHTML = cart.length
}

//function to remove item from cart
cartItensContainer.addEventListener('click', (e) =>{
    if(e.target.classList.contains("remove-from-cart-btn")){
        const name = e.target.getAttribute("data-name");
        
        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];
        
        if(item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

addressInput.addEventListener('input', (e) => {
    let inputValue = e.target.value;

    if(inputValue !== ''){
        addressInput.classList.remove('border-red-500');
        addressWarn.classList.add('hidden');
    }
})

//Finalize order

checkoutBtn.addEventListener('click', () => {
    const isOpen = checkRestaurantOpen();

    if(!isOpen){
        Toastify({
            text: "Ops o restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
        }).showToast();

        return;
    }

    if(cart.length === 0) return;

    if(addressInput.value === ''){
        addressWarn.classList.remove("hidden");
        addressInput.classList.add('border-red-500');
        return;
    }

    //Send to WhatsApp API

    const cartItems = cart.map((item) => {
        return (
            `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |
            `
        )
    }).join("")

    const message = encodeURIComponent(cartItems),
        phone = '';

        window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

        cart = [];
        addressInput.value = "";
        updateCartModal();
})


//Check the time and manipulate the time card

function checkRestaurantOpen(){
 const date = new Date(),
    hours = date.getHours();
    
        return hours >= 18 && hours < 22;
}

const isOpen = checkRestaurantOpen();

if (isOpen){
    spanItem.classList.remove('bg-red-500');
    spanItem.classList.add('bg-green-600');
}else{
    spanItem.classList.remove('bg-green-600');
    spanItem.classList.add('bg-red-500');
}