AFRAME.registerComponent('create-buttons',{
    init: function(){
        var button1 = document.createElement('button')
        button1.innerHTML = 'Rate dish'
        button1.setAttribute('id','ratingButton')
        button1.setAttribute('class','btn btn-warning ml-3 mr-3')

        var button2 = document.createElement('button')
        button2.innerHTML = 'Order Now'
        button2.setAttribute('id','orderButton')
        button2.setAttribute('class','buttonwarning')

        var button3 = document.createElement('button')
        button3.innerHTML = 'Order Summary'
        button3.setAttribute('id','orderSummaryButton')
        button3.setAttribute('class','btn btn-warning ml-3')

        var buttonDiv = document.getElementById('button-div')
        buttonDiv.appendChild(button1)
        buttonDiv.appendChild(button2)
        buttonDiv.appendChild(button3)
        
       

    }
})