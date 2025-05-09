// Cart state management
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
let totalSum = JSON.parse(localStorage.getItem('totalSum')) || 0;

// Function to show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.classList.add(
        'fixed',
        'top-4',
        'right-4',
        'px-6',
        'py-3',
        'rounded-lg',
        'shadow-lg',
        'transform',
        'translate-x-full',
        'transition-transform',
        'duration-300',
        'z-50',
        type === 'success' ? 'bg-green-500' : 'bg-red-500',
        'text-white'
    );
    toast.textContent = message;
    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Function to show thank you message
function showThankYouMessage() {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add(
        'fixed',
        'top-1/2',
        'left-1/2',
        'transform',
        '-translate-x-1/2',
        '-translate-y-1/2',
        'bg-gradient-to-r',
        'from-blue-900',
        'to-black',
        'text-white',
        'p-8',
        'rounded-xl',
        'shadow-2xl',
        'border',
        'border-blue-400',
        'z-50',
        'text-center',
        'max-w-md',
        'w-full'
    );

    messageDiv.innerHTML = `
        <i class="fas fa-check-circle text-6xl text-green-400 mb-4"></i>
        <h2 class="text-2xl font-bold mb-4">Thank You for Your Purchase!</h2>
        <p class="text-gray-300 mb-6">Your order has been successfully placed. We'll process it right away.</p>
        <button id="close-thank-you" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            Close
        </button>
    `;

    document.body.appendChild(messageDiv);

    // Add event listener to close button
    document.getElementById('close-thank-you').addEventListener('click', () => {
        document.body.removeChild(messageDiv);
        window.location.href = 'index.html';
    });
}

// Utility function to get price value
function getPriceValue(brand, number) {
    const priceSpan = document.getElementById(`${brand}-${number}`);
    if (!priceSpan) return 0;
    const priceText = priceSpan.innerText;
    const cleanedPrice = priceText.replace('$', '').replace(/,/g, '');
    return parseFloat(cleanedPrice);
}

// Function to save cart state
function saveCartState() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    localStorage.setItem('totalSum', JSON.stringify(totalSum));
}

// Function to create cart item element
function createCartItemElement(item) {
    const div = document.createElement('div');
    div.classList.add(
        'bg-gradient-to-br',
        'from-gray-800',
        'to-blue-900',
        'text-white',
        'p-8',
        'rounded-xl',
        'mb-6',
        'shadow-2xl',
        'border',
        'border-blue-400',
        'transform',
        'hover:scale-[1.02]',
        'transition-all',
        'duration-300'
    );

    div.innerHTML = `
        <div class="flex justify-between items-start">
            <div class="space-y-3">
                <h4 class="text-2xl font-bold text-blue-300">${item.model}</h4>
                <div class="space-y-2">
                    <p class="text-xl font-semibold text-white">Price: <span class="text-green-400">$${item.price.toLocaleString()}</span></p>
                    <p class="text-sm text-gray-300">Transaction ID: <span class="text-blue-300">${item.transactionId}</span></p>
                    <p class="text-sm text-gray-300">Date: <span class="text-blue-300">${item.date}</span></p>
                </div>
            </div>
            <button class="remove-item bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors duration-200" data-id="${item.transactionId}">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;

    return div;
}

// Function to update cart display
function updateCartDisplay() {
    const cartContainer = document.getElementById('cart-container');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (!cartContainer) return;

    cartContainer.innerHTML = '';
    
    if (cartItems.length === 0) {
        if (emptyCartMessage) emptyCartMessage.classList.remove('hidden');
        if (checkoutBtn) checkoutBtn.classList.add('hidden');
        return;
    }

    if (emptyCartMessage) emptyCartMessage.classList.add('hidden');
    if (checkoutBtn) checkoutBtn.classList.remove('hidden');

    // Add cart items
    cartItems.forEach(item => {
        cartContainer.appendChild(createCartItemElement(item));
    });

    // Add total section
    const totalDiv = document.createElement('div');
    totalDiv.classList.add(
        'bg-gradient-to-br',
        'from-blue-900',
        'to-gray-800',
        'text-white',
        'p-8',
        'rounded-xl',
        'mt-8',
        'shadow-2xl',
        'border',
        'border-blue-400',
        'transform',
        'hover:scale-[1.02]',
        'transition-all',
        'duration-300'
    );

    const shippingCharge = totalSum > 50000 ? 5000 : 1000;
    const totalWithShipping = totalSum + shippingCharge;

    totalDiv.innerHTML = `
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div class="space-y-3">
                <h3 class="text-2xl font-bold text-blue-300">Order Summary</h3>
                <div class="space-y-2">
                    <p class="text-lg text-gray-300">Subtotal: <span class="text-white">$${totalSum.toLocaleString()}</span></p>
                    <p class="text-lg text-gray-300">Shipping: <span class="text-white">$${shippingCharge.toLocaleString()}</span></p>
                    <p class="text-2xl font-bold text-green-400 mt-4">Total: $${totalWithShipping.toLocaleString()}</p>
                </div>
            </div>
        </div>
    `;

    cartContainer.appendChild(totalDiv);

    // Add remove item event listeners
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemId = e.currentTarget.dataset.id;
            removeFromCart(itemId);
        });
    });
}

// Function to add item to cart
function addToCart(model, price) {
    const item = {
        model,
        price,
        transactionId: Math.floor(Math.random() * 1000000),
        date: new Date().toLocaleString()
    };

    cartItems.push(item);
    totalSum += price;
    saveCartState();
    updateCartDisplay();
    showToast(`${model} added to cart - $${price.toLocaleString()}`);
}

// Function to remove item from cart
function removeFromCart(transactionId) {
    const itemIndex = cartItems.findIndex(item => item.transactionId.toString() === transactionId);
    if (itemIndex > -1) {
        const removedItem = cartItems[itemIndex];
        totalSum -= removedItem.price;
        cartItems.splice(itemIndex, 1);
        saveCartState();
        updateCartDisplay();
        showToast(`${removedItem.model} removed from cart`);
    }
}

// Function to handle checkout
function handleCheckout() {
    if (cartItems.length === 0) {
        showToast('Your cart is empty!', 'error');
        return;
    }

    // Show thank you message
    showThankYouMessage();

    // Clear cart
    cartItems = [];
    totalSum = 0;
    saveCartState();
    updateCartDisplay();
}

// Initialize cart buttons
function initializeCartButtons() {
    // BMW buttons
    document.getElementById('bmw-cart-1')?.addEventListener('click', () => {
        const price = getPriceValue('bmw', 1);
        addToCart('BMW 3 Series', price);
    });

    document.getElementById('bmw-cart-2')?.addEventListener('click', () => {
        const price = getPriceValue('bmw', 2);
        addToCart('BMW 5 Series', price);
    });

    document.getElementById('bmw-cart-3')?.addEventListener('click', () => {
        const price = getPriceValue('bmw', 3);
        addToCart('BMW X5', price);
    });

    // Audi buttons
    document.getElementById('audi-cart-1')?.addEventListener('click', () => {
        const price = getPriceValue('audi', 1);
        addToCart('Audi Q5', price);
    });

    document.getElementById('audi-cart-2')?.addEventListener('click', () => {
        const price = getPriceValue('audi', 2);
        addToCart('Audi A6', price);
    });

    document.getElementById('audi-cart-3')?.addEventListener('click', () => {
        const price = getPriceValue('audi', 3);
        addToCart('Audi A4', price);
    });

    // Mercedes buttons
    document.getElementById('mercedes-cart-1')?.addEventListener('click', () => {
        const price = getPriceValue('mercedes', 1);
        addToCart('Mercedes C-Class', price);
    });

    document.getElementById('mercedes-cart-2')?.addEventListener('click', () => {
        const price = getPriceValue('mercedes', 2);
        addToCart('Mercedes E-Class', price);
    });

    document.getElementById('mercedes-cart-3')?.addEventListener('click', () => {
        const price = getPriceValue('mercedes', 3);
        addToCart('Mercedes GLC', price);
    });

    // My cart button
    document.getElementById('my-cart')?.addEventListener('click', () => {
        window.location.href = './cart.html';
    });

    // Checkout buttons
    document.getElementById('checkout-btn')?.addEventListener('click', handleCheckout);
    document.getElementById('check-out')?.addEventListener('click', handleCheckout);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeCartButtons();
    updateCartDisplay();
});




      const div = document.createElement("div");
div.classList.add(
 "bg-gradient-to-r", // Gradient direction: left to right
  "from-black",       // Start color
  "to-blue-800", 
  "text-white",
  "p-4",
  "rounded-lg",
  "mt-4",
  "space-y-1",
  "shadow-md",
  "border",
  "border-red-500"
);



// Function to create and show message

// Initialize sum variable
let sum = 0;

// My cart button
document.getElementById("my-cart")
    .addEventListener("click", function(event) {
        window.location.href = "./cart.html";
    });


document.getElementById("bmw-cart-1")
    .addEventListener("click", function(event) {
        const price = getPriceValue('bmw', 1);
       
        sum += price;
        alert(`BMw car 3 series added to cart. Price: ${price} dollars`);


  const div = document.createElement('div');

        
div.innerHTML = `
  <h4 class="font-extrabold">Model:BMW 3 Series </h4>
  <h1>Price: ${price}</h1>

  <h1>Transaction ID: ${Math.floor(Math.random() * 1000000)}</h1>
  <h1>Transaction Date: ${new Date().toLocaleString()}</h1>
`;

const transactionHistory = document.getElementById("cart-container");
transactionHistory.appendChild(div);
        
    });























document.getElementById("bmw-cart-2")
    .addEventListener("click", function(event) {
        const price = getPriceValue('bmw', 2);
        sum += price;
        alert(`BMw car 5 series added to cart. Price: ${price} dollars`);



        
  const div = document.createElement('div');

        
div.innerHTML = `
<br>
  <h4 class="font-extrabold">Model:BMW 5 Series </h4>
  <h1>Price: ${price}</h1>

  <h1>Transaction ID: ${Math.floor(Math.random() * 1000000)}</h1>
  <h1>Transaction Date: ${new Date().toLocaleString()}</h1>
`;

const transactionHistory = document.getElementById("cart-container");
transactionHistory.appendChild(div);
      
    });

document.getElementById("bmw-cart-3")
    .addEventListener("click", function(event) {
        const price = getPriceValue('bmw', 3);
        sum += price;
          alert(`BMw car x5 added to cart. Price: ${price} dollars`);


                  
  const div = document.createElement('div');

        
div.innerHTML = `
<br>
  <h4 class="font-extrabold">Model:BMW x5  </h4>
  <h1>Price: ${price}</h1>

  <h1>Transaction ID: ${Math.floor(Math.random() * 1000000)}</h1>
  <h1>Transaction Date: ${new Date().toLocaleString()}</h1>
`;

const transactionHistory = document.getElementById("cart-container");
transactionHistory.appendChild(div);
        
    });

// Audi cart buttons
document.getElementById("audi-cart-1")
    .addEventListener("click", function(event) {
        const price = getPriceValue('audi', 1);
        sum += price;
          alert(`audi car Q5 added to cart. Price: ${price} dollars`);





                  
  const div = document.createElement('div');

        
div.innerHTML = `
<br>
  <h4 class="font-extrabold">Model:Audi Q5 Series </h4>
  <h1>Price: ${price}</h1>

  <h1>Transaction ID: ${Math.floor(Math.random() * 1000000)}</h1>
  <h1>Transaction Date: ${new Date().toLocaleString()}</h1>
`;

const transactionHistory = document.getElementById("cart-container");
transactionHistory.appendChild(div);
        
    });

document.getElementById("audi-cart-2")
    .addEventListener("click", function(event) {
        const price = getPriceValue('audi', 2);
        sum += price;
          alert(`audi car a6 added to cart. Price: ${price} dollars`);


            const div = document.createElement('div');

        
div.innerHTML = `
<br>
  <h4 class="font-extrabold">Model:Audi A6 Series </h4>
  <h1>Price: ${price}</h1>

  <h1>Transaction ID: ${Math.floor(Math.random() * 1000000)}</h1>
  <h1>Transaction Date: ${new Date().toLocaleString()}</h1>
`;

const transactionHistory = document.getElementById("cart-container");
transactionHistory.appendChild(div)
       
    });

document.getElementById("audi-cart-3")
    .addEventListener("click", function(event) {
        const price = getPriceValue('audi', 3);
        sum += price;
          alert(`audi car a4 added to cart. Price: ${price} dollars`);



                      const div = document.createElement('div');

        
div.innerHTML = `
<br>
  <h4 class="font-extrabold">Model:Audi A4 Series </h4>
  <h1>Price: ${price}</h1>

  <h1>Transaction ID: ${Math.floor(Math.random() * 1000000)}</h1>
  <h1>Transaction Date: ${new Date().toLocaleString()}</h1>
`;

const transactionHistory = document.getElementById("cart-container");
transactionHistory.appendChild(div)
       
    });

// Mercedes cart buttons
document.getElementById("mercedes-cart-1")
    .addEventListener("click", function(event) {
        const price = getPriceValue('mercedes', 1);
        sum += price;
          alert(`Mercedes car c-class added to cart. Price: ${price} dollars`);




                      const div = document.createElement('div');

        
div.innerHTML = `
<br>
  <h4 class="font-extrabold">Model:Mercedes c-class Series </h4>
  <h1>Price: ${price}</h1>

  <h1>Transaction ID: ${Math.floor(Math.random() * 1000000)}</h1>
  <h1>Transaction Date: ${new Date().toLocaleString()}</h1>
`;

const transactionHistory = document.getElementById("cart-container");
transactionHistory.appendChild(div)
      
    });

document.getElementById("mercedes-cart-2")
    .addEventListener("click", function(event) {
        const price = getPriceValue('mercedes', 2);
        sum += price;
          alert(`Mercedes car e-class added to cart. Price: ${price} dollars`);



          
                      const div = document.createElement('div');

        
div.innerHTML = `
<br>
  <h4 class="font-extrabold">Model:Mercedes e-class Series </h4>
  <h1>Price: ${price}</h1>

  <h1>Transaction ID: ${Math.floor(Math.random() * 1000000)}</h1>
  <h1>Transaction Date: ${new Date().toLocaleString()}</h1>
`;

const transactionHistory = document.getElementById("cart-container");
transactionHistory.appendChild(div)
   
    });

document.getElementById("mercedes-cart-3")
    .addEventListener("click", function(event) {
        const price = getPriceValue('mercedes', 3);
        sum += price;
        alert(`Mercedes car glc added to cart. Price: ${price} dollars`);


        
                      const div = document.createElement('div');

        
div.innerHTML = `
<br>
  <h4 class="font-extrabold">Model:Mercedes Glc Series </h4>
  <h1>Price: ${price}</h1>

  <h1>Transaction ID: ${Math.floor(Math.random() * 1000000)}</h1>
  <h1>Transaction Date: ${new Date().toLocaleString()}</h1>
`;

const transactionHistory = document.getElementById("cart-container");
transactionHistory.appendChild(div)
    });


// Check-out button
document.getElementById("check-out")
    .addEventListener("click", function(event) {
        let shippingCharge;
        if (sum > 50000) {
            shippingCharge = 5000;
        } else {
            shippingCharge = 1000;
        }
        const totalWithShipping = sum + shippingCharge;


        
 const div = document.createElement('div');

        
div.innerHTML = `
<br>
  <h4 class="font-extrabold">Your Total Cost ${sum}</h4>
  <h1>Shipping Charge: ${shippingCharge}</h1>
    <h1>Total Cost: ${totalWithShipping}</h1>
  


`;

const transactionHistory = document.getElementById("cart-container");
transactionHistory.appendChild(div)
        
    });














const transactionHistory = document.getElementById("cart-container");
transactionHistory.appendChild(div);

