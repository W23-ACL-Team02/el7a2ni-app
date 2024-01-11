# el7a2ni-app

El7a2ni is a software solution for clinics, doctors, pharmacists and patients alike to streamline and automate the interactions between patients, medical doctors and pharmacists. This encompasses everything from trying to find a doctor, scheduling meetings with doctors, conducting on-premise or online meetings, getting prescriptions, getting reminders for follow-ups, accessing medical history, and ordering medication that was prescribed.

## Motivation

This was prepared as part of a university project under the German International University in Berlin. The purpose of it was to simulate an Agile environment, while developing an application using the MERN stack.

## Depracated Repositories
As an attempt to centralize both modules of the El7a2ni app, this repository was created.
| Pharmacy | [GitHub Repo](https://github.com/W23-ACL-Team02/Pharmacy_Team02) |
|----------|-------------|
| Clinic   | [GitHub Repo](https://github.com/W23-ACL-Team02/VirtualClinic_Team02) |

## Build Status

### Nav bar persists after logging out
#### Issue
Does not properly set `loggedIn` state after logging out, so a navigation bar remains.
#### Current fix
Refresh page after logging out.

### Chatting function incomplete
#### Issue
Chat system missing front end React elements to be implemented, and websocket connection to be established with the back end as well.

## Code Style

### JavaScript
* Two spaces indentation.
* Avoid function statements. Instead, create anonymous functions and
assing them to vars for consistency with other vars.

    ```javascript
    // No
    function multiply(a, b) {return a * b;}

    // Yes
    var multiply = (a, b) => {return a * b;};
    ```

* Do not use quotes in object keys.

    ```javascript
    // No
    {'a': 'testtest'}

    // Yes
    {a: 'testtest'}
    ```

* Use '===' for comparing instead of '=='. JavaScript is weakly typed
language, so 5 == '5'. This ambiguity could lead to hard-to-find bugs.

    ```javascript
    if (a === 5) {
      ...
    }
    if ($(this).val() === 'something') {
      ...
    }
    if (typeof a === 'undefined') {
      ...
    }

    // Exception: this compares both to 'null' and 'undefined'.
    if (item == null) {

    }
    ```

## Screenshots

Patient's Homepage
![Homepage](https://github.com/W23-ACL-Team02/el7a2ni-app/assets/30373939/5fa9fa25-5bf4-452f-899d-42b08d6c6645)

Video Chat
![Chat](https://github.com/W23-ACL-Team02/el7a2ni-app/assets/30373939/c403b33e-a088-4fda-b03e-293339d5cbc6)

Patient's Account Actions
![Account Actions](https://github.com/W23-ACL-Team02/el7a2ni-app/assets/30373939/223cee72-ba93-40ef-b4b0-89fba31d8326)


## Tech Stack

### Node.js
* JavaScript engine to run and execute our server.

### React.js
* JavaScript front end library
* Used to render our UI on our front end server

### Express.js
* Node.js web application framework
* Used to build and run our back end RESTful API

### MongoDB
* NoSQL database product, utilizing JSON-like documents with schemas
* Used to store all our data
* Hosted on MongoDB Atlas

## Installation
* Install GIT [(Guide)](https://github.com/git-guides/install-git)
* Install Node [(Download)](https://nodejs.org/en/download/current)
* Install your prefered code editor [(VSCode)](https://code.visualstudio.com/download)
* Clone the repository by running this command in your terminal
```
git clone https://github.com/W23-ACL-Team02/el7a2ni-app.git
```
* Change directory to access the cloned repository
```
cd el7a2ni-app
```
* Install required dependencies for the back end
```
npm install
```
* Change directory to access the front end part
```
cd app-ui
```
* Install required dependencies for the front end
```
npm install
```

## Features

* Medicine management system
* Doctor appointment management
* `Stripe API` integration for payments
* Video chat with bidirectional communication through websockets using `socket.io`
* Chat system (not implemented, yet)

## Code Examples

To ensure private routes are only accessable by users who are logged in, we check for a valid JWT bearer token or cookie
```
const authenticateToken = (req, res, next) => {
    // Assign bearer token to that provided in cookie, or if undefined, try from auth header
    let token;
    let bearer;
    if (req.cookies?.jwt !== undefined) {
        token = req.cookies.jwt;
    } else {
        bearer = req.headers?.authorization;
        if (bearer !== undefined) token = bearer.split(' ')[1];
    }
    
    if (bearer == undefined && token == undefined) {
        console.log("bearer or cookie undefined")
        return res.status(403).json({errors: ["No credentials provided"]});
    }

    jwt.verify(token, secret, (err, decode) => {
        // Error occured while verifying token
        if (err) {
            console.log(err.message)
            res.status(400).send(err);

            return;
        }

        // Assign decoded items to session
        req.session = decode;
    })

     next();
}
```

To handle the notification system, a repeating task is run every 30s to do so in batches:

`server.js`
```
// Schedule notification handling every 30 seconds
    cron.schedule('*/30 * * * * *', handle);
```

`notificationHandler.js`
```
/**
 * Notification Handler that checks for all notifications that have not had their:
 * - Emails sent
 * - Notification on the system shown (Web App)
 * 
 * 
 * This functions should be run periodically.
 */
const handle = async () => { 
    console.log(`[Notif] Handling notifications...`)

    let [emailCount, systemCount] = await Promise.all([handleEmailNotify(), handleUserNotify()]);
    
    if (emailCount == 0 && systemCount == 0) {
        console.log(`[Notif] Nothing to handle.`)
    }

    if (emailCount > 0) console.log(`[Notif] Handled ${emailCount} email notifications.`)
    if (systemCount > 0) console.log(`[Notif] Handled ${systemCount} system notifications.`)
}
```

## API Reference

Our [API Documentation](src/routes/API_DOC.md) is provided in full in a separate file.

## Testing

We conduct parts of our testing through a team-shared Postman workspace. Endpoints are tested and placed under the appropriate folder following the type of user that should be executing it. Each type of user has a predefined JWT bearer token provided with the request.

![Postman Workspace](https://github.com/W23-ACL-Team02/el7a2ni-app/assets/30373939/881eb513-39ec-44bc-93fc-9be280783e66)

## How To Use
* After following the [installation](#installation), make sure you are in the root directory and start the back end server
```
npm start
```
* Then open a new terminal and navigate to the front end folder
```
cd app-ui
```
* Start the front end server
```
npm start
```
* When both servers are up, you should be able to [access the front end](http://localhost:4000/login)

## Contribute

Please refer to the build status. Any and all contribution towards fixing issues or adding missing implementation is appreciated!

## Credits
References to useful resources that aided our team with implementation.

* Embedding in MongoDB ([Youtube](https://youtu.be/TVZznmBpBUs?si=uXr6U2KKXU37fWbG))
* New React useEffectEvent Hook Crash Course ([Youtube](https://youtu.be/NZJUEzn10FI?si=jOX7blFpNiIM6mAZ))
* Short React Course by freeCodeCamp ([Course](https://www.freecodecamp.org/learn/front-end-development-libraries/#react))

## Licenses

### Server Side Public License
```
Copyright © 2018 MongoDB, Inc.

Everyone is permitted to copy and distribute verbatim copies of this license document, but changing it is not allowed.
```

### MIT License
```
Copyright © 2023 W23-ACL-Team02

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

### Apache 2.0
```
Copyright © 2023 W23-ACL-Team02

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
