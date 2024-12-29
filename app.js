import { menuArray } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

const enterCardDetailsContainer = document.getElementById(
  "enter-card-details-container"
);
const yourOrderContainer = document.getElementById("your-order-container");
const confirmationNote = document.getElementById("confirmation-note");
const overlay = document.getElementById("overlay");
const totalPriceContainer = document.getElementById("food-order-total-price");

let ordersArray = [];
let totalPrice = 0;
let yourOrderHtml = "";
let priceArray = [];

//!   -------------  EVENT LISTENERS  ----------------
document.addEventListener("click", function (e) {
  //it is in black so it is not a number - we need it in blue
  if (e.target.dataset.add) {
    createOrdersArray(Number(e.target.dataset.add));
    renderOrdersArray(ordersArray);
  } else if (e.target.id === "complete-order-btn") {
    handleCompleteOrder();
  } else if (e.target.dataset.removebtn) {
    handleRemove(e.target.dataset.removebtn);
  }
});

enterCardDetailsContainer.addEventListener("submit", function (e) {
  e.preventDefault();
  yourOrderContainer.classList.add("hidden");
  const formData = new FormData(enterCardDetailsContainer);
  console.log(formData);
  overlay.style.display = "none";
  enterCardDetailsContainer.classList.add("hidden");
  confirmationNote.classList.remove("hidden");
  document.getElementById(
    "confirmation-note"
  ).innerHTML = `<h4>Thanks, ${formData.get(
    "name"
  )}! Your order is on its way!</h4>`;
});

//!   -------   FUNCTIONS FOR EVENT LISTENERS  -------
//retrieve the name of the item and the price and render it on page

const createOrdersArray = (itemId) => {
  menuArray.forEach((item) => {
    item.uuid = uuidv4(); // give them each their own unique uuid so that we can retrive it later to remove it
  });
  const clickedItem = menuArray.find((item) => item.id === itemId);

  if (clickedItem) {
    const existingItem = ordersArray.find((item) => item.id == clickedItem.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      clickedItem.quantity = 1;
      ordersArray.push(clickedItem);
    }
  }
};

function renderOrdersArray() {
  renderYourOrder();

  yourOrderHtml = `
       
          <div class="food-order-item" id="food-order-item"> </div>
              <div class="food-order-total-price" >
          <h2>Total price:</h2>
          <p class="price" id="display-total-price">$${totalPrice}</p>
        </div>
        <button class="complete-order-btn" id="complete-order-btn">Complete order</button>
         `;

  totalPriceContainer.innerHTML = yourOrderHtml;
  totalPriceContainer.classList.remove("hidden");
}

function handleCompleteOrder() {
  //! add the overlay here
  overlay.style.display = "block";
  enterCardDetailsContainer.classList.remove("hidden");
}

function handleRemove(itemId) {
  ordersArray = ordersArray.filter((item) => item.uuid !== itemId);
  renderOrdersArray();
  renderYourOrder();

  if (ordersArray.length < 1) {
    yourOrderContainer.classList.add("hidden");
    //! Must reset here so that the user can choose an item again without refreshing
    window.location.reload();
  }
}

//!   -------------  OTHER FUNCTIONS  ----------------

function renderYourOrder() {
  let orderItemsHtml = `<h2 class="your-order-title">Your Order</h2>`;
  ordersArray.forEach((item) => {
    const { name, price, uuid, quantity } = item;
    let subtotalPrice = item.price * item.quantity;
    totalPrice = subtotalPrice; // we get 14 + 14 = 28 + 14 = 42
    orderItemsHtml += ` <div class="each-food-order-item">
              <div class="food-order-left">
                <h2>${name}</h2>
                 <p class="quantity">x ${quantity}</p>
                <button class="remove-btn" data-removebtn=${uuid}>remove</button>
               
              </div>
              <p class="price">$${subtotalPrice}</p></div>`;

    //console.log({ subtotalPrice, totalPrice });
  });
  const foodOrderItem = document.getElementById("food-order-item");
  foodOrderItem.innerHTML = orderItemsHtml;

  totalPrice = ordersArray.reduce((total, currentItem) => {
    return total + currentItem.price * currentItem.quantity;
  }, 0);
  //console.log(totalPrice);
}

function renderItems() {
  let renderStr = "";
  const renderItems = menuArray
    .map((item) => {
      const { name, ingredients, price, emoji, id } = item;

      renderStr += `<div class="food-item">
          <div class="food-item-left">
            <p class="food-icon">${emoji}</p>
            <div class="food-item-content">
              <h2 data-name=${id}>${name}</h2>
              <p>${ingredients
                .map((ingredient, index) => {
                  if (index === ingredients.length - 1) {
                    return ingredient + ". ";
                  } else {
                    return ingredient + ", ";
                  }
                })
                .join(" ")}</p>
              <p class="price" data-price=${id}>$${price}</p>
            </div>
          </div>
          <button class="add-btn" data-add=${id}>+</button>
        </div> 
            </div>
       `;
    })
    .join(" ");
  const foodItemContainer = document.getElementById("food-item-container");
  foodItemContainer.innerHTML = renderStr;
}
renderItems();
