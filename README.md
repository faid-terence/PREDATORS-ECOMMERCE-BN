[![Node.js CI](https://github.com/atlp-rwanda/ecommerce-app-predators-bn/actions/workflows/node.js.yml/badge.svg)](https://github.com/atlp-rwanda/ecommerce-app-predators-bn/actions/workflows/node.js.yml)
<a href="https://codeclimate.com/github/atlp-rwanda/ecommerce-app-predators-bn/maintainability"><img src="https://api.codeclimate.com/v1/badges/f43b1bf0f2429d8e6ad6/maintainability" /></a> 

[![Coverage Status](https://coveralls.io/repos/github/atlp-rwanda/ecommerce-app-predators-bn/badge.svg?branch=develop)](https://coveralls.io/github/atlp-rwanda/ecommerce-app-predators-bn?branch=develop)
# ecommerce-app-predators-bn


This is a full-stack ecommerce website built using Node.js, Express,Postgres

## Features
User authentication: Users can create an account, log in, and log out.
Product catalog: Users can view a list of products and see details for each product,
 including images, descriptions, and prices.
Shopping cart: Users can add products to their cart, view their cart, and remove products from their cart.
Checkout: Users can complete a checkout process to purchase the products in their cart.
Admin panel: Admin users can manage products, view orders, and update the website settings.



## Usage
Browse the product catalog and add items to your shopping cart.
Sell and market your product
Proceed to checkout and enter your shipping and payment details.
Confirm your order and view your order history.

## Installation & required steps

Make sure you have Node.js and Postgres installed on your computer, If you don't have Postgres installed locally,
you can use cloud database service such as https://www.elephantsql.com/ to create the databases

Clone this repository using the command : `git clone`
Navigate to the project directory using the command: `cd ecommerce-app-predators-bn`
Install dependencies by running : `npm install`
Create a PostgreSQL database and update the config/config.js file with your database credentials.
Run the database migrations using Sequelize by running the following command: `npm run migrate`
Start the application by running: `npm run dev` 

## Docker
Docker is a software platform that allows you to build, test, and deploy applications quickly
run Docker: `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build`



## Technologies Used
To successfully navigate the codebase of the project, you will need an understanding of the following technologies that are being used to develop this application

Node.js
Express.js
Express
Docker
Postgres

## Contributing

Contributions are welcome! If you have any suggestions or find any bugs, please create an issue or follow these steps:
Fork the repository,
Create a new branch: `git checkout -b feature-name`
Make your changes and commit them: `git commit -m "Your commit message"`
Push your changes to the branch: `git push origin feature-name`
Create a pull request.

### Migration:
- Run migrate script to migrate db, use this command: `npm run migrate`
- Run seed script to add seeds into the table, use this command: `npm run seed`
- Run unseed script to remove seeds, use this command: `npm run unseed`
- Run down script to reset the database, use this command: `npm run down`

## Deployed link of the ecommerce-app-predators
https://talented-wig-goat.cyclic.app/

This project is licensed under the MIT License. See the LICENSE file for details.


## Authors