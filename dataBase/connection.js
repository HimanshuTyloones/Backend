const sequelize = require('./db')

const  connect = async()=>{
    try {
        await sequelize.authenticate();
        console.log('connected to the database successfully');
    } catch (error) {
        console.log(error ,'unable to connect to database ');
    }
}

module.exports = connect