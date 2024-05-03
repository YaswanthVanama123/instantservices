CREATE TABLE IF NOT EXISTS businesslocation(
    blid INTEGER PRIMARY KEY AUTOINCREMENT, email VARCHAR(100), shop_name VARCHAR(100), opens_in_a_week INT,
    opens_at VARCHAR(100),closes_at VARCHAR(100), phonenumber INT, 
    city VARCHAR(250), area VARCHAR(1000),state VARCHAR(100),shop_type VARCHAR(500), pincode int, special VARCHAR(100),
    rating FLOAT, totalusers int,
    averagerating FLOAT, business_location_status BOOLEAN, profileurl TEXT, proofurl TEXT,business_image_url TEXT,
    FOREIGN KEY(email) REFERENCES businesslogin(email_id) ON DELETE CASCADE

)