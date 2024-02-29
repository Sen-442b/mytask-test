const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json());




// Middleware
app.use(bodyParser.json());

// API endpoint to insert dummy data into the database
app.post('/api/customers/insert-dummy-data', async (req, res) => {
  try {
    // Dummy data
    const dummyData = [
            ['John Doe', 30, '123-456-7890', 'New York', new Date()],
            ['Alice Smith', 25, '987-654-3210', 'Los Angeles', new Date()],
            ['Bob Johnson', 35, '555-555-5555', 'Chicago', new Date()],
            ['John Doe', 30, '123-456-7890', 'New York', new Date()],
            ['Alice Smith', 25, '987-654-3210', 'Los Angeles', new Date()],
            ['Bob Johnson', 35, '555-555-5555', 'Chicago', new Date()],
            ['Mary Brown', 28, '111-222-3333', 'San Francisco', new Date()],
            ['David Lee', 40, '444-555-6666', 'Miami', new Date()],
            ['Jennifer Davis', 33, '777-888-9999', 'Seattle', new Date()],
            ['Michael Clark', 42, '222-333-4444', 'Boston', new Date()],
            ['Jessica White', 27, '666-777-8888', 'Dallas', new Date()],
            ['Matthew Taylor', 38, '999-111-2222', 'Houston', new Date()],
            ['Laura Martinez', 31, '333-444-5555', 'Phoenix', new Date()],
            ['Daniel Harris', 45, '888-999-0000', 'Philadelphia', new Date()],
            ['Sarah Thompson', 29, '444-555-6666', 'San Antonio', new Date()],
            ['Christopher Walker', 36, '111-222-3333', 'San Diego', new Date()],
            ['Amanda King', 34, '555-666-7777', 'Austin', new Date()],
            ['Ryan Garcia', 39, '222-333-4444', 'Jacksonville', new Date()],
            ['Rebecca Wright', 26, '777-888-9999', 'Indianapolis', new Date()],
            ['Joshua Hill', 37, '666-777-8888', 'San Jose', new Date()],
            ['Emily Scott', 32, '999-111-2222', 'Fort Worth', new Date()],
            ['Justin Green', 41, '333-444-5555', 'Columbus', new Date()],
            ['Nicole Adams', 30, '888-999-0000', 'Charlotte', new Date()],
            ['Kevin Baker', 43, '444-555-6666', 'Detroit', new Date()],
            ['Kayla Perez', 28, '111-222-3333', 'El Paso', new Date()],
            ['Brandon Rivera', 35, '555-666-7777', 'Memphis', new Date()],
            ['Hannah Mitchell', 44, '222-333-4444', 'Baltimore', new Date()],
            ['Tyler Carter', 27, '777-888-9999', 'Boston', new Date()],
            ['Samantha Turner', 40, '666-777-8888', 'Seattle', new Date()],
            ['Andrew Cooper', 33, '999-111-2222', 'Denver', new Date()],
            ['Lauren Morgan', 39, '333-444-5555', 'Washington', new Date()],
            ['Jacob Bell', 31, '888-999-0000', 'Nashville', new Date()],
            ['Olivia Murphy', 36, '444-555-6666', 'Las Vegas', new Date()],
            ['Jonathan Torres', 29, '111-222-3333', 'Louisville', new Date()],
            ['Stephanie Nelson', 42, '555-666-7777', 'Milwaukee', new Date()],
            ['Alexander Cook', 37, '222-333-4444', 'Portland', new Date()],
            ['Brittany Bennett', 34, '777-888-9999', 'Oklahoma City', new Date()],
            ['Zachary Ramirez', 41, '666-777-8888', 'Tucson', new Date()],
            ['Victoria Coleman', 38, '999-111-2222', 'Atlanta', new Date()],
            ['Dylan Reed', 35, '333-444-5555', 'Miami', new Date()],
            ['Megan Cooper', 43, '888-999-0000', 'Raleigh', new Date()],
            ['Cody Ward', 30, '444-555-6666', 'Kansas City', new Date()],
            ['Gabriella Richardson', 44, '111-222-3333', 'Long Beach', new Date()],
            ['Jesse Foster', 32, '555-666-7777', 'Virginia Beach', new Date()],
            ['Kaitlyn Cox', 45, '222-333-4444', 'Oakland', new Date()],
            ['Aaron Stewart', 28, '777-888-9999', 'Minneapolis', new Date()],
            ['Savannah Barnes', 39, '666-777-8888', 'Tampa', new Date()],
            ['Christian Howard', 36, '999-111-2222', 'Anaheim', new Date()],
            ['Grace Fisher', 29, '333-444-5555', 'Santa Ana', new Date()],
            ['Nathan Mitchell', 42, '888-999-0000', 'Pittsburgh', new Date()]
      // Add more dummy data as needed
    ];

    // Insert dummy data into the database
    await Promise.all(dummyData.map(async (data) => {
      const queryText = 'INSERT INTO customers (customer_name, age, phone, location, created_at) VALUES ($1, $2, $3, $4, $5)';
      await pool.query(queryText, data);
    }));

    res.status(201).send('Dummy data inserted successfully');
  } catch (error) {
    console.error('Error inserting dummy data:', error);
    res.status(500).send('Internal server error');
  }
});

// API endpoint to retrieve paginated records from the database
app.get('/api/customers', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const queryText = 'SELECT * FROM customers ORDER BY created_at DESC LIMIT $1 OFFSET $2';
    const { rows } = await pool.query(queryText, [limit, offset]);

    res.json(rows);
  } catch (error) {
    console.error('Error retrieving paginated records:', error);
    res.status(500).send('Internal server error');
  }
});

// API endpoint to implement search functionality based on name or location

// app.get('/api/customers/search', async (req, res) => {
//   try {
//     const searchTerm = req.query.q ? req.query.q.toLowerCase() : '';
//     if (!searchTerm.trim()) {
//       return res.status(400).json({ error: 'Search term is missing or empty' });
//     }
    
//     const queryText = 'SELECT * FROM customers WHERE LOWER(customer_name) LIKE $1 OR LOWER(location) LIKE $1';
//     const { rows } = await pool.query(queryText, [`%${searchTerm}%`]);

//     res.json(rows);
//   } catch (error) {
//     console.error('Error searching records:', error);
//     res.status(500).send('Internal server error');
//   }
// });
app.get('/api/customers/search', async (req, res) => {
  try {
    const searchTerm = req.query.q ? req.query.q.toLowerCase() : '';
    if (!searchTerm.trim()) {
      return res.status(400).json({ error: 'Search term is missing or empty' });
    }
    
    const queryText = 'SELECT * FROM customers WHERE LOWER(customer_name) LIKE $1 OR LOWER(location) LIKE $1';
    const { rows } = await pool.query(queryText, [`%${searchTerm}%`]);

    // Check the Accept header to determine the response format
    const acceptHeader = req.get('Accept');
    if (acceptHeader && acceptHeader.includes('text/html')) {
      // Respond with HTML
      res.send(generateHTML(rows));
    } else {
      // Respond with JSON
      res.json(rows);
    }
  } catch (error) {
    console.error('Error searching records:', error);
    res.status(500).send('Internal server error');
  }
});


// API endpoint to implement sorting functionality based on date or time
app.get('/api/customers/sort', async (req, res) => {
  try {
    const sortBy = req.query.sortBy || 'created_at'; // Default to sorting by created_at
    const sortOrder = req.query.sortOrder || 'ASC'; // Default to ascending order
    const queryText = `SELECT * FROM customers ORDER BY ${sortBy} ${sortOrder}`;
    const { rows } = await pool.query(queryText);

    res.json(rows);
  } catch (error) {
    console.error('Error sorting records:', error);
    res.status(500).send('Internal server error');
  }
});





// Start the server
app.listen(5000, ()=>{
    console.log("Server has started on port 5000");
});