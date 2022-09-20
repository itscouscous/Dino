// RATE
// open modal
let openrate = document.querySelectorAll('#btn-rate');
// grab modal
let modal_rate = document.querySelector('#modal-rate');
// close modal
let closerate = document.querySelectorAll('#modal-rate-bg, #btn-rate-x, #btn-rate-submit');


// RESTAURANT
// open modal
let openrestaurant = document.querySelectorAll('.content, .card-image');
// grab modal
let modal_restaurant = document.querySelector('#modal-restaurant');
// close modal
let closerestaurant = document.querySelectorAll('#modal-restaurant-bg, #btn-restaurant-x');

let your_reviews = document.querySelector('#your_reviews');

// grab the triggers to open a page
let openhome = document.querySelectorAll('#link-home');
let opendiscover = document.querySelectorAll('#link-discover');
let openaboutus = document.querySelectorAll('#link-about-us');
let openlogin = document.querySelectorAll('#link-log-in, #btn-log-in');
let opensignup = document.querySelectorAll('#link-sign-up, #btn-sign-up');
// let openpersonalize = document.querySelectorAll('#btn-sign-up-submit');

// grab pages
let home = document.querySelector('#home');
let discover = document.querySelector('#discover');
let about_us = document.querySelector('#about-us');
let log_in = document.querySelector('#log-in');
let sign_up = document.querySelector('#sign-up');
// let personalize = document.querySelector('#personalize');

let link_home = document.querySelector('#link-home');
let link_discover = document.querySelector('#link-discover');
let link_about_us = document.querySelector('#link-about-us');

const sections = [home, discover, about_us, log_in, sign_up];
const navbar = [link_home, link_discover, link_about_us];

let review_form = document.querySelector('#review_form');

const signedinlinks = document.querySelectorAll('.signedin');
const signedoutlinks = document.querySelectorAll('.signedout');

const signedincontent = document.querySelectorAll('.signedincontent');

let recommended = document.querySelector('#recommended');
let restaurant_data = document.querySelector('#restaurant_data');

let modal_title = document.querySelector('#modal_title');
let modal_stats = document.querySelector('#modal_stats');
let review_data = document.querySelector('#review_data');
let restaurantslength = document.querySelector('#restaurantslength');

// const search_bar = document.querySelector('#search_bar');
const search_button = document.querySelector('#search_button');
const reset_button = document.querySelector('#reset_button');
// FUNCTIONS

// const average = arr => arr.reduce((a,b) => a + b, 0) / arr.length;
function average(arr) {
    if (arr.length == 0) {
        return 0;
    } else {
        let sum = 0;
        arr.forEach(element => {
            sum += element;
        })
        return sum / arr.length;
    }
}

function hideVisible() {
    for (let i = 0; i < sections.length; i++) {
        // console.log("test");
        if (!(sections[i].classList.contains('is-hidden'))) {
            sections[i].classList.add('is-hidden');
            // console.log("Page hidden successfully");
        }
    }
};

function hideHover() {
    for (let i = 0; i < navbar.length; i++) {
        // console.log("test2");
        if (navbar[i].classList.contains('is-active')) {
            navbar[i].classList.remove('is-active');
            navbar[i].classList.remove('has-text-weight-bold');
            navbar[i].classList.remove('has-text-primary');
            // console.log("Hover hidden successfully");
        }
    }
};

function addHover(navitem) {
    navitem.classList.add('is-active');
    navitem.classList.add('has-text-weight-bold');
    navitem.classList.add('has-text-primary');
    // console.log("Hover added successfully");
};

function configure_message_bar(msg) {
    // make the message bar visible
    document.querySelector('#message_bar').classList.remove('is-hidden');
    // set the content of the message bar
    document.querySelector('#message_bar').innerHTML = msg;

    // hide the message bar after 2 seconds

    setTimeout(() => {
        document.querySelector('#message_bar').classList.add('is-hidden');
        // clear the message bar
        document.querySelector('#message_bar').innerHTML = "";

    }, 2000)
}

function configure_nav_bar(userObj) {
    // user is already signed in
    if (userObj) {
        // show all links with the signedin class and hide all the links with the signedout class
        signedinlinks.forEach(link => {
            link.classList.remove('is-hidden');
        })
        signedoutlinks.forEach(link => {
            link.classList.add('is-hidden');
        })


    } else {

        // hide all links with the signedin class and show all the links with the signedout class
        signedinlinks.forEach(link => {
            link.classList.add('is-hidden');
        })
        signedoutlinks.forEach(link => {
            link.classList.remove('is-hidden');
        })

    }
}

// displays list of restaurants in rate modal
const restaurant_list = document.querySelector('#restaurant_list');

function list_restaurants() {
    db.collection("restaurants").get().then((response) => {
        let docs = response.docs;
        let html = '';
        let reslist = [];
        // from doc to reslist
        docs.forEach(doc => {
            reslist.push(`${doc.data().name}`);
        })
        // order reslist alphabetically
        reslist = reslist.sort();
        // from reslist to html
        reslist.forEach(res => {
            html += `<option value="${res}">${res}</option>`;
        })
        // append html to #restaurant_list
        restaurant_list.innerHTML = html;
    })
}

// displays list of user needs in rate modal
const user_needs = document.querySelector('#user_needs');

function list_user_needs() {
    db.collection("users").get().then((response) => {

        let docs = response.docs;
        let html = '';

        // from doc to html
        docs.forEach(doc => {
            // check if doc.id == user uid
            if (doc.id == firebase.auth().currentUser.uid) {
                //for every interest, append to html
                doc.data().interests.forEach(need => {
                    html += `<option value="${need}">${need}</option>`;
                })
            }
        })
        // append html to #list
        user_needs.innerHTML = html;
    })
}



// SUBMIT REVIEW
// (save data function)
function submit_review(collection_name, obj) {
    db.collection(`${collection_name}`).add(obj).then(() => {
        review_form.reset();
        configure_message_bar("Review successfully submitted!");
    })
}


function load_modal(restaurantid) {
    // saves ratings like [4,5,5]
    let ratings_dairy = [];
    let ratings_eggs = [];
    let ratings_nuts = [];
    let ratings_seafood = [];
    let ratings_halal = [];
    let ratings_kosher = [];
    let ratings_vegan = [];
    let ratings_vegetarian = [];
    let ratings_wheelchair = [];
    let ratings_animal = [];
    let needs = ["Dairy", "Eggs", "Nuts", "Seafood", "Halal", "Kosher", "Vegan", "Vegetarian", "Wheelchair", "Service Animal"]

    let largest = 0;
    let largest_index = 0;
    // alert('outside the nested db' + restaurantid);

    db.collection("restaurants").get().then((response) => {
        let docs = response.docs;
        docs.forEach(doc => {
            if (doc.id == restaurantid) {
                // change modal title
                modal_title.innerHTML = `
                <div style="margin: 3% 1% 0% 1%">
                    <h1 class="title has-text-weight-bold has-text-white is-4 mb-1"
                    style="font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif">${doc.data().name}</h1>
                </div>
                <button class="delete mb-auto ml-auto" id="btn-restaurant-x" aria-label="close" onclick="modal_restaurant.classList.remove('is-active')"></button>
                `;



                // load reviews
                db.collection("reviews").get().then((response) => {
                    let docs = response.docs;
                    let html = '';
                    docs.forEach(doc => {
                        // alert(typeof(doc.data().restaurant) + " <=> "+ typeof(restaurantid));
                        if (doc.data().restaurant === restaurantid) {
                            // alert('hello');
                            // console.log(doc.data().needs);
                            
                            if (doc.data().needs == "Dairy") {
                                ratings_dairy.push(parseInt(doc.data().rating));
                            }
                            if (doc.data().needs == "Eggs") {
                                ratings_eggs.push(parseInt(doc.data().rating));
                            }
                            if (doc.data().needs == "Nuts") {
                                ratings_nuts.push(parseInt(doc.data().rating));
                            }
                            if (doc.data().needs == "Seafood") {
                                ratings_seafood.push(parseInt(doc.data().rating));
                            }
                            if (doc.data().needs == "Halal") {
                                ratings_halal.push(parseInt(doc.data().rating));
                            }
                            if (doc.data().needs == "Kosher") {
                                ratings_kosher.push(parseInt(doc.data().rating));
                            }
                            if (doc.data().needs == "Vegan") {
                                // console.log("hi");
                                ratings_vegan.push(parseInt(doc.data().rating));
                                // console.log('test test test ' + ratings_vegan[0]);
                            }
                            if (doc.data().needs == "Vegetarian") {
                                ratings_vegetarian.push(parseInt(doc.data().rating));
                            }
                            if (doc.data().needs == "Wheelchair") {
                                ratings_wheelchair.push(parseInt(doc.data().rating));
                            }
                            if (doc.data().needs == "Service Animal") {
                                ratings_animal.push(parseInt(doc.data().rating));
                            }

                            let rating = '';
                            for (let i = 0; i < doc.data().rating; i++) {
                                rating += `<i class="fas fa-star has-text-warning"></i>`;
                            }

                            html += `
                            <div class="card large mb-4">
                                <div class="card-content">
                                    <div class="media">
                                        <div class="content is-left">
                                            <h1 class="has-text-weight-bold has-text-dark is-size-5 mb-2"
                                                style="font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif">${doc.data().user_email}</h1>
                                            ${rating}
                                            <p class="subtitle is-6 mt-1"><b>Rated for:&nbsp; </b>${doc.data().needs}</p>
                                            <p class="subtitle is-6 mt-2">${doc.data().comments}</p>
                                        </div>
                                        <div class="content is-right ml-auto">
                                            <image width="200" src="${doc.data().url}" alt="Image"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            `;

                        }
                        //inner then

                        // alert(average([1,2,3]));
                        let averages = [];

                        // alert(ratings_dairy);

                        // console.log(ratings_vegan);

                        averages.push(average(ratings_dairy));
                        averages.push(average(ratings_eggs));
                        averages.push(average(ratings_nuts));
                        averages.push(average(ratings_seafood));
                        averages.push(average(ratings_halal));
                        averages.push(average(ratings_kosher));
                        averages.push(average(ratings_vegan));
                        averages.push(average(ratings_vegetarian));
                        averages.push(average(ratings_wheelchair));
                        averages.push(average(ratings_animal));

                        // console.log(averages);
                        for (var i = 0; i < averages.length; i++) {
                            if (largest < averages[i]) {
                                largest = averages[i];
                                largest_index = i;
                            }
                        }

                        // console.log(largest);
                        // console.log(largest_index);

                        // change modal stats based on reviews
                        modal_stats.innerHTML = `
                        <p class="subtitle is-6 my-0"><b>${needs[largest_index]}</b> ${largest.toFixed(2)}</p>
                        `;

                        db.collection("restaurants").doc(restaurantid).update({
                            best: needs[largest_index],
                            best_rating: largest.toFixed(2)
                        })


                    })
                    //outside then but also outside loop

                    if (html.length == 0) {
                        review_data.innerHTML = `
                        <div class="has-text-centered has-text-weight-bold has-text-grey-light my-6 signedincontent">
                        <i class="fas fa-seedling is-size-4 mr-2"></i>
                        <p>No reviews currently available!</p>
                        </div>
                        `;
                    } else {
                        review_data.innerHTML = html;
                    }
                })
            }
        })
    })
    modal_restaurant.classList.add('is-active');
}


// FILTER

function load_data_conditions(collection_name, field, operator, val) {

    let query = db.collection(`${collection_name}`).where(field, operator, val);

    let test_allergies = document.querySelectorAll('.test_allergies');

    var val2;

    test_allergies.forEach(rad => {
        if (rad.checked == true) {
            // query = db.collection("restaurants").where("best", "==", rad.value).get().then(response => {
            val2 = rad.value;
            // })
        }
    })

    query = db.collection("restaurants").where("best", "==", val);

    query.get().then((response) => {
        let docs = response.docs;
        let html = '';

        if (docs.length == 0) {
            restaurant_data.innerHTML = "Search yielded no results";
            restaurantslength.innerHTML = 'No results';
        }

        if (docs.length == 1) {
            restaurantslength.innerHTML = `${docs.length}` + ' result';

        }

        if (docs.length > 1) {
            restaurantslength.innerHTML = `${docs.length}` + ' results';

        }

        docs.forEach(doc => {
            // console.log(doc.data().title, "=>", doc.data().description);
            let rating = '';
            for (let i = 0; i < doc.data().best_rating; i++) {
                if(doc.data().best_rating-i < 1){
                    if(doc.data().best_rating-i >= 0.5){
                        rating += `<i class="fas fa-star-half has-text-warning"></i>`;
                    }
                }else{
                    rating += `<i class="fas fa-star has-text-warning"></i>`;
                }
            }

            html +=
                `<div class="card large mb-4" id="${doc.id}" onclick="load_modal('${doc.id}')">
                <!-- IMAGE -->
                <div class="card-image">
                    <figure class="image is-16by9">
                    <img src="images/restaurant2.jpeg" alt="Restaurant" style="object-fit: cover;">
                    </figure>
                </div>
                <!-- CONTENT -->
                <div class="card-content">
                    <div class="media">
                        <div class="content">
                            <h1 class="title has-text-weight-bold has-text-primary is-4 mb-1"
                            style="font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif">${doc.data().name}</h1>
                            ${rating}
                            <p class="subtitle is-6 mt-1"><b>${doc.data().best}</b></p>
                            <p class="subtitle is-6 mb-0"><b>Address: </b>${doc.data().address}, Madison, WI 53703</p>
                            <p class="subtitle is-6 mb-0"><b>Hours: </b>8AM – 10PM</p>
                            <p class="subtitle is-6"><b>Phone: </b>${doc.data().phone}</p>
                        </div>
                    </div>
                </div>
            </div>   
            `;
        })
        // append content to the content variable
        restaurant_data.innerHTML = html;
    })
}

// LOAD RESTAURANTS 
function load_restaurants() {
    db.collection("restaurants").get().then((response) => {
        let docs = response.docs;
        let html = '';
        
        // console.log("loading restaurants");
        if (docs.length == 0) {
            restaurant_data.innerHTML = "Search yielded no results";
            restaurantslength.innerHTML = 'No results';
        }

        if (docs.length == 1) {
            restaurantslength.innerHTML = `${docs.length}` + ' result';

        }

        if (docs.length > 1) {
            restaurantslength.innerHTML = `${docs.length}` + ' results';

        }

        docs.forEach(doc => {
            if (docs.length != 0) {

                // restaurantslength.innerHTML = `${load_data_conditions('restaurants', 'name', '==', 'Mediterranean Cafe').length}` + "Results";
                
                let rating = '';
                for (let i = 0; i < doc.data().best_rating; i++) {
                    if(doc.data().best_rating-i < 1){
                        if(doc.data().best_rating-i >= 0.5){
                            rating += `<i class="fas fa-star-half has-text-warning"></i>`;
                        }
                    }else{
                        rating += `<i class="fas fa-star has-text-warning"></i>`;
                    }
                }

                html +=
                    `<div class="card large mb-4" id="${doc.id}" onclick="load_modal('${doc.id}')">
                    <!-- IMAGE -->
                    <div class="card-image">
                        <figure class="image is-16by9">
                        <img src="images/restaurant2.jpeg" alt="Restaurant" style="object-fit: cover;">
                        </figure>
                    </div>
                    <!-- CONTENT -->
                    <div class="card-content">
                        <div class="media">
                            <div class="content">
                                <h1 class="title has-text-weight-bold has-text-primary is-4 mb-1"
                                style="font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif">${doc.data().name}</h1>
                                ${rating}
                                <p class="subtitle is-6 mt-1"><b>${doc.data().best}</b></p>
                                <p class="subtitle is-6 mb-0"><b>Address: </b>${doc.data().address}, Madison, WI 53703</p>
                                <p class="subtitle is-6 mb-0"><b>Hours: </b>8AM – 10PM</p>
                                <p class="subtitle is-6"><b>Phone: </b>${doc.data().phone}</p>
                            </div>
                        </div>
                    </div>
                </div>`

            } else {
                html =
                    `<div class="has-text-centered has-text-weight-bold has-text-grey-light my-6 signedincontent">
                <i class="fas fa-seedling is-size-4 mr-2"></i>
                <p>No restaurants currently available!</p>
                </div>`;

            }
        })


        // append content to the content variable
        restaurant_data.innerHTML = html;
    })
}

// SUBMIT REVIEWS TO FIREBASE

review_form.addEventListener('submit', (e) => {
    e.preventDefault();
    configure_message_bar("Review successfully submitted!");

    // grab values
    let restaurantname = document.querySelector('#restaurant_list').value;
    let needs = document.querySelector('#user_needs').value;
    let rating = document.querySelector('#rating').value;
    let comments = document.querySelector('#comments').value;

    // upload the image
    let file = document.querySelector('#image').files[0];
    // set timestamp as img filename
    let image = new Date() + "_" + file.name;

    const task = ref.child(image).put(file);

    task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {

            let restaurantid = '';

            db.collection("restaurants").get().then((response) => {
                let docs = response.docs;
                docs.forEach(doc => {

                    if (restaurantname == doc.data().name) {
                        restaurantid = doc.id;
                        console.log(`${restaurantid} then ${doc.id}`);
                        let review = {
                            restaurant: restaurantid,
                            needs: needs,
                            rating: rating,
                            comments: comments,
                            url: url,
                            user_email: auth.currentUser.email
                        };

                        submit_review('reviews', review);

                        // // load data from firestore
                        // *UNCOMMENT AFTER MAKING THE BELOW FUNCTION
                    }
                })
            })


        })
})

// search functionality

search_button.addEventListener('click', () => {

    let search_bar = document.querySelector('#search_bar').value;
    // console.log(search_bar);
    if (search_bar.length == 0){
        console.log("Enter search keywords!");
    }else{
        // grab the customized data from firebase

        db.collection('restaurants').where('name', '==', search_bar).get().then((data) => {

            let restaurants1 = data.docs;
            // empty the content div
            restaurant_data.innerHTML = "";
            //  does not show the number of restaurants when you manually search
            restaurantslength.innerHTML = "";

            // console.log("loading search");
            if (restaurants1.length == 0) {
                restaurant_data.innerHTML = "Search yielded no results";
                restaurantslength.innerHTML = 'No results';
            }

            if (restaurants1.length == 1) {
                restaurantslength.innerHTML = `${restaurants1.length}` + ' result';

            }

            if (restaurants1.length > 1) {
                restaurantslength.innerHTML = `${restaurants1.length}` + ' results';

            }

            // loop through the array
            restaurants1.forEach((doc) => {
                let rating = '';
                for (let i = 0; i < doc.data().best_rating; i++) {
                    if(doc.data().best_rating-i < 1){
                        if(doc.data().best_rating-i >= 0.5){
                            rating += `<i class="fas fa-star-half has-text-warning"></i>`;
                        }
                    }else{
                        rating += `<i class="fas fa-star has-text-warning"></i>`;
                    }
                }
                restaurant_data.innerHTML += `
                <div class="card large mb-4" id="${doc.id}" onclick="load_modal('${doc.id}')">
                    <!-- IMAGE -->
                    <div class="card-image">
                        <figure class="image is-16by9">
                        <img src="images/restaurant2.jpeg" alt="Restaurant" style="object-fit: cover;">
                        </figure>
                    </div>
                    <!-- CONTENT -->
                    <div class="card-content">
                        <div class="media">
                            <div class="content">
                                <h1 class="title has-text-weight-bold has-text-primary is-4 mb-1"
                                style="font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif">${doc.data().name}</h1>
                                ${rating}
                                <p class="subtitle is-6 mt-1"><b>${doc.data().best}</b></p>
                                <p class="subtitle is-6 mb-0"><b>Address: </b>${doc.data().address}, Madison, WI 53703</p>
                                <p class="subtitle is-6 mb-0"><b>Hours: </b>8AM – 10PM</p>
                                <p class="subtitle is-6"><b>Phone: </b>${doc.data().phone}</p>
                            </div>
                        </div>
                    </div>
                </div>   
                `;
            })
        })
    }
})

reset_button.addEventListener('click', () => {
    load_restaurants();
    // uncheck all radio buttons
    let test_allergies = document.querySelectorAll('.test_allergies');
    test_allergies.forEach(rad => {
        if (rad.checked == true) {
            rad.checked = false;
        }
    })
    if (search_bar.length !== 0){
        document.querySelector('#search_bar').value = '';
    }
})


function configure_restaurant_names() {
    let spantags = document.querySelectorAll('.card .media .content span');
    // console.log(spantags);
    spantags.forEach(sptag => {
        // console.log(sptag.id);
        // alert(sptag.id);
        db.collection('restaurants').doc(`${sptag.id}`).get().then(response => {
            // console.log(response.id);
            // console.log(response.data().name);
            document.getElementById(`${sptag.id}`).innerHTML = response.data().name;
        })
    })


}

// display user's recommended restaurants

function load_recommended() {
    let html = '';
    db.collection("users").get().then((response) => {
        let users = response.docs;
        // from doc to html
        users.forEach(user => {
            // check if doc.id == user uid
            if (user.id == firebase.auth().currentUser.uid) {
                
                //for every interest, append to html
                user.data().interests.forEach(need => {
                    // load restaurants that match the need
                    db.collection("restaurants").where("best","==",need).get().then((response) => {
                        let docs = response.docs;
                        docs.forEach(doc => {
                            let rating = '';
                            for (let i = 0; i < doc.data().best_rating; i++) {
                                if(doc.data().best_rating-i < 1){
                                    if(doc.data().best_rating-i >= 0.5){
                                        rating += `<i class="fas fa-star-half has-text-warning"></i>`;
                                    }
                                }else{
                                    rating += `<i class="fas fa-star has-text-warning"></i>`;
                                }
                            }
                            html += `
                            <div class="card large mb-4" id="${doc.id}" onclick="load_modal('${doc.id}')">
                                <!-- IMAGE -->
                                <div class="card-image">
                                    <figure class="image is-16by9">
                                    <img src="images/restaurant2.jpeg" alt="Restaurant" style="object-fit: cover;">
                                    </figure>
                                </div>
                                <!-- CONTENT -->
                                <div class="card-content">
                                    <div class="media">
                                        <div class="content">
                                            <h1 class="title has-text-weight-bold has-text-primary is-4 mb-1"
                                            style="font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif">${doc.data().name}</h1>
                                            ${rating}
                                            <p class="subtitle is-6 mt-1"><b>${doc.data().best}</b></p>
                                            <p class="subtitle is-6 mb-0"><b>Address: </b>${doc.data().address}, Madison, WI 53703</p>
                                            <p class="subtitle is-6 mb-0"><b>Hours: </b>8AM – 10PM</p>
                                            <p class="subtitle is-6"><b>Phone: </b>${doc.data().phone}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>   
                            `;
                            // console.log("first"); // works
                            
                        })
                        // console.log("second"); // works
                    }).then(function(){
                        // console.log("third"); // doesnt work
                    });

                    
                })
                
            }
        })
        
    }).then(function(){
        setTimeout(() => {
            // console.log("fourth"); // doesnt work
            recommended.innerHTML = html;
        }, 2000)
    })
}

// function load_recommended() {
//     db.collection("users").get().then((response) => {
//         let uses = response.docs;
//         uses.forEach(use => {
        
//             console.log("fourth");
//         })
        
//     })
// }


// display user's own reviews

let my_review = document.querySelector('#my_reviews');

function load_own_reviews() {
    let docs = "";
    db.collection('reviews').where('user_email', '==', auth.currentUser.email).get().then((data) => {
        let reviews1 = data.docs;
        db.collection('restaurants').get().then(response => {
            docs = response.docs;

        });
        let html = ``;
        my_review.innerHTML = "";
        reviews1.forEach((doc) => {
            // db.collection('restaurants').doc(doc.data().restaurant).get().then(response => {
            //     alert(response.data().name);
            // })
            html += `
            <div class="card large mb-4">
                <div class="card-content">
                    <div class="media">
                        <div class="content">
                            <h1 class="has-text-weight-bold has-text-dark is-size-5 mb-2"
                                style="font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif">${doc.data().user_email}</h1>
                            <p class="subtitle is-6 mt-1"><b>Restaurant:&nbsp; </b><span id="${doc.data().restaurant}"></span></p>`;

            html += `<p class="subtitle is-6 mt-1"><b>Rating:&nbsp; </b>${doc.data().rating}</p>
                            <p class="subtitle is-6 mt-1"><b>Rated for:&nbsp; </b>${doc.data().needs}</p>
                            <p class="subtitle is-6 mt-2">${doc.data().comments}</p>
                        </div>
                    </div>
                </div>
            </div>
            `;
            my_review.innerHTML = html;
        })

        setTimeout(() => {
            configure_restaurant_names();
        }, 500)
    })
}


// RATE
openrate.forEach((button) => {
    button.addEventListener('click', () => {
        // console.log("forEach worked");
        modal_rate.classList.add('is-active');
    });
});
closerate.forEach((button) => {
    button.addEventListener('click', () => {
        // console.log("forEach worked");
        modal_rate.classList.remove('is-active');
    });
});

// RESTAURANT
openrestaurant.forEach((button) => {
    button.addEventListener('click', () => {
        // console.log("forEach worked");
        modal_restaurant.classList.add('is-active');
        // CONFIGURE RESTAURANT MODAL DEPENDING ON RESTAURANT CARD ID

    });
});
closerestaurant.forEach((button) => {
    button.addEventListener('click', () => {
        // console.log("forEach worked");
        modal_restaurant.classList.remove('is-active');
    });
});

// HOME
openhome.forEach((button) => {
    button.addEventListener('click', () => {
        // console.log("forEach worked");
        // home.classList.add('is-hidden');
        hideVisible();
        hideHover();
        home.classList.remove('is-hidden');
        addHover(link_home);
        // console.log("Page loaded successfully");
    });
});

// DISCOVER
opendiscover.forEach((button) => {
    button.addEventListener('click', () => {
        // console.log("forEach worked");
        hideVisible();
        hideHover();
        discover.classList.remove('is-hidden');
        addHover(link_discover);
        // home.classList.add('is-hidden');
    });
});

// ABOUT US
openaboutus.forEach((button) => {
    button.addEventListener('click', () => {
        // console.log("forEach worked");
        hideVisible();
        hideHover();
        about_us.classList.remove('is-hidden');
        addHover(link_about_us);
        // home.classList.add('is-hidden');
    });
});

// LOG IN
openlogin.forEach((button) => {
    button.addEventListener('click', () => {
        // console.log("forEach worked");
        hideVisible();
        hideHover();
        log_in.classList.remove('is-hidden');
    });
});

// SIGN UP
opensignup.forEach((button) => {
    button.addEventListener('click', () => {
        // console.log("forEach worked");
        hideVisible();
        hideHover();
        sign_up.classList.remove('is-hidden');
    });
});

// PERSONALIZE
// openpersonalize.forEach((button) => {
//     button.addEventListener('click', () => {
//         // console.log("forEach worked");
//         hideVisible();
//         hideHover();
//         personalize.classList.remove('is-hidden');
//     });
// });

// SIGN UP USERS

const signup_form = document.querySelector('#signup_form');

// ATTACH SUBMIT EVENT ON FORM
signup_form.addEventListener('submit', (e) => {
    //prevent auto refresh on the page
    e.preventDefault();

    // grab email and password
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    let interests = [];
    // grab interests
    let user_interests = document.querySelectorAll('.user_interests');

    user_interests.forEach(user_interest => {
        if (user_interest.checked == true) {
            interests.push(user_interest.value);
        }
    })

    auth.createUserWithEmailAndPassword(email, password).then(credentials => {
        console.log(`UID: ${credentials.user.uid} Email: ${credentials.user.email} has signed up`);

        db.collection('users').doc(credentials.user.uid).set({
            interests: interests
        })

        // reset the form
        signup_form.reset();
        //open home page
        hideVisible();
        hideHover();
        home.classList.remove('is-hidden');


    }).catch(err => {
        // display error message on model
        // to prevent same email
        const error = document.querySelectorAll('.error');
        error.forEach((error) => {
            error.innerHTML = `<p>${err.message}</p>`;
        });
        // error.innerHTML = `<p>${err.message}</p>`;
        console.log(`<p>${err.message}</p>`);

        // hide error after 2 seconds
        setTimeout(() => {
            error.forEach((error) => {
                error.innerHTML = "";
            });
        }, 2000);
    })
});


// LOG OUT USERS

const logoutbtn = document.querySelector('#btn-log-out');

logoutbtn.addEventListener('click', () => {
    auth.signOut().then(() => {
        console.log("user signed out");
    })
})

// LOG IN USERS

const login_form = document.querySelector('#login_form');

login_form.addEventListener('submit', (e) => {

    e.preventDefault();
    // grab email and password
    const email = document.querySelector('#email_').value;
    const password = document.querySelector('#password_').value;

    // authenticate with firebase
    auth.signInWithEmailAndPassword(email, password).then(credentials => {
        console.log(`${credentials.user.email} is now signed in`);

        login_form.reset();

        // go back to home page
        hideVisible();
        hideHover();
        home.classList.remove('is-hidden');
        addHover(link_home);

    }).catch(err => {
        // display error message on model
        // to prevent same email
        const error = document.querySelectorAll('.error');
        error.forEach((error) => {
            error.innerHTML = `<p>${err.message}</p>`;
        });
        // error.innerHTML = `<p>${err.message}</p>`;
        console.log("error log in");

        // hide error after 2 seconds
        setTimeout(() => {
            error.forEach((error) => {
                error.innerHTML = "";
            });
        }, 2000)
    })
})

// WHEN USER LOGS IN/OUT, HIDE/SHOW ITEMS ACCORDINGLY

auth.onAuthStateChanged(user => {
    if (user) {
        // console.log(`${user.email} is now signed in`);
        configure_message_bar("The user is now signed in");
        // show user email address at the navigation bar
        document.querySelector('#user_email').innerHTML = user.email;

        // configure navigation bar
        configure_nav_bar(user);

        // review form lists restautants & needs
        list_restaurants();
        list_user_needs();

        // loads restaurants in discover page
        load_restaurants();

        // display own reviews in home page
        load_own_reviews();
        load_recommended();

    } else {
        // console.log('user is now signed out');
        configure_message_bar("The user is now signed out");
        // hide user email address from the navigation bar
        document.querySelector('#user_email').innerHTML = "";

        // configure navigation bar
        configure_nav_bar();

        // set content div to users have to be signed in
        signedincontent.forEach((div) => {
            div.innerHTML =
                `<div class="has-text-centered has-text-weight-bold has-text-grey-light my-6 signedincontent">
            <i class="fas fa-sign-in-alt is-size-4 mr-2"></i>
            <p>Sign in to see content!</p>
            </div>`;
        });

    }
})