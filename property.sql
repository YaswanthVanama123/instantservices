CREATE TABLE IF NOT EXISTS property(
    pid INTEGER PRIMARY KEY AUTOINCREMENT, email VARCHAR(100), name VARCHAR(100), age int, members_can_stay INT, phonenumber INT, 
    state VARCHAR(250), city VARCHAR(250), area VARCHAR(1000), pincode int, property_type VARCHAR(100),stay_type VARCHAR(100),
    estimated_cost INT, rating FLOAT, totalusers int,
    averagerating FLOAT, property_registration_status BOOLEAN, profileurl TEXT, proofurl TEXT,property_image_url TEXT,
    FOREIGN KEY(email) REFERENCES businesslogin(email_id) ON DELETE CASCADE

);