const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// body parser
app.use(express.json());

// cors policy
app.use(cors());

// routes
app.use('/api/', require('./routes/client'));
app.use('/api/admin', require('./routes/admin'));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client/build', 'index.html'));
  });
}

// port - listener
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
