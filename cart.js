function getCartItems()
{
    db.collection("cart-items").onSnapshot((snapshot) => {
        let cartItems = [];
        snapshot.docs.forEach((doc) => {
            cartItems.push(
                {
                    id: doc.id,
                    ...doc.data() //spread operator
                    // Instead of copying every field line by line, doc.data() gives all the fields present in that collection.

                })
        })
        generateCartItems(cartItems);
        getTotalCost(cartItems);
    })
}

function getTotalCost(items){
    let totalCost = 0;
    items.forEach((item)=>
    {
        totalCost += (item.quantity * item.price);
    })

    document.querySelector(".total-cost-number").innerText = numeral(totalCost).format('₹0,0.0000');
}

function decreaseCount(itemId)
{
    let cartItem = db.collection("cart-items").doc(itemId);
    cartItem.get().then(function(doc) {
        if(doc.exists){
            if(doc.data().quantity > 1){
                cartItem.update({
                    quantity: doc.data().quantity - 1
                })
            }
        }
    }
    )

}

function increaseCount(itemId)
{
    let cartItem = db.collection("cart-items").doc(itemId);
    cartItem.get().then(function(doc){
        if(doc.exists){
            if(doc.data().quantity > 0){
                cartItem.update({
                    quantity: doc.data().quantity +1
                })
            }
        }
    })
}

function deleteItem(itemId){
    db.collection("cart-items").doc(itemId).delete();
}

function generateCartItems(cartItems)
{
    let itemsHTML = "";
    cartItems.forEach((item) =>
    {
        itemsHTML+= `

                <div class="item w-full h-30 bg-white border-b border-gray-400 flex item-center rounded justify-center">

                    <div class="item-image w-40 h-25 bg-white p-2 rounded-lg">
                        <!-- In img class: w-full h-full means, fit the image to the full extent of div
                        and use object-contain so that entire image fits in.-->
                        
                        <img class="w-full h-full object-contain"src="${item.image}" alt="">
                    </div>
    
                    <div class="item-details flex-grow mt-5">
                        <div class="item-title font-bold text-sm text-gray-600 ">
                            ${item.name}
                        </div>
                    </div>

                    <div class="item-count flex items-center w-48">
                        <div class="text-gray-600 flex "> 
                            <div data-id="${item.id}"  class="cart-item-decrease cursor-pointer text-gray-400 bg-gray-100 mr-2 rounded h-6 w-6 items-center justify-center hover:bg-gray-200">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </div>
                            x ${item.quantity}
                            <div data-id="${item.id}" class="cart-item-increase cursor-pointer text-gray-400 bg-gray-100 ml-2 rounded h-6 w-6 items-center justify-center hover:bg-gray-200">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                  </svg>
                            </div>

                        </div>
                    </div>
    
                    <div class="item-total-cost mt-8 w-48 font-bold text-gray-400 ">
                        ${numeral(item.price * item.quantity).format('₹0,0.0000')}
                    </div>

                    <div data-id="${item.id}" class="cart-item-delete w-10 font-bold mt-7 cursor-pointer text-gray-300  ">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                    </div>

                </div>

               
            
        `
    })

    document.querySelector(".cart-items").innerHTML = itemsHTML;
    createEventListeners();
}

function createEventListeners()
{
    let decreaseButtons = document.querySelectorAll(".cart-item-decrease");
    let increaseButtons = document.querySelectorAll(".cart-item-increase");

decreaseButtons.forEach((button) =>
{
    button.addEventListener("click",function()
    {
        decreaseCount(button.dataset.id);
    })
})

increaseButtons.forEach((button) =>
{
    button.addEventListener("click",function(){
        increaseCount(button.dataset.id)
    })
})

let deleteButtons = document.querySelectorAll(".cart-item-delete");

deleteButtons.forEach((button) =>
{
    button.addEventListener("click",function(){
        deleteItem(button.dataset.id)
    })
})
    
}



getCartItems();

/* onSnapshot has a direct and constant connection with db, and hence updation will be 
reflected instantly and not like get().then() where updation is shown when the browser is refreshed.*/