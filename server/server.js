const express = require('express');
const sequelize = require('./sequlize')
const cors = require('cors');
const { JobPosting } = require('./tables');
const port = 3000;

const app = express();
app.use(cors())

app.use(express.json());

app.use('/sync', require('./routes/sequelize-routes'));
app.use('/api', require('./routes/jobPosting-routes'));
app.use('/api', require('./routes/candidates'));
app.use('/api', require('./routes/demands'));

app.listen(port, async() => {
	console.warn(`Server started on http://localhost:${port}`);
	
})

