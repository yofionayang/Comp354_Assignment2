QuickBite

QuickBite is a small web prototype of an online ordering and pickup platform for independent restaurants. It was built by a four-person team using Scrum for COMP 354 Assignment 2. This is the Sprint 1 Increment, not a complete product.

How to run

No installation or build step is needed. The app is plain HTML, CSS, and JavaScript.

Clone the repository:
   git clone https://github.com/yofionayang/Comp354_Assignment2.git
   cd Comp354_Assignment2
Open index.html in a web browser (on a Mac: open index.html).

Optional: to serve it from a local web server instead, run python3 -m http.server 8000 and go to http://localhost:8000.

What is implemented (Sprint 1)
  - Browse restaurants: a list of participating restaurants with name, cuisine, and estimated time, with a clear message if the list is empty.  
  - View menu: click a restaurant to see its menu grouped by category with prices. Unavailable items are marked and cannot be added.
  - Add to cart: add items to the cart; adding the same item again increases its quantity. A cart can only hold items from one restaurant.
  - Cart panel: shows the items and quantities, with a Remove button for each item and a Clear cart button.
Not yet implemented
  - Cart totals and quantity +/- controls (rest of PBI-05)
  - Pickup time selection (PBI-06)
  - Placing an order and order confirmation (PBI-07)
  - Restaurant-side order list and status updates (PBI-08, PBI-09)
  - Customer order status (PBI-10)
  - Filtering restaurants by cuisine (PBI-12)
    
Project structure

File	           Purpose
index.html	   Page layout and styles
script.js	     Data, shared state, routing, and the restaurant list, menu, and cart features

script.js is organized in numbered sections (data, utilities, state, router, panels, features, start). Each feature registers its own view or panel in the features section, so team members could work on separate branches with few merge conflicts.

Team workflow
  - Work is done on feature branches (for example feature/pbi-03-restaurant-menu) created from main.
  - Changes are merged into main through pull requests, reviewed by a teammate other than the author.
  - Work is tracked on the team's GitHub Project board (Product Backlog and Sprint 1 Backlog).

    
Team
Role	                               Member
------------------------------------------------------
Product Owner / Developer	         Yu Par Aung
Scrum Master / Developer	         Evan Champagne
Developer	                         Daniel Tehrani
Developer	                         Mark Rudko
