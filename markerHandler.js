var tableNumber = null;

AFRAME.registerComponent("marker-handler", {
  init: async function () {
    
    //Get Table Number
    if (tableNumber === null) {
      this.askTableNumber();
    }

    //Get the dishes collection
    var dishes = await this.getDishes();

    //makerFound Event
    this.el.addEventListener("markerFound", () => {
      if (tableNumber !== null) {
        var markerId = this.el.id;
        this.handleMarkerFound(dishes, markerId);
      }
    });
    //markerLost Event
    this.el.addEventListener("markerLost", () => {
      this.handleMarkerLost();
    });
  },
  askTableNumber: function () {
    var iconUrl = "https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/hunger.png";
    swal({
      title: "Welcome to Hunger!!",
      icon: iconUrl,
      content: {
        element: "input",
        attributes: {
          placeholder: "Type your table number",
          type: "number",
          min: 1
        }
      },
      closeOnClickOutside: false,
    }).then(inputValue => {
      tableNumber = inputValue;
    });
  },

  handleMarkerFound: function (dishes, markerId) {
    // Getting today's day
    var todaysDate = new Date();
    var todaysDay = todaysDate.getDay();

    // sunday - saturday : 0 - 6
    var days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday"
    ];

    //Get the dish based on ID
    var dish = dishes.filter(dish => dish.id === markerId)[0];

    //Check if the dish is available today
    if (dish.unavailable_days.includes(days[todaysDay])) {
      swal({
        icon: "warning",
        title: dish.dish_name.toUpperCase(),
        text: "This dish is not available today!!!",
        timer: 2500,
        buttons: false
      });
    } else {
      //Changing Model scale to initial scale
      var model = document.querySelector(`#model-${dish.id}`);
      model.setAttribute("position", dish.modelGeometry.position);
      model.setAttribute("rotation", dish.modelGeometry.rotation);
      model.setAttribute("scale", dish.modelGeometry.scale);

      //Update UI conent VISIBILITY of AR scene(MODEL , INGREDIENTS & PRICE)      
      model.setAttribute("visible", true);

      var ingredientsContainer = document.querySelector(`#main-plane-${dish.id}`);
      ingredientsContainer.setAttribute("visible", true);

      var priceplane = document.querySelector(`#price-value-${dish.id}`);
      priceplane.setAttribute("visible", true)

      //Changing button div visibility
      var buttonDiv = document.getElementById("button-div");
      buttonDiv.style.display = "flex";

      var ratingButton = document.getElementById("ratingButton");
      var orderButtton = document.getElementById("orderButton");
      var orderSummaryButton = document.getElementById("orderSummaryButton")
      var payButton = document.getElementById('pay-button')
      ratingButton.addEventListener('click',()=>this.handleRating(dish))


      if (tableNumber != null) {
        //Handling Click Events
        orderButtton.addEventListener("click", () => {
          var tNumber;
          tableNumber <= 9 ? (tNumber = `T0${tableNumber}`) : `T${tableNumber}`;
          this.handleOrder(tNumber, dish);

          swal({
            icon: "https://i.imgur.com/4NZ6uLY.jpg",
            title: "Thanks For Order !",
            text: "Your order will serve soon on your table!",
            timer: 2000,
            buttons: false
          });
        });

        orderSummaryButton.addEventListener('click', ()=>{
          this.handleOrderSummary()
        })

        payButton.addEventListener('click',()=>{
          this.handlePayment()
        })
        ratingButton.addEventListener("click", function () {
          swal({
            icon: "warning",
            title: "Rate Dish",
            text: "Work In Progress"
          });
        });
      }
    }
  },
  handleOrder: function (tNumber, dish) {
    // Reading current table order details
    firebase
      .firestore()
      .collection("tables")
      .doc(tNumber)
      .get()
      .then(doc => {
        var details = doc.data();
        if (details["currentOrder"][dish.id]) {
          // Increasing Current Quantity
          details["currentOrder"][dish.id]["quantity"] += 1;

          //Calculating Subtotal of item
          var currentQuantity = details["currentOrder"][dish.id]["quantity"];

          details["currentOrder"][dish.id]["subtotal"] =
            currentQuantity * dish.price;
        } else {
          details["currentOrder"][dish.id] = {
            item: dish.dish_name,
            price: dish.price,
            quantity: 1,
            subtotal: dish.price * 1
          };
        }

        details.totalBill += dish.price;

        //Updating db
        firebase
          .firestore()
          .collection("tables")
          .doc(doc.id)
          .update(details);
      });
  },

  handleOrderSummary: async function(){
    var tNumber 
    tableNumber <= 9 ? (tNumber = `T0${tableNumber}`) : `T${tableNumber}`
    
    var orderSummary = await this.getOrderSummary(tNumber)

    var modalDiv = document.getElementById('modal-div')

    modalDiv.style.display = 'flex'

    var tableBodyTag = document.getElementById('bill-table-body')

    tableBodyTag.innerHTML = ''

    var currentOrders = Object.keys(orderSummary.currentOrder)

    currentOrders.map(i=>{
      var tr = document.createElement('tr')
      var item = document.createElement('td')
      var price = document.createElement('td')
      var quantity = document.createElement('td')
      var subtotal = document.createElement('td')

      item.innerHTML = orderSummary.currentOrder[i].item
      price.innerHTML = '$' + orderSummary.currentOrder[i].price
      price.setAttribute('class','text-center')
      quantity.innerHTML = orderSummary.currentOrder[i].quantity
      quantity.setAttribute('class','text-center')
      subtotal.innerHTML = '$' + orderSummary.currentOrder[i].subtotal
      subtotal.setAttribute('class','text-center')

      tr.appendChild(item)
      tr.appendChild(price)
      tr.appendChild(quantity)
      tr.appendChild(subtotal)

      tableBodyTag.appendChild(tr)
    })
    //Create a table row to Total bill 
    var totalTr = document.createElement("tr"); 
    //Create a empty cell (for not data) 
    var td1 = document.createElement("td"); 
    td1.setAttribute("class", "no-line"); 
    //Create a empty cell (for not data) 
    var td2 = document.createElement("td"); 
    td1.setAttribute("class", "no-line"); 
    //Create a cell for TOTAL 
    var td3 = document.createElement("td"); 
    td1.setAttribute("class", "no-line text-center"); 
    //Create <strong> element to emphasize the text 
    var strongTag = document.createElement("strong"); 
    strongTag.innerHTML = "Total"; 
    td3.appendChild(strongTag); 
    //Create cell to show total bill amount 
    var td4 = document.createElement("td"); 
    td1.setAttribute("class", "no-line text-right"); 
    td4.innerHTML = "$" + orderSummary.totalBill; 
    //Append cells to the row 
    totalTr.appendChild(td1); 
    totalTr.appendChild(td2); 
    totalTr.appendChild(td3); 
    totalTr.appendChild(td4); 
    //Append the row to the table
    tableBodyTag.appendChild(totalTr);
  },



  getOrderSummary: async function(tNumber){
    return await firebase
    .firestore()
    .collection('tables')
    .doc(tNumber)
    .get()
    .then(doc => doc.data())
  
  },
  handlePayment: function(){
    // Close Modal 
    document.getElementById("modal-div").style.display = "none"; 
    // Getting Table Number 
    var tNumber; 
    tableNumber <= 9 ? (tNumber = `T0${tableNumber}`) : `T${tableNumber}`; 
    //Reseting current orders and total bill 
    firebase 
    .firestore() 
    .collection("tables") 
    .doc(tNumber) 
    .update({ currentOrder: {}, totalBill: 0 }) 
    .then(() => { 
      swal({ 
        icon: "success", 
        title: "Thanks For Paying !", 
        text: "We Hope You Enjoyed Your Food !!", 
        timer: 2500, 
        buttons: false }); 
      });
  },
  //Function to get the dishes collection from db
  getDishes: async function () {
    return await firebase
      .firestore()
      .collection("dishes")
      .get()
      .then(snap => {
        return snap.docs.map(doc => doc.data());
      });
  },

  handleRating: async function(dish){
    var tNumber
    tNumber <= 9 ? (tNumber = `T0${tNumber}`) : `T${tNumber}`

    var orderSummary = await this.getOrderSummary(tNumber)
    var currentOrder = Object.keys(orderSummary.currentOrder)

    if(currentOrder.length > 0 && currentOrder === dish.id){
      document.getElementById('rating-modal-div').style.display = 'flex'
      document.getElementById('rating-input').value = '0'
      document.getElementById('feedback-input').value = ''

      var saveRatingButton = document.getElementById('save-rating-button')
      
      saveRatingButton.addEventListener('click',()=>{
        document.getElementById('rating-modal-div').style.display = 'none'

        var rating = document.getElementById('rating-input').value
        var feedback = document.getElementById('feedback-input').value
        firebase.firestore()
        .collection('dishes')
        .doc(dish.id)
        .update({
          lastReview:feedback,
          lastRating:rating,
        })
        .then(()=>{
          swal({
            icon: 'Success',
            title: 'thanks for rating',
            text: 'We hope you liked it',
            timer: 2500,
            buttons:false
          })
        })
      })

    }
    else{
      swal({
        icon:'Warning',
        title:'Oops!',
        text:'No dish found for rating',
        timer: 2500,
        buttons:false
      })
    }
  },
  handleMarkerLost: function () {
    // Changing button div visibility
    var buttonDiv = document.getElementById("button-div");
    buttonDiv.style.display = "none";
  }
});