AFRAME.registerComponent('create-marker',{
    init: async function(){
        var mainScene = document.querySelector('#main-scene')
        var dishes = await this.getDishes()
        dishes.map(dish=>{
            var marker = document.createElement('a-marker')
            marker.setAttribute('id',dish.id)
            marker.setAttribute('type','pattern')
            marker.setAttribute('url',dish.markerPatternURL)
            marker.setAttribute('cursor',{
                rayOrigin:'mouse'
            })
            marker.setAttribute('marker-handler',{})
            mainScene.appendChild(marker)
            var todayDate = new Date()
            var todaysDay = todayDate.getDay()
            var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
            if(!dish.unavailable_days.includes(days[todaysDay])){
                var model = document.createElement('a-entity')
                model.setAttribute('id',`model-${dish.id}`)
                model.setAttribute('position',dish.modelGeometry.position)
                model.setAttribute('rotation',dish.modelGeometry.rotation)
                model.setAttribute('scale',dish.modelGeometry.scale)
                model.setAttribute('gltf-model',`url(${dish.modelUrl})`)
                model.setAttribute('gesture-handler',{})
                model.setAttribute('visible',false)
                marker.appendChild(model)

                var mainPlane = document.createElement('a-plane')
                mainPlane.setAttribute('id',`main-plane-${dish.id}`)
                mainPlane.setAttribute('position',{
                    x:0,
                    y:0,
                    z:0,
                })
                mainPlane.setAttribute('rotation',{
                    x:-90,
                    y:0,
                    z:0,
                })
                mainPlane.setAttribute('width',1.7)
                mainPlane.setAttribute('height',1.5)
                mainPlane.setAttribute('visible',false)
                marker.appendChild(mainPlane)

                var titlePlane = document.createElement('a-plane')
                titlePlane.setAttribute('id',`title-plane-${dish.id}`)
                titlePlane.setAttribute('position',{
                    x:0,
                    y:0.89,
                    z:0.02
                })
                titlePlane.setAttribute('rotation',{
                    x:0,
                    y:0,
                    z:0
                })
                titlePlane.setAttribute('width',1.69)
                titlePlane.setAttribute('height',0.3)
                titlePlane.setAttribute('material',{
                    color:'#f0c30f',
                })
                mainPlane.appendChild(titlePlane)
                
                var dishTitle = document.createElement("a-entity");
                dishTitle.setAttribute("id", `dish-title-${dish.id}`);
                dishTitle.setAttribute("position", { x: 0, y: 0, z: 0.1 });
                dishTitle.setAttribute("rotation", { x: 0, y: 0, z: 0 });
                dishTitle.setAttribute("text", {
                font: "monoid",
                color: "black",
                width: 1.8,
                height: 1,
                align: "center",
                value: dish.dish_name.toUpperCase()
                });
                titlePlane.appendChild(dishTitle);

                var ingredients = document.createElement('a-entity')
                ingredients.setAttribute('id',`ingredients-${dish.id}`)
                ingredients.setAttribute('position',{
                    x:0.3,
                    y:0,
                    z:0.1
                })
                ingredients.setAttribute('rotation',{
                    x:0,
                    y:0,
                    z:0
                })
                ingredients.setAttribute('text',{
                    font:'monoid',
                    color:'black',
                    width:2,
                    align:'left',
                    value:`${dish.ingredients.join('\n\n')}`
                })
                mainPlane.appendChild(ingredients)

                var priceValue = document.createElement('a-image')
                priceValue.setAttribute('id',`price-value-${dish.id}`)
                priceValue.setAttribute('src','https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/black-circle.png')
                priceValue.setAttribute('width',0.8)
                priceValue.setAttribute('height',0.8)
                priceValue.setAttribute('position',{
                    x:-1.3,
                    y:0,
                    z:0.3,
                })
                priceValue.setAttribute('rotation',{
                    x:-90,
                    y:0,
                    z:0,
                })
                priceValue.setAttribute('visible',false)

                var pv = document.createElement('a-entity')
                pv.setAttribute('id',`pv-${dish.id}`)
                pv.setAttribute('position',{
                    x:0.03,
                    y:0.05,
                    z:0.1
                })
                pv.setAttribute('rotation',{
                    x:0,
                    y:0,
                    z:0
                })
                pv.setAttribute('text',{
                    font:'mozillavr',
                    color:'white',
                    width:3,
                    align:'center',
                    value:`only\n$${dish.price}`
                })
                priceValue.appendChild(pv)
                marker.appendChild(priceValue)

                var ratingPlane = document.createElement('a-entity')
                ratingPlane.setAttribute('id',`rating-plane-${dish.id}`)
                ratingPlane.setAttribute('position',{
                    x:2,
                    y:0,
                    z:0.5
                })
                ratingPlane.setAttribute('geometry',{
                    primitive:'plane',
                    width:1.5,
                    height:0.3
                })
                ratingPlane.setAttribute('material',{
                    color:'#f0c30f',
                })
                ratingPlane.setAttribute("rotation", {
                    x: -90,
                    y: 0, 
                    z: 0 
                }); 
                ratingPlane.setAttribute("visible", false);
                // Ratings 
                var rating = document.createElement("a-entity"); 
                rating.setAttribute("id", `rating-${dish.id}`); 
                rating.setAttribute("position", { 
                    x: 0,
                    y: 0.05, 
                    z: 0.1 
                }); 
                rating.setAttribute("rotation", { 
                    x: 0, 
                    y: 0, 
                    z: 0 
                }); 
                rating.setAttribute("text", { 
                    font: "mozillavr", 
                    color: "black", 
                    width: 2.4, 
                    align: "center", 
                    value: `Customer Rating: ${dish.lastRating}` 
                }); 
                ratingPlane.appendChild(rating); 
                marker.appendChild(ratingPlane); 
                // Dish review plane 
                var reviewPlane = document.createElement("a-entity"); 
                reviewPlane.setAttribute("id", `review-plane-${dish.id}`); 
                reviewPlane.setAttribute("position", { 
                    x: 2, 
                    y: 0, 
                    z: 0 
                }); 
                reviewPlane.setAttribute("geometry", { 
                    primitive: "plane", 
                    width: 1.5, 
                    height: 0.5 
                }); 
                reviewPlane.setAttribute("material", { 
                    color: "#F0C30F" 
                }); 
                reviewPlane.setAttribute("rotation", {
                    x: -90, 
                    y: 0, 
                    z: 0 
                }); 
                reviewPlane.setAttribute("visible", false); 
                // Dish review 
                var review = document.createElement("a-entity"); 
                review.setAttribute("id", `review-${dish.id}`); 
                review.setAttribute("position", { x: 0, y: 0.05, z: 0.1 }); 
                review.setAttribute("rotation", { x: 0, y: 0, z: 0 }); 
                review.setAttribute("text", { font: "mozillavr", color: "black",
                 width: 2.4, align: "center", value: `Customer Review: \n${dish.lastReview}` }); 
                reviewPlane.appendChild(review); 
                marker.appendChild(reviewPlane);
            }   
        })
    },
    getDishes: async function(){
        return await firebase.firestore()
        .collection('dishes')
        .get()
        .then(snap=>{
            return snap.docs.map(doc=>doc.data())
        })
    }
})