const {DataTypes} = require('sequelize')
const sequelize = require('../dataBase/db');

const Users = sequelize.define('Users',{

    refreshToken:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    uid:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false
    },
    name:{
        allowNull:true,
        type:DataTypes.STRING,
    },
    code:{
        allowNull:false,
        type:DataTypes.STRING,
    },
    phone:{
        type:DataTypes.STRING,
        allowNull:true,
    },
    ProfilePicture:{
        type:DataTypes.STRING,
        allowNull:true
    }
},{
    tableName:'Users'
});

module.exports = Users;