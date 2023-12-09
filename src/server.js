const mongoose = require('mongoose');
const app = require('./app');
var cors = require('cors');
const MongoURI = process.env.MONGO_URI;
const FgCyan = "\x1b[36m"
const FgGreen = "\x1b[32m"
const FgWhite = "\x1b[37m"

// Set port
var port = process.env.PORT || '3000';
app.set('port', port);
app.use(cors());

// Mongo DB
mongoose.set('strictQuery', false);
mongoose.connect(MongoURI)
.then(()=>{
    console.log(`${FgGreen}[DB] MongoDB is now connected!${FgWhite}`, )
    // Starting server
    app.listen(port, () => {
        console.log(`${FgCyan}[API] Listening to requests on http://localhost:${port}${FgWhite}`);
    })
})
.catch(err => console.log(err));