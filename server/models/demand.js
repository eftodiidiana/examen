const { DataTypes, UUIDV4 } = require('sequelize')
const sequelize = require('../sequlize')

const Demand = sequelize.define('Demand', {
	id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
	dateOfSubmission :{
        type: DataTypes.DATE,
        allowNull: false,
		validate: {
            isDate: true
        }
    }
})

module.exports = Demand