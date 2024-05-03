// Import necessary modules
const express = require("express");
const path = require("path");
const fetch = require("node-fetch");

// Create an instance of Express application
const app = express();

// Set the port for the server
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Define a route for the home page
app.get("/", (req, res) => {
    // Send the static HTML file as the response
    res.sendFile(path.join(__dirname, "public", "phone.html"));
});

// Route for handling the redirect after authentication
app.get("/verified", async function (req, res) {
    try {
        const CLIENT_ID = "14384655975163593511"; // Your client ID obtained from phone.email
        const accessToken = req.query.access_token;

        if (!accessToken) {
            return res.status(400).json({ message: "Access token not found." });
        }

        const url = "https://eapi.phone.email/getuser";

        // Make a POST request to the API
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}` // Include the access token in the Authorization header
            },
            body: JSON.stringify({ client_id: CLIENT_ID })
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch user details: ${response.statusText}`);
        }

        const responseData = await response.json();

        // Render the "verified" view with the user details
        res.send(responseData); // You can customize this response as needed
    } catch (error) {
        // Handle errors and provide a meaningful response
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
