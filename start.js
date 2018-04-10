
//import env variables
require('dotenv').config({ path: 'variables.env' })

var connect = require('./db/connect')

//start our app
const app = require('./app.js')
app.listen(process.env.PORT , () => {
    console.log("Listening at port 3000")
});