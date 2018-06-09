'use strict';

const express = require('express');
const path = require('path');

const app = express();
const staticPath = path.join(__dirname, '../public');
const PORT = process.env.PORT || 3000;

app.use(express.static(staticPath));

app.listen(PORT, () => console.log(`Server started on ${PORT}`));
