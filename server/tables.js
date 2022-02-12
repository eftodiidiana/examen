const JobPosting = require('./models/jobPosting')
const Candidate = require('./models/candidate')
const Demand = require('./models/demand')
const { DataTypes } = require('sequelize')

JobPosting.hasMany(Candidate, {
	type: DataTypes.UUID,
    allowNull: false
})

JobPosting.hasMany(Demand, {
	type: DataTypes.UUID,
	allowNull: false
})
module.exports={JobPosting, Candidate, Demand}