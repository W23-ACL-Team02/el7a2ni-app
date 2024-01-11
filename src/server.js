const mongoose = require('mongoose');
var cron = require('node-cron');
const app = require('./app');
const http = require('http');
const socketIO = require('./controllers-clinic/socketIO')
const { handle } = require('./handlers/notification/notificationHandler');
const MongoURI = process.env.MONGO_URI;
const FgCyan = "\x1b[36m"
const FgGreen = "\x1b[32m"
const FgWhite = "\x1b[37m"

// Set port
var port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);
socketIO(server)

// Mongo DB
mongoose.set('strictQuery', false);
mongoose.connect(MongoURI)
.then((connection)=>{
    // Starting server
    console.log(`${FgGreen}[DB] MongoDB is now connected!${FgWhite}`)

    // Schedule notification handling every 30 seconds
    cron.schedule('*/30 * * * * *', handle);

    // Listen to port
    server.listen(port, () => {
        console.log(`${FgCyan}[API] Listening to requests on http://localhost:${port}${FgWhite}`);
    })
})
.catch(err => console.log(err));