# LightBnB Project

## About
LightBNB is a simple AirBNB clone. It uses Javascript, Express, and PostgreSQL. 

Users can log in, search and filter properties by ratings and cost, and track their own properties and reservations.

## Dependencies
```
  "bcrypt": "^3.0.6",
  "cookie-session": "^1.3.3",
  "express": "^4.17.1",
  "nodemon": "^1.19.1",
  "pg": "^8.11.1"
```

## To Run
``cd LightBnB/LightBnB_WebApp-master``
``npm run local``

## Project Structure

```
.
├── db
│   ├── json
│   └── database.js
├── public
│   ├── javascript
│   │   ├── components 
│   │   │   ├── header.js
│   │   │   ├── login_form.js
│   │   │   ├── new_property_form.js
│   │   │   ├── property_listing.js
│   │   │   ├── property_listings.js
│   │   │   ├── search_form.js
│   │   │   └── signup_form.js
│   │   ├── libraries
│   │   ├── index.js
│   │   ├── network.js
│   │   └── views_manager.js
│   ├── styles
│   │   ├── main.css
│   │   └── main.css.map
│   └── index.html
├── routes
│   ├── apiRoutes.js
│   └── userRoutes.js
├── styles  
│   ├── _forms.scss
│   ├── _header.scss
│   ├── _property-listings.scss
│   └── main.scss
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── server.js
```

* `db` contains all the database interaction code.
  * `json` is a directory that contains a bunch of dummy data in `.json` files.
  * `database.js` is responsible for all queries to the database. It doesn't currently connect to any database, all it does is return data from `.json` files.
* `public` contains all of the HTML, CSS, and client side JavaScript. 
  * `index.html` is the entry point to the application. It's the only html page because this is a single page application.
  * `javascript` contains all of the client side javascript files.
    * `index.js` starts up the application by rendering the listings.
    * `network.js` manages all ajax requests to the server.
    * `views_manager.js` manages which components appear on screen.
    * `components` contains all of the individual html components. They are all created using jQuery.
* `routes` contains the router files which are responsible for any HTTP requests to `/users/something` or `/api/something`. 
* `styles` contains all of the sass files. 
* `server.js` is the entry point to the application. This connects the routes to the database.

## Project Screenshots

##### Users can sign up or sign in to get access to search and view their own listings and reservations

![Search](https://github.com/nahcg/lightBnB/blob/master/images/search.png)
##### Search function allows users to filter on cost, ratings and location

![Filtered Search Results](https://github.com/nahcg/lightBnB/blob/master/images/filteredsearchresult.png)
##### Filtered search results

![Create Listing](https://github.com/nahcg/lightBnB/blob/master/images/createlisting.png)
##### Users create their own listings

![User's Own Listings](https://github.com/nahcg/lightBnB/blob/master/images/mylisting.png)
##### Users can track their own listings

![User's Own Reservations](https://github.com/nahcg/lightBnB/blob/master/images/myreservations.png)
### Users can track their own reservations