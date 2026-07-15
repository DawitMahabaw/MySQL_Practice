//? Question 1:
// Create a MySQL database by the name "myDB" and create a database user by the name "myDBuser" with a permissions to connect with the "myDB" database. Use the "mysql" module to create a connection with the newly created database. Display console message if the connection is successful or if it has an error.

// importing the necessary  modules
const myExpress = require("express");
const mysql2Module = require("mysql2");

// creates and manages actual database connections
const connectionPool = mysql2Module.createPool({
  host: "localhost",
  user: "myDBuser",
  password: "6789",
  database: "myDB",
  connectionLimit: 10,
  // Maximum number of simultaneous connections.
  // waitForConnections: true,
  // queueLimit: 0,
});

// borrowing connections 
connectionPool.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed.");
    console.error(err);
    return;
  }
  console.log("Successfully connected to MySQL!");
  connection.release();
  // Return the connection back to the pool. It allows the pool to reuse it later.
});



//? Question 2:
// Here is a link to a document that contains the tables we need to create and convert the apple.com/iphone's page into a dynamic page with a database. As you can see from the document, there are 5 tables that are needed (please scroll horizontally and vertically over the document to see all the 5 tables). Write a SQL query to create the apple.com tables inside of the "myDB" database you created above. Once you write the queries, use the "mysql" module to execute the queries on the database. Try both of these methods to initiate the execution of the queries: ● Include the execution code directly in the module to be executed as you run the app                              ● Use the Express module to receive requests. Configure your module in a way that it executes the queries when the "/install" URL is visited.

/*
 * Create database tables using SQL queries when the user visits: http://localhost:3001/install
 */

// Create an Express application (our server object)
const app = myExpress();

// creating the install route
//When somebody visits localhost:3001/install --> the function inside the route will run.
// TABLE 1 is the main table. Other tables will connect to this table using Product_id

app.get("/install", (req, res) => {
  const productsTable = `
        CREATE TABLE products (
            Product_id INT AUTO_INCREMENT PRIMARY KEY,
            product_url VARCHAR(255),
            product_name VARCHAR(100)
        )`;

  // Product_id is a FOREIGN KEY. It connects this table with products table.
  const productDescriptionTable = `
        CREATE TABLE productDescription (
            Description_id INT AUTO_INCREMENT PRIMARY KEY,
            Product_id INT,
            Product_brief_description TEXT,
            Product_description TEXT,
            Product_img VARCHAR(255),
            Product_link VARCHAR(255),

            FOREIGN KEY(Product_id) REFERENCES products(Product_id)
        )`;

  const productPriceTable = `
        CREATE TABLE productPrice (
            Price_id INT AUTO_INCREMENT PRIMARY KEY,
            Product_id INT,
            Starting_price VARCHAR(50),
            Price_range VARCHAR(255),

            FOREIGN KEY(Product_id) REFERENCES products(Product_id)
        )`;

  const usersTable = `
        CREATE TABLE users (
            User_id INT AUTO_INCREMENT PRIMARY KEY,
            User_name VARCHAR(100),
            User_password VARCHAR(100)
        )`;


  // This connects: User  ---> Order and Product ---> Order
  const ordersTable = `
        CREATE TABLE orders (
            Order_id INT AUTO_INCREMENT PRIMARY KEY,
            Product_id INT,
            User_id INT,

            FOREIGN KEY(Product_id) REFERENCES products(Product_id),

            FOREIGN KEY(User_id) REFERENCES users(User_id)
        ) `;

 

  // Execute all queries one after another.
  // Why this order? --> Because foreign keys require the parent table to exist first.
  connectionPool.query(productsTable, (err) => {
    if (err) {
      console.log(err);
      res.send("Error creating products table");
      return;
    } console.log("Products table created");

    connectionPool.query(productDescriptionTable, (err) => {
      if (err) {
        console.log(err);
        res.send("Error creating description table");
        return;
      } console.log("Product Description table created");

      connectionPool.query(productPriceTable, (err) => {
        if (err) {
          console.log(err);
          res.send("Error creating price table");
          return;
        } console.log("Product Price table created");

        connectionPool.query(usersTable, (err) => {
          if (err) {
            console.log(err);
            res.send("Error creating users table");
            return;
          } console.log("Users table created");

          connectionPool.query(ordersTable, (err) => {
            if (err) {
              console.log(err);
              res.send("Error creating orders table");
              return;
            }console.log("Orders table created");

            res.send("All tables created successfully!");
          });
        });
      });
    });
  });
});

// Start Express Server
app.listen(3001, () => {
  console.log("Server running on port 3001");
});


//? the professional way of keeping the order (async)
// try {
//     await pool.query(productsTable);
//     await pool.query(productDescriptionTable);
//     await pool.query(productPriceTable);
//     res.send("All tables created");
// }
// catch(err){
//     console.log(err);
//     res.send("Error creating tables");
// }



//? Question 3:
// Create an HTML file called, “index.html” with a form to populate the "products" table you created above.
// ● The form on the HTML page should send a POST request to a URL named "/add-product"
// ● Use Express to receive the POST request
// ● Use the body-parser module to parse the POST request sent to your Express server
// ● Write a SQL query to insert the data received from the HTML form into the "products" table



const bodyParser = require("body-parser");
const cors = require("cors");

// Enable middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// Creating thr post route
app.post("/add-product", (req, res) => {

  // Get data sent from HTML form
  const productName = req.body.product_name;
  const productUrl = req.body.product_url;

  const sql = `
    INSERT INTO products(product_name, product_url)
    VALUES (?,?)
    `;

  // Execute query
  connectionPool.query(sql, [productName, productUrl], (err, result) => {
    if (err) {
      console.log(err);
      res.send("Error inserting product");
      return;
    }

    console.log("Product inserted successfully");
    res.send("Product added successfully");
  });
});
