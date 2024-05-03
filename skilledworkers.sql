CREATE TABLE IF NOT EXISTS skilledworkers(
    wid INTEGER PRIMARY KEY AUTOINCREMENT, email VARCHAR(100), name VARCHAR(100), age int, gender VARCHAR(20), phonenumber int, 
    state VARCHAR(250), city VARCHAR(250), area VARCHAR(1000), pincode int, occupation VARCHAR(100), rating FLOAT, totalusers int,
    averagerating FLOAT, skilledworkersstatus BOOLEAN, profileurl TEXT, proofurl TEXT, latitude TEXT, longitude TEXT,
    FOREIGN KEY(email) REFERENCES businesslogin(email_id) ON DELETE CASCADE

);