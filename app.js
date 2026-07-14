//? Question 1:
// Create a MySQL database by the name "myDB" and create a database user by the name "myDBuser" with a permissions to connect with the "myDB" database. Use the "mysql" module to create a connection with the newly created database. Display console message if the connection is successful or if it has an error.

// importing the necessary  modules 
const myExpress = require("express");
const mysql2Module = require ("mysql2");




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

const pool = mysql2Module.createPool({
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
pool.getConnection((err, connection) => {
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
