function getItems()
{
    db.collection("items").get().then((querySnapshot) => {
        let items = [];
        querySnapshot.forEach((doc) => {
            items.push({
                id: doc.id,
                image: doc.data().image,
                name: doc.data().name,
                rating: doc.data().rating,
                price: doc.data().price
            })
        });
        generateItems(items);
    });  
}

function addToCart(item)
{
    let cartItem = db.collection("cart-items").doc(item.id);
    cartItem.get()
    .then(function(doc){
        if(doc.exists){
            cartItem.update(
                {
                    quantity: doc.data().quantity+1
                })
        }

        else{
            cartItem.set({
                image: item.image,
                name: item.name,
                price: item.price,
                rating: item.rating,
                quantity:1

            })
        }
    })

}

function generateItems(items)
{
    let itemsHTML = "";
    items.forEach((item) => {
        // creating div element
        let doc = document.createElement("div");
        doc.classList.add("main-product","mr-5");
        doc.innerHTML = `
                        <div class="product-image w-48 h-52 bg-white p-2 rounded-lg ">
                            <img class="w-full h-full object-contain" src="${item.image}"
                             alt="MacBook Pro">
                        </div>
    
                        <div class="product-name text-gray-700 font-bold mt-2 text-lg ">
                          ${item.name}
                        </div>
    
                        <div class=" product-rating text-yellow-500 font-bold my-1">
                            ⭐⭐⭐⭐⭐ ${item.rating}
                        </div>
    
                        <div class="product-price text-gray-700 font-bold text-sm">
                            ${numeral(item.price).format('₹0,0.00')}
                        </div>

                      
        `
        let addToCartEl = document.createElement("div");
        addToCartEl.classList.add("hover:bg-yellow-600","cursor-pointer","product-add","h-8","w-28","rounded","bg-yellow-500","text-white","text-md","flex","items-center","justify-center");
        addToCartEl.innerText = "Add to cart";
        addToCartEl.addEventListener("click",function(){
            addToCart(item)
        })

        doc.appendChild(addToCartEl);
        document.querySelector(".main-section-products").appendChild(doc);

    }) 
}

getItems();
/*
querySnapshot will take a snap of all the products present in the database.

`` --> These type of string literals are type of dynamic content binding. Because inside it we
 can extract the values of the html elements and ""--> will not be helpful here. */
