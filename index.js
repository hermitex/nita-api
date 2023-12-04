// server.js
const express = require('express');
const bodyParser = require('body-parser');
const paymentRoutes = require('./app/routes/paymentRoutes');
const emailRoutes = require('./app/routes/emailRoutes');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
// app.use(cors());

// Use routes
app.use('/api/payments', paymentRoutes);
app.use('/api/emails', emailRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
