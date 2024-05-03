
const express = require("express");
const session = require('express-session');
const ejs = require('ejs');

const app = express();
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
app.set('view engine', 'ejs');

const webpush = require('web-push');

const vapidKeys = webpush.generateVAPIDKeys();
console.log(vapidKeys);
// Configure web-push with your VAPID keys
// Initialize web push with VAPID keys
const publicKey = 'BMsnluu9SbEuirKzgogfRwHyfWT398UmphtdLR5Ul713k4AimIz22oQuRfMpPWJHsOv4ko1mphC8glZ4qIhAqFY';
const privateKey = 'vgR-quclXR2FDPymu9VglwnJm5AY9dNyERl1GnxDU_E';
webpush.setVapidDetails('mailto:vanamayaswanth108@gmail.com', publicKey, privateKey);


const dbPath = path.join(__dirname, "myguider.db");

const connectDb = async () => {
    try {
        const db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });
        return db;
    } catch (error) {
        console.error("Database error:", error.message);
        throw error;
    }
};


// generateSecretKey.js
const crypto = require('crypto');

const generateSecretKey = () => {
    return crypto.randomBytes(32).toString('hex');
};

const secretKey = generateSecretKey();
console.log("Generated Secret Key:", secretKey);
app.use(session({
    secret: secretKey, // Use your actual secret key here
    resave: false,
    saveUninitialized: true
}));

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));




// Routes
// Serve myguider.html for both "/" and "/business/signup" routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "myguider.html"));
});

app.get("/business/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "businessSignup.html"));
});

app.get("/business/signin",(req,res) => {
    res.sendFile(path.join(__dirname, "public", "businessLogin.html"));
});

app.get("/user/signup",(req,res) =>{
    res.sendFile(path.join(__dirname, "public", "userSignup.html"));
});

app.get("/user/signin",(req,res) =>{
    res.sendFile(path.join(__dirname, "public", "userSignin.html"));
});




app.get("/business/skilledworkers/registration",(req,res) =>{
    const userEmail = req.session.email;
    if (userEmail) {
    res.sendFile(path.join(__dirname, "public", "businessSidebar.html"));
    } else {
        // Handle the case when the email is not found in the session
        res.sendFile(path.join(__dirname, "public", "404error.html"));
    }
})

app.get("/business/property/registration", (req,res) =>{
    const userEmail = req.session.email;
    if (userEmail) {
    res.sendFile(path.join(__dirname, "public", "propertySlidebarRegistration.html"));
    } else {
        // Handle the case when the email is not found in the session
        res.sendFile(path.join(__dirname, "public", "404error.html"));
    }
})

app.get("/business/parttime/registration", (req,res) =>{
    const userEmail = req.session.email;
    if (userEmail) {
    res.sendFile(path.join(__dirname, "public", "parttimeSlidebar.html"));
    } else {
        // Handle the case when the email is not found in the session
        res.sendFile(path.join(__dirname, "public", "404error.html"));
    }
})

app.get("/business/businesslocation/registration", (req,res) =>{
    const userEmail = req.session.email;
    if (userEmail) {
    res.sendFile(path.join(__dirname, "public", "locationSlidebar.html"));
    } else {
        // Handle the case when the email is not found in the session
        res.sendFile(path.join(__dirname, "public", "404error.html"));
    }
})

app.get("/business/skilledworkers/homepage", (req,res) =>{
    const userEmail = req.session.email;
    if (userEmail) {
    res.sendFile(path.join(__dirname, "public", "skilledWorkersHomePage.html"));
    } else {
        // Handle the case when the email is not found in the session
        res.sendFile(path.join(__dirname, "public", "404error.html"));
    }
})


// Endpoint to handle subscribing skilled workers for push notifications
app.post("/business/skilledworkers/subscribe", async (req, res) => {
    try {
        const { endpoint, auth, p256dh } = req.body;
        
        // Extract user email from session
        const userEmail = req.session.email;
        if (!userEmail) {
            return res.status(401).json({ error: 'User email not found in session' });
        }

        // Connect to the SQLite database
        const db = await connectDb();

        // Update subscription information for the skilled worker with matched userEmail
        const updateQuery = `
            UPDATE skilledworkers
            SET endpoint = ?, p256dh = ?, auth = ?
            WHERE email = ?
        `;
        const updateParams = [endpoint, p256dh, auth, userEmail];
        await db.run(updateQuery, updateParams);

        res.status(200).json({ message: 'Subscription information updated successfully' });
    } catch (error) {
        console.error("Error updating subscription information:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



// Endpoint to handle subscribing skilled workers for push notifications
app.post("/user/subscribe", async (req, res) => {
    try {
        const { endpoint, auth, p256dh } = req.body;
        
        // Extract user email from session
        const userEmail = req.session.usermail;
        if (!userEmail) {
            return res.status(401).json({ error: 'User email not found in session' });
        }

        // Connect to the SQLite database
        const db = await connectDb();

        // Update subscription information for the skilled worker with matched userEmail
        const updateQuery = `
            UPDATE userlogin
            SET endpoint = ?, p256dh = ?, auth = ?
            WHERE email_id = ?
        `;
        const updateParams = [endpoint, p256dh, auth, userEmail];
        await db.run(updateQuery, updateParams);

        res.status(200).json({ message: 'Subscription information updated successfully' });
    } catch (error) {
        console.error("Error updating subscription information:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



app.get("/business/property/homepage", (req,res) =>{
    const userEmail = req.session.email;
    if (userEmail) {
    res.sendFile(path.join(__dirname, "public", "propertyHomePage.html"));
    } else {
        // Handle the case when the email is not found in the session
        res.sendFile(path.join(__dirname, "public", "404error.html"));
    }
})

app.get("/business/businesslocation/homepage", (req,res) =>{
    const userEmail = req.session.email;
    if (userEmail) {
    res.sendFile(path.join(__dirname, "public", "businesslocationHomePage.html"));
    } else {
        // Handle the case when the email is not found in the session
        res.sendFile(path.join(__dirname, "public", "404error.html"));
    }
})

app.get("/business/parttime/homepage", (req,res) =>{
    const userEmail = req.session.email;
    if (userEmail) {
    res.sendFile(path.join(__dirname, "public", "parttimeHomePage.html"));
    } else {
        // Handle the case when the email is not found in the session
        res.sendFile(path.join(__dirname, "public", "404error.html"));
    }
})



app.get("/business/sidebar", (req,res) =>{
    const userEmail = req.session.email;
    if (userEmail) {
    res.sendFile(path.join(__dirname, "public", "businessSidebar.html"));
    } else {
        // Handle the case when the email is not found in the session
        res.sendFile(path.join(__dirname, "public", "404error.html"));
    }
})

app.get("/user/skilledworkers/homepage", (req,res) =>{
    const userEmail = req.session.usermail;
    if (userEmail) {
    res.sendFile(path.join(__dirname, "public", "userSkilledWorkersHomePage.html"));
    } else {
        // Handle the case when the email is not found in the session
        res.sendFile(path.join(__dirname, "public", "404error.html"));
    }
})

app.get("/user/property/homepage", (req,res) =>{
    const userEmail = req.session.usermail;
    if (userEmail) {
    res.sendFile(path.join(__dirname, "public", "userProperty.html"));
    } else {
        // Handle the case when the email is not found in the session
        res.sendFile(path.join(__dirname, "public", "404error.html"));
    }
})

app.get("/user/parttime/homepage", (req,res) =>{
    const userEmail = req.session.usermail;
    if (userEmail) {
    res.sendFile(path.join(__dirname, "public", "userParttime.html"));
    } else {
        // Handle the case when the email is not found in the session
        res.sendFile(path.join(__dirname, "public", "404error.html"));
    }
})




// Endpoint to fetch skilled workers within 2km radius of user's location
// app.get("/skilledworkersnear/count", async (req, res) => {
//     try {
//         const userLat = parseFloat(req.query.lat);
//         const userLng = parseFloat(req.query.lng);

//         // Connect to the SQLite database
//         const db = await connectDb();

//         // Query the skilled workers table to get workers within 2km radius of user's location
//         const query = `
//             SELECT *
//             FROM skilledworkers
//             WHERE (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) <= 2;
//         `;
//         const params = [userLat, userLng, userLat];
//         const result = await db.get(query, params);

//         // Send the list of skilled workers within 2km radius as JSON response
//         res.json(result);
        
//         // Send push notification to each skilled worker within 2km radius
//         result.forEach(worker => {
//             // Get the subscription details for the worker (assuming it's stored in the database)
//             const subscription = {
//                 endpoint: worker.endpoint,
//                 keys: {
//                     p256dh: worker.p256dh,
//                     auth: worker.auth
//                 }
//             };

//             // Send the push notification
//             webpush.sendNotification(subscription, JSON.stringify({ message: 'New job opportunity nearby!' }))
//                 .catch(error => console.error('Error sending push notification:', error));
//         });
//     } catch (error) {
//         console.error("Error fetching skilled workers:", error.message);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

// GET endpoint to fetch skilled workers within 2km radius


// POST endpoint to send web push notifications to skilled workers
// app.post("/sendnotification", async (req, res) => {
//     try {
//         const { userLat, userLng } = req.body; // User's location data

//         // Connect to the SQLite database
//         const db = await connectDb();

//         // Query the skilled workers table to find workers within 2km radius of user's location
//         const query = `
//             SELECT *
//             FROM skilledworkers
//             WHERE (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) <= 2;
//         `;
//         const params = [userLat, userLng, userLat];
//         const skilledWorkers = await db.all(query, params);

//         // Iterate over skilled workers and send push notifications
//         skilledWorkers.forEach(async (worker) => {
//             const subscription = {
//                 endpoint: worker.subscriptionEndpoint,
//                 keys: {
//                     p256dh: worker.subscriptionP256dh,
//                     auth: worker.subscriptionAuth
//                 }
//             };

//             const payload = JSON.stringify({
//                 title: 'New Job Opportunity',
//                 body: 'A new job opportunity is available nearby.'
//             });

//             // Send push notification
//             await webpush.sendNotification(subscription, payload);
//         });

//         res.json({ message: "Push notifications sent successfully" });
//     } catch (error) {
//         console.error("Error sending push notifications:", error.message);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });


// In-memory store for subscriptions (In a real-world scenario, use a database)
let subscriptions = [];

// Route to save subscription
app.post('/save-subscription', (req, res) => {
    const subscription = req.body;
    subscriptions.push(subscription);
    console.log('Subscription saved:', subscription);
    res.status(201).json({ message: 'Subscription saved successfully' });
});

// Route to send notifications to subscribed users
app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    if (!subscription.keys || !subscription.keys.auth || !subscription.keys.p256dh) {
      res.status(400).send('Invalid subscription object: missing keys');
    } else {
      // Store the subscription object in your database or handle it as needed
      console.log('Received new subscription:', subscription);
      res.status(201).send('Subscription successful');
    }
  });
  
  // Function to send push notification
  async function sendNotification(subscription) {
    try {
      await webpush.sendNotification(subscription, 'Your notification payload');
      console.log('Notification sent successfully');
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }
  
  // Example route to trigger sending notification
  app.get('/send-notification', async (req, res) => {
    // Fetch subscriptions from your database or other storage
    const subscriptions = [];
  
    // Send notification to each subscriber
    subscriptions.forEach(subscription => {
      sendNotification(subscription);
    });
  
    res.send('Notifications sent to all subscribed users.');
  });

  
// Configure web-push with your VAPID keys
webpush.setVapidDetails(
    'mailto:vanamayaswanth1@gmail.com', // your email
    'BAfI3r_RzJi1mT61KNAZ0fYJbMNDRxGLMfn7ZGTbM49wMJ_D0jAzqQKWNxDTOfpWNJ5i0r2DsZfU9H8g0ZXLdss', // your public key
    'xTcVgIqwTra8kaFWy1-j6Io0UEYPes_giYB7BkFkwLk' // your private key
);





app.get("/check-notification-status", async (req, res) => {
    const { notificationNumber } = req.query;
    try {
        const db = await connectDb();
        // Query the database to check the status of the notification
        const notifications = await db.all(
            `SELECT status FROM Notification WHERE notificationNumber = ?`,
            [notificationNumber]
        );
        if (notifications.length > 0) {
            // If there are notifications found
            const acceptedNotification = notifications.find(notification => notification.status === 'accepted');
            if (acceptedNotification) {
                // If at least one notification is accepted, send a response with status and redirect URL
                res.status(200).json({ status: 'accepted', redirectUrl: '/' });
            } else {
                // If no accepted notifications found, send a response with status only
                res.status(200).json({ status: 'pending' });
            }
        } else {
            // If no notifications found with the provided notificationNumber, send a response with status 'not found'
            res.status(404).json({ status: 'not found' });
        }
    } catch (error) {
        console.error("Error checking notification status:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

  
// Function to generate a random 4-digit number
function generateRandom4DigitNumber() {
    return Math.floor(1000 + Math.random() * 9000);
}



app.get("/skilledworkersnear/count", async (req, res) => {
    const userEmail = req.session.usermail;
    try {
        const userLat = parseFloat(req.query.lat);
        const userLng = parseFloat(req.query.lng);

        // Connect to the SQLite database
        const db = await connectDb();

         // Generate a 4-digit OTP
         const otp = generateRandom4DigitNumber();

        // Insert a row in the notificationNum table with the generated OTP
        const insertNotificationNumQuery = `
            INSERT INTO notificationNum (userId, pin) 
            VALUES (?, ?);
        `;
        const insertNotificationNumParams = [userEmail, otp];
        await db.run(insertNotificationNumQuery, insertNotificationNumParams);

        // Retrieve the generated notificationNumber
        const getNotificationNumberQuery = `
            SELECT last_insert_rowid() AS notificationNumber;
        `;
        const { notificationNumber } = await db.get(getNotificationNumberQuery);

        console.log('Generated notificationNumber:', notificationNumber);

        // Query the skilled workers table to fetch workers within 2km radius of user's location
        const query = `
            SELECT *
            FROM skilledworkers
            WHERE (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) <= 2;
        `;
        const params = [userLat, userLng, userLat];
        const skilledWorkers = await db.all(query, params);

        // Prepare an array to store promises for insertions and push notifications
        const promises = [];

        // For each skilled worker, prepare and execute insertion and push notification
        skilledWorkers.forEach(worker => {
            // Check if subscription details are present
            if (worker.endpoint && worker.auth && worker.p256dh) {
                // Retrieve subscription details from the database
                const { endpoint, auth, p256dh, email } = worker;

                // Create the push notification payload
                const pushPayload = JSON.stringify({
                    title: 'New Job Opportunity Nearby!',
                    body: 'There is a new job opportunity near your location. Check it out!',
                    icon: 'path/to/icon.png',
                    notificationNumber: notificationNumber, // Add notificationNumber to the payload
                    data: {
                        url: '/notification/accepted', // Specify the target URL here
                    }
                });

                // Store notification details in the database
                const insertNotificationQuery = `
                    INSERT INTO Notification (notificationNumber, userId, skilledWorkerId, message, status)
                    VALUES (?, ?, ?, ?, ?);
                `;
                const insertNotificationParams = [notificationNumber, userEmail, email, pushPayload, 'pending'];

                // Push the promise for insertion into the promises array
                promises.push(db.run(insertNotificationQuery, insertNotificationParams));

                // Send the push notification
                promises.push(webpush.sendNotification({
                    endpoint,
                    keys: {
                        auth,
                        p256dh
                    }
                }, pushPayload)
                .then(() => console.log('Push notification sent successfully to', email))
                .catch(error => console.error('Error sending push notification:', error)));
            } else {
                // Subscription details are missing, handle accordingly
                console.log('Subscription details missing for', worker.email);
                // Add your code here to handle the scenario (e.g., send email to user asking to allow notifications again)
            }
        });

        // Wait for all insertions and push notifications to complete
        await Promise.all(promises);

        // Send the skilled workers within 2km radius along with the generated notificationNumber as JSON response
        res.json({ skilledWorkers, notificationNumber });
       
    } catch (error) {
        console.error("Error fetching skilled workers:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// Endpoint to fetch skilled worker's location coordinates
app.get("/get-skilled-worker-coordinates", async (req, res) => {
    try {
        const { notificationNumber } = req.query;
        console.log(notificationNumber);

        // Connect to the SQLite database
        const db = await connectDb();

        // Retrieve skilled worker's email from the Notification table
        const skilledWorkerEmail = await db.get(
            `SELECT skilledWorkerId FROM Notification WHERE notificationNumber = ? AND status = 'accepted'`,
            [notificationNumber]
        );
 

        if (skilledWorkerEmail) {
            // Fetch skilled worker's location coordinates from the skilledworkers table
            const skilledWorkerLocation = await db.get(
                `SELECT longitude, latitude FROM skilledworkers WHERE email = ?`,
                [skilledWorkerEmail.skilledWorkerId]
            );
         
            res.json(skilledWorkerLocation);
        } else {
            res.status(404).json({ error: "Skilled worker location not found" });
        }
    } catch (error) {
        console.error("Error fetching skilled worker location:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Endpoint to fetch user's location coordinates
app.get("/get-user-location", async (req, res) => {
    try {
        const { notificationNumber } = req.query;

        // Connect to the SQLite database
        const db = await connectDb();

        // Retrieve user's email from the Notification table
        const userEmail = await db.get(
            `SELECT userId FROM Notification WHERE notificationNumber = ?`,
            [notificationNumber]
        );

        if (userEmail) {
            // Fetch user's location coordinates from the userlogin table
            const userLocation = await db.get(
                `SELECT longitude, latitude FROM userlogin WHERE email_id = ?`,
                [userEmail.userId]
            );

            res.json(userLocation);
        } else {
            res.status(404).json({ error: "User location not found" });
        }
    } catch (error) {
        console.error("Error fetching user location:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});





app.get("/successfully/booked",(req,res) =>{
    res.sendFile(path.join(__dirname, "public", "work.html"));
})

app.get("/successfully/captain/booked",(req,res) =>{
    res.sendFile(path.join(__dirname, "public", "userwork.html"));
})

// Define a route to fetch the pin using notificationNumber
app.get('/get-pin', async (req, res) => {
    try {
        const notificationNumber = req.query.notificationNumber;

        // Connect to the SQLite database
        const db = await connectDb();

        // Query the database to fetch the pin based on notificationNumber
        const query = `
            SELECT pin
            FROM notificationNum
            WHERE notificationNumber = ?
        `;

        const row = await db.get(query, [notificationNumber]);

        if (row) {
            // Pin found, send it to the frontend
            res.json({ pin: row.pin });
        } else {
            // Pin not found for the given notificationNumber
            res.status(404).json({ error: 'Pin not found' });
        }
    } catch (error) {
        console.error('Error fetching pin:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Define a route to update cancelStatus to "timeup"
app.get('/update-cancel-status', async (req, res) => {
    try {
        const notificationNumber = req.query.notificationNumber;
        console.log(notificationNumber);

        // Connect to the SQLite database
        const db = await connectDb();

        // Update the cancelStatus to "timeup" for the given notificationNumber
        const query = `
            UPDATE notificationNum
            SET cancelStatus = 'timeup'
            WHERE notificationNumber = ?
        `;
        console.log(query)

        await db.run(query, [notificationNumber]);

        console.log('Cancel status updated successfully');
        res.json({ message: 'Cancel status updated successfully' });
    } catch (error) {
        console.error('Error updating cancel status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Define a route to update cancelUserStatus to "timeup"
app.get('/update-cancel-user-status', async (req, res) => {
    try {
        const notificationNumber = req.query.notificationNumber;
        console.log(notificationNumber);

        // Connect to the SQLite database
        const db = await connectDb();

        // Update the cancelStatus to "timeup" for the given notificationNumber
        const query = `
            UPDATE notificationNum
            SET captainCancelStatus = 'timeup'
            WHERE notificationNumber = ?
        `;
        console.log(query)

        await db.run(query, [notificationNumber]);

        console.log('Cancel status updated successfully');
        res.json({ message: 'Cancel status updated successfully' });
    } catch (error) {
        console.error('Error updating cancel status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Define a route to check and update cancelStatus
app.get('/check-update-cancel-status', async (req, res) => {
    try {
        const notificationNumber = req.query.notificationNumber;

        // Connect to the SQLite database
        const db = await connectDb();

        // Query to fetch current cancelStatus
        const fetchQuery = `
            SELECT cancelStatus
            FROM notificationNum
            WHERE notificationNumber = ?
        `;

        // Fetch the current cancelStatus
        const currentStatusRow = await db.get(fetchQuery, [notificationNumber]);

        // Check if cancelStatus is "timeup"
        if (currentStatusRow && currentStatusRow.cancelStatus === "timeup") {
            // If cancelStatus is "timeup", send response indicating cancellation time has expired
            res.json({ message: "Cancellation time has expired (2 minutes timeup)" });
        } else {
            // If cancelStatus is not "timeup", update it to "cancelled"
            const updateQuery = `
                UPDATE notificationNum
                SET cancelStatus = 'cancelled'
                WHERE notificationNumber = ?
            `;
            
            // Execute the update query
            await db.run(updateQuery, [notificationNumber]);

            // Send success response
            res.json({ message: "Cancel status updated successfully" });
        }
    } catch (error) {
        console.error('Error checking/updating cancel status:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Define a route to check and update cancelStatus
app.get('/check-update-cancel-user-status', async (req, res) => {
    try {
        const notificationNumber = req.query.notificationNumber;

        // Connect to the SQLite database
        const db = await connectDb();

        // Query to fetch current cancelStatus
        const fetchQuery = `
            SELECT captainCancelStatus
            FROM notificationNum
            WHERE notificationNumber = ?
        `;

        // Fetch the current cancelStatus
        const currentStatusRow = await db.get(fetchQuery, [notificationNumber]);

        // Check if cancelStatus is "timeup"
        if (currentStatusRow && currentStatusRow.captainCancelStatus === "timeup") {
            // If cancelStatus is "timeup", send response indicating cancellation time has expired
            res.json({ message: "Cancellation time has expired (2 minutes timeup)" });
        } else {
            // If cancelStatus is not "timeup", update it to "cancelled"
            const updateQuery = `
                UPDATE notificationNum
                SET captainCancelStatus = 'cancelled'
                WHERE notificationNumber = ?
            `;
            
            // Execute the update query
            await db.run(updateQuery, [notificationNumber]);

            // Send success response
            res.json({ message: "Cancel status updated successfully" });
        }
    } catch (error) {
        console.error('Error checking/updating cancel status:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Backend code to handle the request and fetch skilled worker details
app.get('/get-skilled-worker-details', async (req, res) => {
    const { notificationNumber } = req.query;

    try {
        // Connect to the database
        const db = await connectDb();

        // Fetch skilled worker ID from Notification table based on notificationNumber and status
        const skilledWorkerIdQuery = `
            SELECT skilledWorkerId
            FROM Notification
            WHERE notificationNumber = ? AND status = 'accepted';
        `;
        const skilledWorkerIdRow = await db.get(skilledWorkerIdQuery, [notificationNumber]);

        if (!skilledWorkerIdRow) {
            return res.status(404).json({ error: 'No skilled worker found for the given notification number' });
        }

        const { skilledWorkerId } = skilledWorkerIdRow;

        // Fetch skilled worker details from skilledworkers table using the skilledWorkerId
        const skilledWorkerDetailsQuery = `
            SELECT *
            FROM skilledworkers
            WHERE email = ?;
        `;
        const skilledWorkerDetails = await db.get(skilledWorkerDetailsQuery, [skilledWorkerId]);

        if (skilledWorkerDetails) {
            // Skilled worker details found, send them to the frontend
            res.json(skilledWorkerDetails);
        } else {
            // Skilled worker details not found
            res.status(404).json({ error: 'Skilled worker details not found' });
        }
    } catch (error) {
        console.error('Error fetching skilled worker details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Backend code to handle the request and fetch user details
app.get('/get-user-details', async (req, res) => {
    const { notificationNumber } = req.query;

    try {
        // Connect to the database
        const db = await connectDb();

        // Fetch skilled worker ID from Notification table based on notificationNumber and status
        const userIdQuery = `
            SELECT userId
            FROM Notification
            WHERE notificationNumber = ? AND status = 'accepted';
        `;
        const userIdRow = await db.get(userIdQuery, [notificationNumber]);

        if (!userIdRow) {
            return res.status(404).json({ error: 'No skilled worker found for the given notification number' });
        }

        const { userId } = userIdRow;

        // Fetch skilled worker details from skilledworkers table using the skilledWorkerId
        const userDetailsQuery = `
            SELECT *
            FROM userlogin
            WHERE email_id = ?;
        `;
        const userDetails = await db.get(userDetailsQuery, [userId]);

        if (userDetails) {
            // Skilled worker details found, send them to the frontend
            res.json(userDetails);
        } else {
            // Skilled worker details not found
            res.status(404).json({ error: 'Skilled worker details not found' });
        }
    } catch (error) {
        console.error('Error fetching skilled worker details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get("/work/started", (req,res) =>{
    res.sendFile(path.join(__dirname, "public", "timeWatch.html"));
})


// Backend code to handle the request and fetch the cancelStatus
app.get('/check-cancel-status', async (req, res) => {
    const { notificationNumber } = req.query;

    try {
        // Connect to the database
        const db = await connectDb();

        // Fetch the cancelStatus from the notificationNum table based on the notificationNumber
        const query = `
            SELECT cancelStatus
            FROM notificationNum
            WHERE notificationNumber = ?;
        `;
        const row = await db.get(query, [notificationNumber]);

        if (row) {
            // If row found and cancelStatus is not "timeup", return the cancelStatus
            res.json({ cancelStatus: row.cancelStatus });
        }
    } catch (error) {
        console.error('Error checking cancel status:', error);
        // Handle the error
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Backend code to handle the request and fetch the cancelStatus
app.get('/check-captain-cancel-status', async (req, res) => {
    const { notificationNumber } = req.query;

    try {
        // Connect to the database
        const db = await connectDb();

        // Fetch the cancelStatus from the notificationNum table based on the notificationNumber
        const query = `
            SELECT captainCancelStatus
            FROM notificationNum
            WHERE notificationNumber = ?;
        `;
        const row = await db.get(query, [notificationNumber]);

        if (row) {
            // If row found and cancelStatus is not "timeup", return the cancelStatus
            res.json({ captainCancelStatus: row.captainCancelStatus });
        }
    } catch (error) {
        console.error('Error checking cancel status:', error);
        // Handle the error
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




app.get("/captain/verification", (req,res) =>{
    res.sendFile(path.join(__dirname, "public", "captainOtpEnteredPage.html"));
})




// Function to calculate distance between two coordinates in kilometers
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}


const moment = require('moment-timezone'); // Import moment-timezone library


// Endpoint to accept the notification
app.post("/accept-notification", async (req, res) => {
    const skilledWorkerEmail = req.session.email;
    try {
        
        const { notificationNumber } = req.body;
        console.log(notificationNumber);

        // Log the notificationNumber to check its value
        console.log('Notification Number:', notificationNumber);

        // Connect to the SQLite database
        const db = await connectDb();

        // Get the current time in Indian time zone
        const currentTime = moment.tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');

        // Check if any other skilled worker has already accepted the notification
        const acceptedNotification = await db.get(
            `SELECT * FROM Notification WHERE notificationNumber = ? AND status = 'accepted'`,
            [notificationNumber]
        );

        if (!acceptedNotification) {
            // Update the notification status to 'accepted' for the current skilled worker
            console.log(currentTime);
            console.log(skilledWorkerEmail);
            console.log(notificationNumber);
            const updateResult = await db.run(
                `UPDATE Notification 
                SET status = 'accepted', reactionTime = ?
                WHERE skilledWorkerId = ? AND notificationNumber = ?`,
                [currentTime, skilledWorkerEmail, notificationNumber]
            );
            console.log(updateResult);
            console.log(updateResult.changes);
            

            console.log('Notification status updated successfully');

            // Fetch skilled worker's name from the skilledworker table
            const skilledWorker = await db.get(
                `SELECT name FROM skilledworkers WHERE email = ?`,
                [skilledWorkerEmail]
            );

            if (skilledWorker) {
                const skilledWorkerName = skilledWorker.name;

                // Get the user email associated with the notification
                const userNotification = await db.get(
                    `SELECT userId FROM Notification WHERE notificationNumber = ?`,
                    [notificationNumber]
                );

                if (userNotification) {
                    const userEmail = userNotification.userId;

                    // Fetch subscription details from the userlogin table
                    const userSubscription = await db.get(
                        `SELECT * FROM userlogin WHERE email_id = ?`,
                        [userEmail]
                    );

                    if (userSubscription) {
                        const { endpoint, auth, p256dh } = userSubscription;

                        // Construct payload for the notification
                        const payload = JSON.stringify({
                            title: `Notification from ${skilledWorkerName}`,
                            body: 'Some text here',
                            icon: 'notification-icon.png',
                            notificationNumber: notificationNumber,
                            data: {
                                url: '/',
                            }
                        });

                        // Send the notification to the user
                        await webpush.sendNotification({
                            endpoint,
                            keys: {
                                auth,
                                p256dh
                            }
                        }, payload);

                        console.log('Notification sent to the user');
                        res.status(200).send('Notification accepted successfully');
                    } else {
                        console.log('User subscription details not found');
                    }
                } else {
                    console.log('User email associated with the notification not found');
                }
            } else {
                console.log('Skilled worker not found');
            }

            // Send a success response
        } else {
            console.log('Notification already accepted by another skilled worker');
            res.status(400).send('Notification already accepted by another skilled worker');
        }
    } catch (error) {
        console.error("Accept notification error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// Define the route to handle POST requests for updating time worked in the successfulWork table
app.post('/update-time-worked', async (req, res) => {
    // Extract data from the request body
    const { time, notificationNumber } = req.body;

    try {
        // Connect to the SQLite database
        const db = await connectDb();

        // Update the timeWorked in the successfulWork table
        await db.run(
            `UPDATE successfulWork SET timeWorked = ? WHERE notificationNumber = ?`,
            [time, notificationNumber]
        );

        res.status(200).json({ message: 'Time updated successfully' }); // Send a success response
    } catch (error) {
        console.error('Error updating time in successfulWork table:', error.message);
        res.status(500).json({ error: 'Internal Server Error' }); // Send an error response
    }
});



 // Import moment-timezone library

// Endpoint to reject the notification
app.post("/reject-notification", async (req, res) => {
    const userEmail = req.session.email;
    try {
        const { notificationNumber } = req.body;

        // Log the notificationNumber to check its value
        

        // Connect to the SQLite database
        const db = await connectDb();

        // Get the current time in Indian time zone
        const currentTime = moment.tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');

        // Update the notification status to 'rejected' for the current skilled worker
        await db.run(
            `UPDATE Notification 
            SET status = 'rejected', reactionTime = ?
            WHERE skilledWorkerId = ? AND notificationNumber = ?`,
            [currentTime, userEmail, notificationNumber]
        );

        console.log('Notification rejected successfully');
        res.sendStatus(200); // Send a success response

    } catch (error) {
        console.error("Reject notification error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Endpoint to get the initial time for a notification
app.get("/get-initial-time/:notificationNumber", async (req, res) => {
    try {
        const { notificationNumber } = req.params;

        // Connect to the SQLite database
        const db = await connectDb();

        // Retrieve the initial time from the successfulWork table for the given notificationNumber
        const { timeWorked } = await db.get(
            `SELECT timeWorked FROM successfulWork WHERE notificationNumber = ?`,
            [notificationNumber]
        );

        // Send the initial time as the response
        res.status(200).json({ time: timeWorked || '00:00:00' });

    } catch (error) {
        console.error("Error fetching initial time:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Define the route to handle checking if notificationNumber exists in the successfulWork table
app.get('/check-successful-work', async (req, res) => {
    // Extract notificationNumber from the query parameters
    const { notificationNumber } = req.query;

    try {
        // Connect to the SQLite database
        const db = await connectDb();

        // Check if the notificationNumber exists in the successfulWork table
        const result = await db.get(
            `SELECT COUNT(*) AS count FROM successfulWork WHERE notificationNumber = ?`,
            [notificationNumber]
        );

        // Check if the count is greater than 0 (i.e., notificationNumber exists)
        if (result.count > 0) {
            res.status(200).json({ exists: true }); // Send a response indicating the notificationNumber exists
        } else {
            res.status(200).json({ exists: false }); // Send a response indicating the notificationNumber does not exist
        }
    } catch (error) {
        console.error('Error checking successfulWork table:', error.message);
        res.status(500).json({ error: 'Internal Server Error' }); // Send an error response
    }
});

app.get("/bill/paymented/page",(req,res) =>{
    res.sendFile(path.join(__dirname, "public", "ratingPage.html"));
})


// Define the route to handle POST requests for updating completedWork in the successfulWork table
app.post('/update-completed-work', async (req, res) => {
    // Extract notificationNumber from the request body
    const { notificationNumber } = req.body;

    try {
        // Connect to the SQLite database
        const db = await connectDb();

        // Get the current Indian time
        const indianCurrentTime = moment.tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');

        // Update completedWork and finishedTime in the successfulWork table
        await db.run(
            `UPDATE successfulWork SET completedWork = 'completed', finishedTime = ? WHERE notificationNumber = ?`,
            [indianCurrentTime, notificationNumber]
        );

        res.status(200).json({ message: 'Completed work updated successfully' }); // Send a success response
    } catch (error) {
        console.error('Error updating completed work in successfulWork table:', error.message);
        res.status(500).json({ error: 'Internal Server Error' }); // Send an error response
    }
});


// Define the route to handle GET requests for payment details
app.get('/get-payment-details/:notificationNumber', async (req, res) => {
    // Extract notificationNumber from the request parameters
    const notificationNumber = req.params.notificationNumber;

    try {
        // Connect to the SQLite database
        const db = await connectDb();

        // Query the successfulWork table for payment details
        const paymentDetails = await db.get(
            `SELECT startTime, finishedTime, timeWorked, captainId FROM successfulWork WHERE notificationNumber = ?`,
            [notificationNumber]
        );

        if (paymentDetails) {
            res.json(paymentDetails); // Send payment details as a JSON response
        } else {
            res.status(404).json({ error: 'Payment details not found' }); // Send a 404 error response if payment details not found
        }
    } catch (error) {
        console.error('Error fetching payment details from successfulWork table:', error.message);
        res.status(500).json({ error: 'Internal Server Error' }); // Send an error response
    }
});



// Define the route to handle GET requests for checking completed work status
app.get('/check-completed-work/:notificationNumber', async (req, res) => {
    const { notificationNumber } = req.params;

    try {
        // Connect to the SQLite database
        const db = await connectDb();

        // Query the successfulWork table to get the completedWork status
        const row = await db.get(
            `SELECT completedWork FROM successfulWork WHERE notificationNumber = ?`,
            [notificationNumber]
        );

        if (!row) {
            res.status(404).json({ error: 'Notification number not found' });
            return;
        }

        const { completedWork } = row;

        // Send the completedWork status in the response
        res.status(200).json({ completedWork });
    } catch (error) {
        console.error('Error checking completed work status:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get("/payment/page",(req,res) =>{
    res.sendFile(path.join(__dirname, "public", "paymentPage.html"));
})

// Backend function to handle POST request for inserting notificationNumber into successfulWork table
app.post('/insert-notification', async (req, res) => {
    const { notificationNumber } = req.body;
    console.log(notificationNumber);

    try {
        // Connect to the SQLite database
        const db = await connectDb();

        // Check if notificationNumber already exists in successfulWork table
        const existingNotification = await db.get(
            `SELECT * FROM successfulWork WHERE notificationNumber = ?`,
            [notificationNumber]
        );

        // If notificationNumber does not exist in successfulWork table, insert it
        if (!existingNotification) {
            // Get userId and captainId from Notification table where status is 'accepted' and notificationNumber matches
            const { userId, skilledWorkerId } = await db.get(
                `SELECT userId, skilledWorkerId FROM Notification WHERE notificationNumber = ? AND status = 'accepted'`,
                [notificationNumber]
            );

            // Get the current time in Indian time zone
            const currentTime = moment.tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');

            // Insert data into successfulWork table
            await db.run(
                `INSERT INTO successfulWork (notificationNumber, userId, captainId, startTime) VALUES (?, ?, ?, ?)`,
                [notificationNumber, userId, skilledWorkerId, currentTime]
            );

            console.log('Notification inserted into successfulWork table successfully');
            res.status(200).json({ message: 'Notification inserted successfully' }); // Send a success response
        } else {
            console.log('Notification already exists in successfulWork table');
            
            res.status(409).json({ message: 'Notification already exists in successfulWork table' }); // Conflict: Notification already exists
        }
    } catch (error) {
        console.error('Error inserting notification:', error.message);
        res.status(500).json({ error: 'Internal Server Error' }); // Send an error response
    }
});


// Endpoint to send push notifications
app.post("/send-notification", async (req, res) => {
    const userId = req.session.usermail;
    try {
        const {payload } = req.body;

        // Retrieve subscription details for the user
        const userSubscription = await getSubscriptionByEmail(userId);

        if (userSubscription) {
            // Send push notification to the user
            await webpush.sendNotification(userSubscription, JSON.stringify(payload));
            res.status(200).json({ message: 'Push notification sent successfully' });
        } else {
            res.status(404).json({ error: 'Subscription details not found for user' });
        }
    } catch (error) {
        console.error('Error sending push notification:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get("/notification/accepted", (req,res) =>{
    res.sendFile(path.join(__dirname, "public", "accept-notifications.html"));
})


app.get("/current", (req,res) =>{
    res.sendFile(path.join(__dirname, "public", "regular.html"));
})

app.get("/userloc", (req,res) =>{
    const userEmail = req.session.usermail;
    if (userEmail) {
    res.sendFile(path.join(__dirname, "public", "usercurrent.html"));
    }
    else {
        // Handle the case when the email is not found in the session
        res.sendFile(path.join(__dirname, "public", "404error.html"));
    }
})

app.get("/user/businesslocation/homepage", (req,res) =>{
    const userEmail = req.session.usermail;
    if (userEmail) {
        // Redirect the user to the businessService.html page with the userEmail as a query parameter
        res.sendFile(path.join(__dirname, "public", "userBusinessLocation.html"));
    } else {
        // Handle the case when the email is not found in the session
        res.sendFile(path.join(__dirname, "public", "404error.html"));
    }
    
})

app.get("/maps",(req,res) =>{
    const userEmail = req.session.email;
    if (userEmail) {
        res.redirect(`/maps.html?userEmail=${userEmail}`);
    
    } else {
        console.log(userEmail);
        // Handle the case when the email is not found in the session
        res.sendFile(path.join(__dirname, "public", "404error.html"));
    }
})


// Backend Route to Update Skilled Worker Location
app.post("/maps", async (req, res) => {
    const userEmail = req.session.email;
    const { longitude, latitude } = req.body;

    if (userEmail && longitude && latitude) {
        try {
            const db = await connectDb();
            await db.run(
                "UPDATE skilledworkers SET longitude = ?, latitude = ? WHERE email = ?",
                [longitude, latitude, userEmail]
            );
            res.status(200).send("Data updated successfully");
        } catch (error) {
            console.error("Error updating data in skilledworkers table:", error.message);
            res.status(500).send("Internal Server Error");
        }
    } else {
        res.status(400).send("Bad Request");
    }
});

// Backend Route to Update user Location
app.post("/user/location", async (req, res) => {
    const userEmail = req.session.usermail; // Assuming you're using sessions to identify users
    const { longitude, latitude } = req.body;

    if (userEmail && longitude && latitude) {
        try {
            // Here, you should establish a connection to your database
            // and update the user's location in the userlogin table

            // Example with SQLite:
            const db = await connectDb(); // Assuming you have a function to connect to the database
            await db.run(
                "UPDATE userlogin SET longitude = ?, latitude = ? WHERE email_id = ?",
                [longitude, latitude, userEmail]
            );
            res.status(200).send("Data updated successfully");
        } catch (error) {
            console.error("Error updating data in userlogin table:", error.message);
            res.status(500).send("Internal Server Error");
        }
    } else {
        res.status(400).send("Bad Request");
    }
});



// Backend Route to Update Skilled Worker Location
app.post("/mapsProperty", async (req, res) => {
    const userEmail = req.session.email;
    const { longitude, latitude } = req.body;

    if (userEmail && longitude && latitude) {
        try {
            const db = await connectDb();
            await db.run(
                "UPDATE property SET longitude = ?, latitude = ? WHERE email = ?",
                [longitude, latitude, userEmail]
            );
            res.status(200).send("Data updated successfully");
        } catch (error) {
            console.error("Error updating data in property table:", error.message);
            res.status(500).send("Internal Server Error");
        }
    } else {
        res.status(400).send("Bad Request");
    }
});

// Backend Route to Update businessLocation Location
app.post("/mapslocation", async (req, res) => {
    const userEmail = req.session.email;
    const { longitude, latitude } = req.body;

    if (userEmail && longitude && latitude) {
        try {
            const db = await connectDb();
            await db.run(
                "UPDATE businesslocation SET longitude = ?, latitude = ? WHERE email = ?",
                [longitude, latitude, userEmail]
            );
            res.status(200).send("Data updated successfully");
        } catch (error) {
            console.error("Error updating data in skilledworkers table:", error.message);
            res.status(500).send("Internal Server Error");
        }
    } else {
        res.status(400).send("Bad Request");
    }
});

// Backend Route to Update partime Location
app.post("/mapsparttime", async (req, res) => {
    const userEmail = req.session.email;
    const { longitude, latitude } = req.body;

    if (userEmail && longitude && latitude) {
        try {
            const db = await connectDb();
            await db.run(
                "UPDATE parttime SET longitude = ?, latitude = ? WHERE email = ?",
                [longitude, latitude, userEmail]
            );
            res.status(200).send("Data updated successfully");
        } catch (error) {
            console.error("Error updating data in skilledworkers table:", error.message);
            res.status(500).send("Internal Server Error");
        }
    } else {
        res.status(400).send("Bad Request");
    }
});


app.get("/business/skilledworkers/sidebar",(req,res) =>{
    const userEmail = req.session.email;
    if (userEmail) {
        // Redirect the user to the businessService.html page with the userEmail as a query parameter
        res.sendFile(path.join(__dirname, "public", "businessSidebar.html"));
    }    else {
        // Handle the case when the email is not found in the session
        res.sendFile(path.join(__dirname, "public", "404error.html"));
    }
})



// Backend Route to Update Skilled Worker profileurl
app.post("/skilledworkers/profile", async (req, res) => {
    const userEmail = req.session.email;
    const { profileurllink } = req.body;
    if (userEmail) {
        try {
            const db = await connectDb();
            await db.run(
                "UPDATE skilledworkers SET profileurl = ? WHERE email = ?",
                [profileurllink, userEmail]
            );
            res.status(200).json({ message: "Skilled worker profileurl updated successfully" });
        } catch (error) {
            console.error("Error updating skilled worker profileurl:", error.message);
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        res.status(401).json({ error: "Unauthorized access" });
    }
});


// Backend Route to Update property profileurl
app.post("/property/profile", async (req, res) => {
    const userEmail = req.session.email;
    const { profileurllink } = req.body;
    if (userEmail) {
        try {
            const db = await connectDb();
            await db.run(
                "UPDATE property SET profileurl = ? WHERE email = ?",
                [profileurllink, userEmail]
            );
            res.status(200).json({ message: "property profileurl updated successfully" });
        } catch (error) {
            console.error("Error updating property profileurl:", error.message);
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        res.status(401).json({ error: "Unauthorized access" });
    }
});

// Backend Route to Update businesslocation profileurl
app.post("/businesslocation/profile", async (req, res) => {
    const userEmail = req.session.email;
    const { profileurllink } = req.body;
    if (userEmail) {
        try {
            const db = await connectDb();
            await db.run(
                "UPDATE businesslocation SET profileurl = ? WHERE email = ?",
                [profileurllink, userEmail]
            );
            res.status(200).json({ message: "businesslocation profileurl updated successfully" });
        } catch (error) {
            console.error("Error updating businesslocation profileurl:", error.message);
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        res.status(401).json({ error: "Unauthorized access" });
    }
});

// Backend Route to Update parttime profileurl
app.post("/parttime/profile", async (req, res) => {
    const userEmail = req.session.email;
    const { profileurllink } = req.body;
    if (userEmail) {
        try {
            const db = await connectDb();
            await db.run(
                "UPDATE parttime SET profileurl = ? WHERE email = ?",
                [profileurllink, userEmail]
            );
            res.status(200).json({ message: "parttime profileurl updated successfully" });
        } catch (error) {
            console.error("Error updating parttime profileurl:", error.message);
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        res.status(401).json({ error: "Unauthorized access" });
    }
});

// Backend Route to Update skilledworkers proof
app.post("/skilledworkers/proof", async (req, res) => {
    const userEmail = req.session.email;
    const { proofurllink } = req.body;
    if (userEmail) {
        try {
            const db = await connectDb();
            await db.run(
                "UPDATE skilledworkers SET proofurl = ? WHERE email = ?",
                [proofurllink, userEmail]
            );
            res.status(200).json({ message: "skilledworkers proofurllink updated successfully" });
        } catch (error) {
            console.error("Error updating skilledworkers proofurllink:", error.message);
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        res.status(401).json({ error: "Unauthorized access" });
    }
});


// Backend Route to Update property proof
app.post("/property/proof", async (req, res) => {
    const userEmail = req.session.email;
    const { proofurllink } = req.body;
    if (userEmail) {
        try {
            const db = await connectDb();
            await db.run(
                "UPDATE property SET proofurl = ? WHERE email = ?",
                [proofurllink, userEmail]
            );
            res.status(200).json({ message: "property proofurllink updated successfully" });
        } catch (error) {
            console.error("Error updating property proofurllink:", error.message);
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        res.status(401).json({ error: "Unauthorized access" });
    }
});

// Backend Route to Update businesslocation proof
app.post("/businesslocation/proof", async (req, res) => {
    const userEmail = req.session.email;
    const { proofurllink } = req.body;
    if (userEmail) {
        try {
            const db = await connectDb();
            await db.run(
                "UPDATE businesslocation SET proofurl = ? WHERE email = ?",
                [proofurllink, userEmail]
            );
            res.status(200).json({ message: "businesslocation proofurllink updated successfully" });
        } catch (error) {
            console.error("Error updating businesslocation proofurllink:", error.message);
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        res.status(401).json({ error: "Unauthorized access" });
    }
});

// Backend Route to Update parttime proof
app.post("/parttime/proof", async (req, res) => {
    const userEmail = req.session.email;
    const { proofurllink } = req.body;
    if (userEmail) {
        try {
            const db = await connectDb();
            await db.run(
                "UPDATE parttime SET proofurl = ? WHERE email = ?",
                [proofurllink, userEmail]
            );
            res.status(200).json({ message: "parttime proofurllink updated successfully" });
        } catch (error) {
            console.error("Error updating parttime proofurllink:", error.message);
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        res.status(401).json({ error: "Unauthorized access" });
    }
});



// Check if email exists in skilled workers table
app.get("/skilledworkers/checkEmail", async (req, res) => {
    const { email } = req.query;
    try {
        const db = await connectDb();
        const skilledWorker = await db.get(
            "SELECT * FROM skilledworkers WHERE email = ?",
            [email]
        );
        if (skilledWorker) {
            // Email exists in skilled workers table
            res.json({ exists: true });
        } else {
            // Email does not exist in skilled workers table
            res.json({ exists: false });
        }
    } catch (error) {
        console.error("Error checking email:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Backend route to check if the user email exists in the parttime table
app.get("/parttime/checkEmail", async (req, res) => {
    const { userEmail } = req.query;
    try {
        const db = await connectDb();
        const partTimeWorker = await db.get(
            "SELECT * FROM parttime WHERE email = ?",
            [userEmail]
        );
        if (partTimeWorker) {
            res.status(200).json({ message: "Email exists" });
        } else {
            res.status(404).json({ error: "Email not found" });
        }
    } catch (error) {
        console.error("Error checking email:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Backend route to check if the user email exists in the property table
app.get("/business/property/checkEmail", async (req, res) => {
    const { userEmail } = req.query;
    try {
        const db = await connectDb();
        const property = await db.get(
            "SELECT * FROM property WHERE email = ?",
            [userEmail]
        );
        if (property) {
            res.status(200).send("Email exists");
        } else {
            res.status(404).send("Email not found");
        }
    } catch (error) {
        console.error("Error checking email:", error.message);
        res.status(500).send("Internal server error");
    }
});
// Backend route to check if the user email exists in the businesslocation table
app.get("/businesslocation/checkEmail", async (req, res) => {
    const { userEmail } = req.query;
    try {
        const db = await connectDb(); // Connect to the SQLite database
        const location = await db.get(
            "SELECT * FROM businesslocation WHERE email = ?",
            [userEmail]
        );
        if (location) {
            res.status(200).json({ exists: true });
        } else {
            res.status(200).json({ exists: false });
        }
    } catch (error) {
        console.error("Error checking email:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});


// Backend Route to Fetch Skilled Worker Details
app.get("/skilledworkers/details", async (req, res) => {
    const userEmail = req.session.email;
    if (userEmail) {
        try {
            const db = await connectDb();
            const skilledWorker = await db.get(
                "SELECT * FROM skilledworkers WHERE email = ?",
                [userEmail]
            );
            if (skilledWorker) {
                res.status(200).json(skilledWorker);
            } else {
                res.status(404).json({ error: "Skilled worker details not found" });
            }
        } catch (error) {
            console.error("Error fetching skilled worker details:", error.message);
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        res.status(401).json({ error: "Unauthorized access" });
    }
});


// Backend Route to Update Skilled Worker Status
app.post("/skilledworkers/status", async (req, res) => {
    const userEmail = req.session.email;
    const { status } = req.body;
    if (userEmail) {
        try {
            const db = await connectDb();
            await db.run(
                "UPDATE skilledworkers SET skilledworkersstatus = ? WHERE email = ?",
                [status, userEmail]
            );
            res.status(200).json({ message: "Skilled worker status updated successfully" });
        } catch (error) {
            console.error("Error updating skilled worker status:", error.message);
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        res.status(401).json({ error: "Unauthorized access" });
    }
});




// Backend Route to Fetch Property Details
app.get("/property/details", async (req, res) => {
    const userEmail = req.session.email;
    if (userEmail) {
        try {
            const db = await connectDb();
            const property = await db.get(
                "SELECT * FROM property WHERE email = ?",
                [userEmail]
            );
            if (property) {
                res.status(200).json(property);
            } else {
                res.status(404).json({ error: "Property details not found" });
            }
        } catch (error) {
            console.error("Error fetching property details:", error.message);
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        res.status(401).json({ error: "Unauthorized access" });
    }
});

// Backend Route to Update Property Status
app.post("/property/status", async (req, res) => {
    const userEmail = req.session.email;
    const { status } = req.body;
    if (userEmail) {
        try {
            const db = await connectDb();
            await db.run(
                "UPDATE property SET property_registration_status = ? WHERE email = ?",
                [status, userEmail]
            );
            res.status(200).json({ message: "Property status updated successfully" });
        } catch (error) {
            console.error("Error updating property status:", error.message);
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        res.status(401).json({ error: "Unauthorized access" });
    }
});


// Backend Route to Fetch Part Time Business Details
app.get("/parttime/details", async (req, res) => {
    const userEmail = req.session.email;
    if (userEmail) {
        try {
            const db = await connectDb();
            const partTimeBusiness = await db.get(
                "SELECT * FROM parttime WHERE email = ?",
                [userEmail]
            );
            if (partTimeBusiness) {
                res.status(200).json(partTimeBusiness);
            } else {
                res.status(404).json({ error: "Part Time business details not found" });
            }
        } catch (error) {
            console.error("Error fetching Part Time business details:", error.message);
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        res.status(401).json({ error: "Unauthorized access" });
    }
});

// Backend Route to Update Part Time Business Status
app.post("/parttime/status", async (req, res) => {
    const userEmail = req.session.email;
    const { status } = req.body;
    if (userEmail) {
        try {
            const db = await connectDb();
            await db.run(
                "UPDATE parttime SET parttime_status = ? WHERE email = ?",
                [status, userEmail]
            );
            res.status(200).json({ message: "Part Time business status updated successfully" });
        } catch (error) {
            console.error("Error updating Part Time business status:", error.message);
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        res.status(401).json({ error: "Unauthorized access" });
    }
});

// Backend Route to Fetch Business Location Details
app.get("/businesslocation/details", async (req, res) => {
    const userEmail = req.session.email;
    if (userEmail) {
        try {
            const db = await connectDb();
            const businessLocation = await db.get(
                "SELECT * FROM businesslocation WHERE email = ?",
                [userEmail]
            );
            if (businessLocation) {
                res.status(200).json(businessLocation);
            } else {
                res.status(404).json({ error: "Business location details not found" });
            }
        } catch (error) {
            console.error("Error fetching business location details:", error.message);
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        res.status(401).json({ error: "Unauthorized access" });
    }
});

// Backend Route to Update Business Location Status
app.post("/businesslocation/status", async (req, res) => {
    const userEmail = req.session.email;
    const { status } = req.body;
    if (userEmail) {
        try {
            const db = await connectDb();
            await db.run(
                "UPDATE businesslocation SET business_location_status = ? WHERE email = ?",
                [status, userEmail]
            );
            res.status(200).json({ message: "Business location status updated successfully" });
        } catch (error) {
            console.error("Error updating business location status:", error.message);
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        res.status(401).json({ error: "Unauthorized access" });
    }
});


app.get('/business/skilledworkers/editdetails',(req,res) =>{
    const userEmail = req.session.email;
    if (userEmail) {
    res.sendFile(path.join(__dirname, "public", "skilledWorkersEditSidebar.html"));
    } else {
        // Handle the case when the email is not found in the session
        res.sendFile(path.join(__dirname, "public", "404error.html"));
    }   
})

app.post('/business/skilledworkers/editregistration', async (req, res) => {
    const { email, name, age, gender, phonenumber, state, city, area, pincode, occupation } = req.body;
    try {
        const db = await connectDb();

        // Check if the email already exists in the skilledworkers table
        const existingWorker = await db.get(
            "SELECT * FROM skilledworkers WHERE email = ?",
            [email]
        );
        if (!existingWorker) {
            return res.status(400).json({ error: "Skilled worker does not exist" });
        }

        // Update more than five columns
        await db.run(`UPDATE skilledworkers
            SET email = ?, 
                name = ?, 
                age = ?, 
                gender = ?, 
                phonenumber = ?,
                state = ?,
                city = ?, 
                area = ?,
                pincode = ?,
                occupation = ?
            WHERE email = ?`, [email, name, age, gender, phonenumber, state, city, area, pincode, occupation, email], function(err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`Rows updated: ${this.changes}`);
        });

        return res.status(200).json({ message: 'Skilled worker details updated successfully' });
    } catch (error) {
        console.error('Error updating skilled worker details:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/business/parttime/editdetails', (req,res) =>{
    const userEmail = req.session.email;
    if (userEmail) {
    res.sendFile(path.join(__dirname, "public", "parttimeEditDetails.html"));
    } else {
        // Handle the case when the email is not found in the session
        res.sendFile(path.join(__dirname, "public", "404error.html"));
    }     
})

// POST request to update part-time details
app.post('/parttime/editregisteration', async (req, res) => {
    const {
        email,
        shop_name,
        work_type,
        phonenumber,
        no_of_vacancies,
        city,
        area,
        pincode,
        education,
        expected_salary,
        job_for
    } = req.body;

    try {
        const db = await connectDb();

        // Update part-time details in the database
        const sql = `
            UPDATE parttime 
            SET shop_name = ?,
                work_type = ?,
                phonenumber = ?,
                no_of_vacancies = ?,
                city = ?,
                area = ?,
                pincode = ?,
                education = ?,
                expected_salary = ?,
                job_for = ?
            WHERE email = ?`;
        
        await db.run(sql, [
            shop_name,
            work_type,
            phonenumber,
            no_of_vacancies,
            city,
            area,
            pincode,
            education,
            expected_salary,
            job_for,
            email
        ]);

        console.log("Part-time details updated successfully");
        res.status(200).json({ message: 'Part-time details updated successfully' });
    } catch (error) {
        console.error('Error updating part-time details:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.get('/business/businesslocation/editdetails',(req,res) =>{
    const userEmail = req.session.email;
    if (userEmail) {
    res.sendFile(path.join(__dirname, "public", "businessLocationEditDetails.html"));
    } else {
        // Handle the case when the email is not found in the session
        res.sendFile(path.join(__dirname, "public", "404error.html"));
    }  
})

// POST request to update business location details
app.post('/business/businesslocation/editregistration', async (req, res) => {
    const {
        email,
        shopname,
        opensinaweek,
        openat,
        closesat,
        phoneno,
        city,
        areaLocation,
        state,
        type,
        pincodeLocation,
        special
    } = req.body;

    try {
        const db = await connectDb();

        // Update location details in the database
        const sql = `
            UPDATE businesslocation 
            SET shop_name = ?,
                opens_in_a_week = ?,
                opens_at = ?,
                closes_at = ?,
                phonenumber = ?,
                city = ?,
                area = ?,
                state = ?,
                shop_type = ?,
                pincode = ?,
                special = ?
            WHERE email = ?`;
        
        await db.run(sql, [
            shopname,
            opensinaweek,
            openat,
            closesat,
            phoneno,
            city,
            areaLocation,
            state,
            type,
            pincodeLocation,
            special,
            email
        ]);

        console.log("Location details updated successfully");
        res.status(200).json({ message: 'Location details updated successfully' });
    } catch (error) {
        console.error('Error updating location details:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/business/property/editdetails', (req,res) =>{
    const userEmail = req.session.email;
    if (userEmail) {
    res.sendFile(path.join(__dirname, "public", "propertyEditDetails.html"));
    } else {
        // Handle the case when the email is not found in the session
        res.sendFile(path.join(__dirname, "public", "404error.html"));
    }  
})

app.post('/business/property/editregistration', async (req, res) => {
    try {
        const {
            email,
            name,
            age,
            members_can_stay,
            phonenumber,
            state,
            city,
            area,
            pincode,
            property_type,
            stay_type,
            estimated_cost
        } = req.body;

        // Ensure that all required fields are provided
        if (!email || !name || !age || !phonenumber || !state || !city || !area || !pincode || !property_type || !stay_type || !estimated_cost) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const db = await connectDb();

        // Update property details in the database
        const sql = `
            UPDATE property
            SET 
                name = ?,
                age = ?,
                members_can_stay = ?,
                phonenumber = ?,
                state = ?,
                city = ?,
                area = ?,
                pincode = ?,
                property_type = ?,
                stay_type = ?,
                estimated_cost = ?
            WHERE email = ?`;

        await db.run(sql, [
            name,
            age,
            members_can_stay,
            phonenumber,
            state,
            city,
            area,
            pincode,
            property_type,
            stay_type,
            estimated_cost,
            email
        ]);

        console.log("Property details updated successfully");
        res.status(200).json({ message: 'Property details updated successfully' });
    } catch (error) {
        console.error('Error updating property details:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});








// Signup route
app.post("/user/signup", async (req, res) => {
    const { email, password } = req.body;
    try {
        const db = await connectDb();
        const existingUser = await db.get(
            "SELECT * FROM userlogin WHERE email_id = ?",
            [email]
        );
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }
        await db.run(
            "INSERT INTO userlogin (email_id, password) VALUES (?, ?)",
            [email, password]
        );
        req.session.usermail = email;
        // req.session.email = email;
        return res.status(200).json({ message: "User signed up successfully" });
    } catch (error) {
        console.error("Signup error:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
});


// POST /user/login route handler
app.post("/user/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const db = await connectDb();
        const user = await db.get(
            "SELECT * FROM userlogin WHERE email_id = ?",
            [username]
        );
        if (user) {
            if (user.password === password) {
                req.session.usermail = username;
                // req.session.email = username;
                res.status(200).send("Login successful!");
            } else {
                res.status(401).send("Incorrect password.");
            }
        } else {
            res.status(404).send("Username not found.");
        }
    } catch (error) {
        console.error("Error logging in:", error.message);
        res.status(500).send("Error logging in. Please try again later.");
    }
});





app.post("/business/signup", async (req, res) => {
    const { email, password } = req.body;
    try {
        const db = await connectDb();
        const existingBusiness = await db.get(
            "SELECT * FROM businesslogin WHERE email_id = ?",
            [email]
        );
        if (existingBusiness) {
            return res.status(400).json({ error: "Email already exists" });
        }
        await db.run(
            "INSERT INTO businesslogin (email_id, password) VALUES (?, ?)",
            [email, password]
        );
        req.session.email = email;
        return res.status(200).json({ message: "Business signed up successfully" });
    } catch (error) {
        console.error("Business signup error:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
});


// Business login route
app.post("/business/signin", async (req, res) => {
    const { email, password } = req.body;
    try {
        const db = await connectDb();
        const business = await db.get(
            "SELECT * FROM businesslogin WHERE email_id = ?",
            [email]
        );
        if (business) {
            if (business.password === password) {
                // Set session email

                req.session.email = email;
                res.status(200).send("Login successful!");
            } else {
                res.status(401).send("Incorrect password.");
            }
        } else {
            res.status(404).send("Username not found.");
        }
    } catch (error) {
        console.error("Error logging in business:", error.message);
        res.status(500).send("Error logging in. Please try again later.");
    }
});

// POST /business/skilledworkers/registration route handler
app.post('/business/skilledworkers/registration', async (req, res) => {
    const { email, name, age, gender, phonenumber, state, city, area, pincode, occupation } = req.body;
    try {
        const db = await connectDb();

        // Check if the email already exists in the skilled_workers table
        const existingWorker = await db.get(
            "SELECT * FROM skilledworkers WHERE email = ?",
            [email]
        );
        if (existingWorker) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // Insert the new skilled worker into the skilled_workers table
        await db.run(
            'INSERT INTO skilledworkers (email, name, age, gender, phonenumber, state, city, area, pincode, occupation, rating, totalusers, averagerating, skilledworkersstatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [email, name, age, gender, phonenumber, state, city, area, pincode, occupation, 5, 1, 5, true]
        );

        return res.status(200).json({ message: 'Skilled worker registered successfully' });
    } catch (error) {
        console.error('Error registering skilled worker:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
});




// POST request to register part-time details
app.post('/parttime/register', async (req, res) => {
    const {
        email,
        shop_name,
        work_type,
        phonenumber,
        no_of_vacancies,
        city,
        area,
        pincode,
        education,
        expected_salary,
        job_for,
        profileurl,
        proofurl,
        parttime_image_url
    } = req.body;

    try {
        const db = await connectDb();

        // Insert part-time details into the database
        const sql = `
            INSERT INTO parttime (
                email,
                shop_name,
                work_type,
                phonenumber,
                no_of_vacancies,
                city,
                area,
                pincode,
                education,
                expected_salary,
                job_for,
                profileurl,
                proofurl,
                parttime_image_url,
                rating,
                totalusers,
                averagerating,
                parttime_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
        await db.run(sql, [
            email,
            shop_name,
            work_type,
            phonenumber,
            no_of_vacancies,
            city,
            area,
            pincode,
            education,
            expected_salary,
            job_for,
            profileurl,
            proofurl,
            parttime_image_url,
            5.0,
            1,
            5.0,
            true
        ]);

        console.log("Part-time registration successful");
        res.status(200).json({ message: 'Part-time registration successful' });
    } catch (error) {
        console.error('Error registering part-time details:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// POST request to register property details
app.post('/business/property/register', async (req, res) => {
    try {
        const {
            email,
            name,
            age,
            members_can_stay,
            phonenumber,
            state,
            city,
            area,
            pincode,
            property_type,
            stay_type,
            estimated_cost
        } = req.body;

        // Ensure that all required fields are provided
        if (!email || !name || !age || !phonenumber || !state || !city || !area || !pincode || !property_type || !stay_type || !estimated_cost) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const db = await connectDb();

        // Insert property details into the database
        const sql = `
            INSERT INTO property (
                email,
                name,
                age,
                members_can_stay,
                phonenumber,
                state,
                city,
                area,
                pincode,
                property_type,
                stay_type,
                estimated_cost
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        await db.run(sql, [
            email,
            name,
            age,
            members_can_stay,
            phonenumber,
            state,
            city,
            area,
            pincode,
            property_type,
            stay_type,
            estimated_cost
        ]);

        console.log("Property registration successful");
        res.status(200).json({ message: 'Property registration successful' });
    } catch (error) {
        console.error('Error registering property details:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// POST request to register location details
app.post('/business/location/register', async (req, res) => {
    const {
        email,
        shopname,
        opensinaweek,
        openat,
        closesat,
        phoneno,
        city,
        areaLocation,
        state,
        type,
        pincodeLocation,
        special,
        profileurl,
        proofurl,
        business_image_url
    } = req.body;

    try {
        const db = await connectDb();

        // Insert location details into the database
        const sql = `
            INSERT INTO businesslocation (
                email,
                shop_name,
                opens_in_a_week,
                opens_at,
                closes_at,
                phonenumber,
                city,
                area,
                state,
                shop_type,
                pincode,
                special,
                rating,
                totalusers,
                averagerating,
                business_location_status,
                profileurl,
                proofurl,
                business_image_url
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
        await db.run(sql, [
            email,
            shopname,
            opensinaweek,
            openat,
            closesat,
            phoneno,
            city,
            areaLocation,
            state,
            type,
            pincodeLocation,
            special,
            5.0, // Default rating
            1,    // Default totalusers
            5.0,  // Default averagerating
            true, // Default business_location_status
            profileurl,
            proofurl,
            business_image_url
        ]);

        console.log("Location registration successful");
        res.status(200).json({ message: 'Location registration successful' });
    } catch (error) {
        console.error('Error registering location details:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// Route to serve businessService.html and send user's email
app.get("/business/service", (req, res) => {
    // Retrieve the email from the session
    const userEmail = req.session.email;
    if (userEmail) {
        // Redirect the user to the businessService.html page with the userEmail as a query parameter
        res.redirect(`/businessService.html?userEmail=${userEmail}`);
    } else {
        // Handle the case when the email is not found in the session
        res.sendFile(path.join(__dirname, "public", "404error.html"));
    }
});


// Route to serve userSevicePage.html and send user's email
app.get("/user/service", (req, res) => {
    // Retrieve the email from the session
    const userEmail = req.session.usermail;
    if (userEmail) {
        // Redirect the user to the businessService.html page with the userEmail as a query parameter
        res.redirect(`/userSevicePage.html?userEmail=${userEmail}`);
    } else {
        // Handle the case when the email is not found in the session
        res.sendFile(path.join(__dirname, "public", "404error.html"));
    }
});

// Endpoint to retrieve all details from property table
app.get('/propertyalldetails', async (req, res) => {
    console.log("fetched");
    try {
        const db = await connectDb(); // Connect to the SQLite database

        // Query the skilledworkers table to fetch all user details
        const property = await db.all('SELECT * FROM property');

        res.json(property); // Send skilledWorkers data as JSON response
    } catch (error) {
        console.error('Error fetching skilled worker details:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to retrieve all details from parttime table
app.get('/parttimealldetails', async (req, res) => {
    console.log("fetched");
    try {
        const db = await connectDb(); // Connect to the SQLite database

        // Query the skilledworkers table to fetch all user details
        const parttime = await db.all('SELECT * FROM parttime');

        res.json(parttime); // Send skilledWorkers data as JSON response
    } catch (error) {
        console.error('Error fetching skilled worker details:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to retrieve all details from businesslocation table
app.get('/businesslocationalldetails', async (req, res) => {
    console.log("fetched");
    try {
        const db = await connectDb(); // Connect to the SQLite database

        // Query the businesslocation table to fetch all user details
        const businesslocation = await db.all('SELECT * FROM businesslocation');

        res.json(businesslocation); // Send businesslocation data as JSON response
    } catch (error) {
        console.error('Error fetching businesslocation details:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to retrieve all details from skilledworkers table
app.get('/skilledworkers', async (req, res) => {
    try {
        const db = await connectDb(); // Connect to the SQLite database

        // Query the skilledworkers table to fetch all user details
        const skilledWorkers = await db.all('SELECT * FROM skilledworkers');

        res.json(skilledWorkers); // Send skilledWorkers data as JSON response
    } catch (error) {
        console.error('Error fetching skilled worker details:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to retrieve skilled workers within a 2km radius of the user's location
app.get('/skilledworkers/nearby', async (req, res) => {
    try {
        const { userLat, userLon } = req.query;
        const db = await connectDb(); // Connect to the SQLite database

        // Query the skilledworkers table to fetch all skilled workers' details
        const skilledWorkers = await db.all('SELECT * FROM skilledworkers');

        // Filter skilled workers within 2km radius
        const nearbySkilledWorkers = skilledWorkers.filter(worker => {
            const distance = calculateDistance(userLat, userLon, worker.latitude, worker.longitude);
            return distance <= 2; // Check if the distance is within 2km
        });

        res.json(nearbySkilledWorkers); // Send nearby skilled workers data as JSON response
    } catch (error) {
        console.error('Error fetching nearby skilled workers:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Define route handler to update worker rating
app.post('/skilledworkers/updateRating', async (req, res) => {
    try {

        // Extract updated rating details from request body
        const { averageRating, totalRating, totalUsers, workerEmail } = req.body;

        // Update the skilled worker's rating in the database
        const db = await connectDb();
        const updateQuery = `
            UPDATE skilledworkers
            SET averagerating = $averageRating,
                rating = $totalRating,
                totalusers = $totalUsers
            WHERE email = $workerEmail
        `;
        db.run(updateQuery, {
            $averageRating: averageRating,
            $totalRating: totalRating,
            $totalUsers: totalUsers,
            $workerEmail: workerEmail
        }, (error) => {
            if (error) {
                throw error;
            }
            console.log(`Rating updated for worker with email ${workerEmail}`);
            res.json({ success: true, message: `Rating updated for worker with email ${workerEmail}` });
        });

        // Close the database connection
        db.close();
    } catch (error) {
        console.error('Error updating worker rating:', error.message);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// Define route handler to update property rating
app.post('/property/updateRating', async (req, res) => {
    try {

        // Extract updated rating details from request body
        const { averageRating, totalRating, totalUsers, propertyEmail } = req.body;

        // Update the skilled worker's rating in the database
        const db = await connectDb();
        const updateQuery = `
            UPDATE property
            SET averagerating = $averageRating,
                rating = $totalRating,
                totalusers = $totalUsers
            WHERE email = $propertyEmail
        `;
        db.run(updateQuery, {
            $averageRating: averageRating,
            $totalRating: totalRating,
            $totalUsers: totalUsers,
            $propertyEmail: propertyEmail
        }, (error) => {
            if (error) {
                throw error;
            }
            console.log(`Rating updated for worker with email ${propertyEmail}`);
            res.json({ success: true, message: `Rating updated for worker with email ${propertyEmail}` });
        });

        // Close the database connection
        db.close();
    } catch (error) {
        console.error('Error updating worker rating:', error.message);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// Define route handler to update parttime rating
app.post('/parttime/updateRating', async (req, res) => {
    try {

        // Extract updated rating details from request body
        const { averageRating, totalRating, totalUsers, parttimeEmail } = req.body;

        // Update the skilled worker's rating in the database
        const db = await connectDb();
        const updateQuery = `
            UPDATE parttime
            SET averagerating = $averageRating,
                rating = $totalRating,
                totalusers = $totalUsers
            WHERE email = $parttimeEmail
        `;
        db.run(updateQuery, {
            $averageRating: averageRating,
            $totalRating: totalRating,
            $totalUsers: totalUsers,
            $parttimeEmail: parttimeEmail
        }, (error) => {
            if (error) {
                throw error;
            }
            console.log(`Rating updated for parttime with email ${parttimeEmail}`);
            res.json({ success: true, message: `Rating updated for worker with email ${parttimeEmail}` });
        });

        // Close the database connection
        db.close();
    } catch (error) {
        console.error('Error updating parttime rating:', error.message);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// Define route handler to update businesslocation rating
app.post('/businesslocation/updateRating', async (req, res) => {
    try {

        // Extract updated rating details from request body
        const { averageRating, totalRating, totalUsers, businesslocationEmail } = req.body;

        // Update the skilled worker's rating in the database
        const db = await connectDb();
        const updateQuery = `
            UPDATE businesslocation
            SET averagerating = $averageRating,
                rating = $totalRating,
                totalusers = $totalUsers
            WHERE email = $businesslocationEmail
        `;
        db.run(updateQuery, {
            $averageRating: averageRating,
            $totalRating: totalRating,
            $totalUsers: totalUsers,
            $businesslocationEmail: businesslocationEmail
        }, (error) => {
            if (error) {
                throw error;
            }
            console.log(`Rating updated for parttime with email ${businesslocationEmail}`);
            res.json({ success: true, message: `Rating updated for worker with email ${businesslocationEmail}` });
        });

        // Close the database connection
        db.close();
    } catch (error) {
        console.error('Error updating parttime rating:', error.message);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// Endpoint to retrieve reviews for a specific workerEmail from the review table
app.get('/reviews', async (req, res) => {
    const { workerEmail } = req.query; // Assuming worker email is sent as workerEmail parameter

    try {
        const db = await connectDb(); // Connect to the SQLite database

        // Query the review table to fetch reviews for the specified worker email
        const reviews = await db.all('SELECT * FROM review WHERE business_email = ? ORDER BY review_time DESC LIMIT 4', [workerEmail]);

        // If there are no reviews found, return an empty array
        if (!reviews || reviews.length === 0) {
            return res.status(404).json({ message: 'No reviews found for the specified worker email' });
        }

        // Return the reviews as JSON response
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to retrieve reviews for a specific workerEmail from the review table
app.get('/reviewsproperty', async (req, res) => {
    const { propertyEmail } = req.query; // Assuming worker email is sent as workerEmail parameter

    try {
        const db = await connectDb(); // Connect to the SQLite database

        // Query the review table to fetch reviews for the specified worker email
        const reviews = await db.all('SELECT * FROM propertyreview WHERE business_email = ? ORDER BY review_time DESC LIMIT 4', [propertyEmail]);

        // If there are no reviews found, return an empty array
        if (!reviews || reviews.length === 0) {
            return res.status(404).json({ message: 'No reviews found for the specified worker email' });
        }

        // Return the reviews as JSON response
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to retrieve reviews for a specific parttime from the review table
app.get('/reviewsparttime', async (req, res) => {
    const { parttimeEmail } = req.query; // Assuming worker email is sent as workerEmail parameter

    try {
        const db = await connectDb(); // Connect to the SQLite database

        // Query the review table to fetch reviews for the specified worker email
        const reviews = await db.all('SELECT * FROM parttimereview WHERE business_email = ? ORDER BY review_time DESC LIMIT 4', [parttimeEmail]);

        // If there are no reviews found, return an empty array
        if (!reviews || reviews.length === 0) {
            return res.status(404).json({ message: 'No reviews found for the specified worker email' });
        }

        // Return the reviews as JSON response
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to retrieve reviews for a specific business location from the review table
app.get('/reviewsbusinesslocation', async (req, res) => {
    const { businesslocationEmail } = req.query; // Assuming worker email is sent as workerEmail parameter

    try {
        const db = await connectDb(); // Connect to the SQLite database

        // Query the review table to fetch reviews for the specified businesslocation email
        const reviews = await db.all('SELECT * FROM locationreview WHERE business_email = ? ORDER BY review_time DESC LIMIT 4', [businesslocationEmail]);

        // If there are no reviews found, return an empty array
        if (!reviews || reviews.length === 0) {
            return res.status(404).json({ message: 'No reviews found for the specified businesslocation email' });
        }

        // Return the reviews as JSON response
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST endpoint to add a review
app.post('/reviewparttime', async (req, res) => {
    const { business_email, review_time, content, likecount, unlikecount } = req.body;
    const user_email = req.session.usermail;
    const db = await connectDb();

    try {
        // Insert review into the database
        const insertQuery = `INSERT INTO parttimereview (business_email, user_email, review_time, content, likecount, unlikecount) VALUES (?, ?, ?, ?, ?, ?)`;
        await db.run(insertQuery, [business_email, user_email, review_time, content, likecount, unlikecount]);
        console.log('Review inserted successfully');
        return res.status(201).json({ message: 'Review inserted successfully' });
    } catch (error) {
        console.error('Error inserting review:', error);
        return res.status(500).json({ error: 'Error inserting review' });
    }
});

// POST endpoint to add a review
app.post('/reviewbusinesslocation', async (req, res) => {
    const { business_email, review_time, content, likecount, unlikecount } = req.body;
    const user_email = req.session.usermail;
    const db = await connectDb();

    try {
        // Insert review into the database
        const insertQuery = `INSERT INTO locationreview (business_email, user_email, review_time, content, likecount, unlikecount) VALUES (?, ?, ?, ?, ?, ?)`;
        await db.run(insertQuery, [business_email, user_email, review_time, content, likecount, unlikecount]);
        console.log('Review inserted successfully');
        return res.status(201).json({ message: 'Review inserted successfully' });
    } catch (error) {
        console.error('Error inserting review:', error);
        return res.status(500).json({ error: 'Error inserting review' });
    }
});

// POST endpoint to add a review
app.post('/review', async (req, res) => {
    const { business_email, review_time, content, likecount, unlikecount } = req.body;
   
    const user_email = req.session.usermail;
    const db = await connectDb();

    try {
        // Insert review into the database
        const insertQuery = `INSERT INTO review (business_email, user_email, review_time, content, likecount, unlikecount) VALUES (?, ?, ?, ?, ?, ?)`;
        await db.run(insertQuery, [business_email, user_email, review_time, content, likecount, unlikecount]);
        console.log('Review inserted successfully');
        return res.status(201).json({ message: 'Review inserted successfully' });
    } catch (error) {
        console.error('Error inserting review:', error);
        return res.status(500).json({ error: 'Error inserting review' });
    }
});


// POST endpoint to add a review
app.post('/reviewproperty', async (req, res) => {
    const { business_email, review_time, content, likecount, unlikecount } = req.body;
    const user_email = req.session.usermail;
    const db = await connectDb();

    try {
        // Insert review into the database
        const insertQuery = `INSERT INTO propertyreview (business_email, user_email, review_time, content, likecount, unlikecount) VALUES (?, ?, ?, ?, ?, ?)`;
        await db.run(insertQuery, [business_email, user_email, review_time, content, likecount, unlikecount]);
        console.log('Review inserted successfully');
        return res.status(201).json({ message: 'Review inserted successfully' });
    } catch (error) {
        console.error('Error inserting review:', error);
        return res.status(500).json({ error: 'Error inserting review' });
    }
});



// PUT endpoint to update likecount and unlikecount of a review
app.put('/update_review/:uniqueId', async (req, res) => {
    const { likecount, unlikecount } = req.body;
    const uniqueId = req.params.uniqueId;
    const db = await connectDb();

    try {
        // Update review in the database
        const updateQuery = `UPDATE review SET likecount = ?, unlikecount = ? WHERE rid = ?`;
        await db.run(updateQuery, [likecount, unlikecount, uniqueId]);
        console.log('Review updated successfully');
        return res.status(200).json({ message: 'Review updated successfully' });
    } catch (error) {
        console.error('Error updating review:', error);
        return res.status(500).json({ error: 'Error updating review' });
    }
});

app.get("/captain/booking",(req,res) =>{
    res.sendFile(path.join(__dirname,"public","bookingPage.html"))
})

app.get('/time/pass',(req,res) =>{
    res.sendFile(path.join(__dirname, "public", "route.html"));
})
app.get("/guide/videos" , (req,res) =>{
    res.sendFile(path.join(__dirname,"public", "workersguidevideos.html"));
})

// Endpoint to fetch route information
app.get('/get-route', async (req, res) => {
    const { waypoint0, waypoint1 } = req.query;
    const apiKey = 'WCisPFGzH2pEJArskcZoBJmKFffRzIyEbG_htPyKQ1M';
    const apiUrl = `https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apikey=${apiKey}&mode=fastest;car&waypoint0=${waypoint0}&waypoint1=${waypoint1}&representation=display`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching route:', error);
        res.status(500).json({ error: 'Failed to fetch route' });
    }
});
// Proxy route for HERE Routing API
// app.get("/calculate-route", async (req, res) => {
//     try {
//         // Extract query parameters from the request
//         const { waypoint0, waypoint1 } = req.query;

//         // Construct the URL for the HERE Routing API with your API key
//         const apiUrl = `https://route.ls.hereapi.com/routing/7.2/calculateroute.json?xnlp=CL_JSMv3.1.53.0&apikey=WCisPFGzH2pEJArskcZoBJmKFffRzIyEbG_htPyKQ1M&mode=fastest;car&waypoint0=${waypoint0}&waypoint1=${waypoint1}&representation=display`;

//         // Make a GET request to the HERE Routing API
//         const response = await fetch(apiUrl);
//         const data = await response.json();

//         // Log the response
//         console.log("HERE Routing API response:", data);

//         // Forward the response from the HERE Routing API to the client
//         res.json(data);
//     } catch (error) {
//         console.error("Error calculating route:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// });


// Define the route for calculating the route
app.get('/calculate-route', async (req, res) => {
    try {
        // Construct the URL for route calculation
        const apiUrl = 'https://graphhopper.com/api/1/route';
        const queryParams = new URLSearchParams({
            profile: 'car',
            point: '16.5062,80.6480', // Vijayawada coordinates
            point_hint: 'Vijayawada',
            locale: 'en',
            instructions: 'true',
            calc_points: 'true',
            points_encoded: 'true',
            key: 'c17ee212-c8bb-4869-9f6e-de872ca2143d'// Replace with your GraphHopper API key
        });
        const routeUrl = `${apiUrl}?${queryParams}`;

        // Make a GET request to calculate the route
        const response = await fetch(routeUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch route');
        }

        // Parse the route data from the response
        const routeData = await response.json();
        console.log('Route data:', routeData);

        // Send the route data as response to the client
        res.json(routeData);
    } catch (error) {
        console.error('Error calculating route:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});







// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


 