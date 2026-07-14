//? Question 1:
// Create a MySQL database by the name "myDB" and create a database user by the name "myDBuser" with a permissions to connect with the "myDB" database. Use the "mysql" module to create a connection with the newly created database. Display console message if the connection is successful or if it has an error.

// importing the necessary  modules
const myExpress = require("express");
const mysql2Module = require("mysql2");

/*
 * Connect a Node.js application to a MySQL database using a CONNECTION POOL.
 * Why a pool?
 * Instead of creating one database connection that stays busy, a pool creates and manages multiple reusable connections.
 * This is the preferred approach in modern Express applications.
 */
/*
 * Create a Connection Pool.
 *
 * Think of a connection pool as a small collection of reusable
 * database connections.
 *
 * Instead of creating one new connection every time,
 * Node.js borrows one from the pool,
 * uses it,
 * then returns it back to the pool.
 *
 * This is faster and is the preferred method in modern applications.
 ***********************************************************************/

/***********************************************************************
 * STEP 2
 * Create a Connection Pool.
 *
 * Think of a pool as a parking lot of database connections.
 *
 *         Connection 1
 *         Connection 2
 * Pool -> Connection 3
 *         Connection 4
 *         Connection 5
 *
 * Whenever Node.js needs the database,
 * it borrows one available connection.
 *
 * After finishing,
 * the connection is returned to the pool
 * instead of being destroyed.
 */

const connectionPool = mysql2Module.createPool({
  // Address of the MySQL server.
  // Since MySQL is installed on this computer,
  // localhost points to our own machine.
  host: "localhost",

  // Database username.
  user: "myDBuser",

  // Password for that MySQL user.
  password: "6789",

  // Database we want to work with.
  database: "myDB",

  /***************************************************************
   * Maximum number of simultaneous connections.
   *
   * If 10 connections are already being used,
   * additional requests wait until one becomes available.
   ***************************************************************/
  connectionLimit: 10,

  /***************************************************************
   * waitForConnections
   *
   * true
   * ----
   * If every connection is busy,
   * wait until one becomes available.
   *
   * false
   * -----
   * Immediately throw an error.
   ***************************************************************/
  //   waitForConnections: true,

  /***************************************************************
   * queueLimit
   *
   * 0 means:
   * Unlimited waiting requests.
   *
   * Example:
   *
   * Pool size = 10
   *
   * Request 11
   * Request 12
   * Request 13
   *
   * These requests simply wait.
   ***************************************************************/
  //   queueLimit: 0,
});

/***********************************************************************
 * STEP 3
 * Test whether the pool can successfully connect.
 *
 * getConnection()
 *
 * This asks the pool:
 *
 * "Please give me one available connection."
 * * STEP 3
 * Ask the pool for one available connection.
 *
 * If the connection is successful,
 * MySQL gives us one connection from the pool.
 ***********************************************************************/
connectionPool.getConnection((err, connection) => {
  /***************************************************************
   * If an error occurs,
   * print the error and stop.
   ***************************************************************/
  if (err) {
    console.error("Database connection failed.");
    console.error(err);

    return;
  }

  /***************************************************************
   * If we reach here,
   * Node.js successfully connected to MySQL.
   *  If there is no error,
   * the connection was successful.
   ***************************************************************/
  console.log("Successfully connected to MySQL!");

  /***************************************************************
   *
   * ***************************************************************
   * IMPORTANT
   *
   * Return the connection back to the pool.
   *
   * We DO NOT use:
   *
   * connection.end();
   *
   * because we want the pool to reuse this connection later.
   * VERY IMPORTANT
   *
   * We DO NOT close the connection.
   *
   * Instead we return it to the pool.
   *
   * Wrong:
   *
   * connection.end();
   *
   * Correct:
   *
   * connection.release();
   *
   * This allows the pool to reuse it later.
   ***************************************************************/
  connection.release();
});

//? Question 2:
// Here is a link to a document that contains the tables we need to create and convert the apple.com/iphone's page into a dynamic page with a database. As you can see from the document, there are 5 tables that are needed (please scroll horizontally and vertically over the document to see all the 5 tables). Write a SQL query to create the apple.com tables inside of the "myDB" database you created above. Once you write the queries, use the "mysql" module to execute the queries on the database. Try both of these methods to initiate the execution of the queries: ● Include the execution code directly in the module to be executed as you run the app                              ● Use the Express module to receive requests. Configure your module in a way that it executes the queries when the "/install" URL is visited.

/*
 * Goal:
 * Create database tables using SQL queries
 * when the user visits: http://localhost:3001/install
 *
 *  * Tables:
 *
 * 1. products
 * 2. productDescription
 * 3. productPrice
 * 4. users
 * 5. orders
 */

// Create an Express application (our server object)
const app = myExpress();

/***********************************************************************
 * INSTALL ROUTE
 *
 * When somebody visits:
 *
 * localhost:3001/install
 *
 * this function will run.
 *
 * Inside this route, we will execute SQL queries
 * that create our database tables.
 ***********************************************************************/

app.get("/install", (req, res) => {
  /*******************************************************************
   * TABLE 1
   *
   * products table
   *
   * This is the main table.
   *
   * Other tables will connect to this table using Product_id.
   *******************************************************************/

  const productsTable = `

        CREATE TABLE products (

            Product_id INT AUTO_INCREMENT PRIMARY KEY,

            product_url VARCHAR(255),

            product_name VARCHAR(100)

        )

    `;

  /*******************************************************************
   * TABLE 2
   *
   * Product Description table
   *
   * Product_id is a FOREIGN KEY.
   *
   * It connects this table with products table.
   *******************************************************************/

  const productDescriptionTable = `

        CREATE TABLE productDescription (

            Description_id INT AUTO_INCREMENT PRIMARY KEY,

            Product_id INT,

            Product_brief_description TEXT,

            Product_description TEXT,

            Product_img VARCHAR(255),

            Product_link VARCHAR(255),


            FOREIGN KEY(Product_id)

            REFERENCES products(Product_id)

        )

    `;

  /*******************************************************************
   * TABLE 3
   *
   * Product Price table
   *
   * Stores pricing information.
   *******************************************************************/

  const productPriceTable = `

        CREATE TABLE productPrice (

            Price_id INT AUTO_INCREMENT PRIMARY KEY,

            Product_id INT,

            Starting_price VARCHAR(50),

            Price_range VARCHAR(255),


            FOREIGN KEY(Product_id)

            REFERENCES products(Product_id)

        )

    `;

  /*******************************************************************
   * TABLE 4
   *
   * Users table
   *
   * Needed because orders belong to users.
   *******************************************************************/

  const usersTable = `

        CREATE TABLE users (

            User_id INT AUTO_INCREMENT PRIMARY KEY,

            User_name VARCHAR(100),

            User_password VARCHAR(100)

        )

    `;

  /*******************************************************************
   * TABLE 5
   *
   * Orders table
   *
   * This connects:
   *
   * User  ---> Order
   *
   * Product ---> Order
   *
   *******************************************************************/

  const ordersTable = `

        CREATE TABLE orders (

            Order_id INT AUTO_INCREMENT PRIMARY KEY,

            Product_id INT,

            User_id INT,


            FOREIGN KEY(Product_id)

            REFERENCES products(Product_id),


            FOREIGN KEY(User_id)

            REFERENCES users(User_id)

        )

    `;

  /*******************************************************************
   *
   * Execute all queries one after another.
   *
   * Why this order?
   *
   * Because foreign keys require the parent table to exist first.
   *
   * Example:
   *
   * orders.Product_id references products.Product_id
   *
   * Therefore:
   *
   * products MUST exist before orders.
   *
   *******************************************************************/

  connectionPool.query(productsTable, (err) => {
    if (err) {
      console.log(err);
      res.send("Error creating products table");

      return;
    }

    console.log("Products table created");

    connectionPool.query(productDescriptionTable, (err) => {
      if (err) {
        console.log(err);
        res.send("Error creating description table");

        return;
      }

      console.log("Product Description table created");

      connectionPool.query(productPriceTable, (err) => {
        if (err) {
          console.log(err);
          res.send("Error creating price table");

          return;
        }

        console.log("Product Price table created");

        connectionPool.query(usersTable, (err) => {
          if (err) {
            console.log(err);
            res.send("Error creating users table");

            return;
          }

          console.log("Users table created");

          connectionPool.query(ordersTable, (err) => {
            if (err) {
              console.log(err);
              res.send("Error creating orders table");

              return;
            }

            console.log("Orders table created");

            res.send("All tables created successfully!");
          });
        });
      });
    });
  });
});

//? the professional way  of keeping the order 
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



// Start Express Server
app.listen(3001, () => {
  console.log("Server running on port 3001");
});


//? Question 3: 
// Create an HTML file called, “index.html” with a form to populate the "products" table you created above.
// ● The form on the HTML page should send a POST request to a URL named "/add-product"
// ● Use Express to receive the POST request
// ● Use the body-parser module to parse the POST request sent to your Express server
// ● Write a SQL query to insert the data received from the HTML form into the "products" table
