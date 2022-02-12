const { DataTypes, UUIDV4 } = require('sequelize')
const sequelize = require('../sequlize')

const Candidate = sequelize.define('Candidate', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [5, 40],
        }
    },
    cv: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [100,1000]
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    }
})

module.exports = Candidate