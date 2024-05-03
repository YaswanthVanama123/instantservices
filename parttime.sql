CREATE TABLE IF NOT EXISTS parttime(
    ptid INTEGER PRIMARY KEY AUTOINCREMENT, email VARCHAR(100), shop_name VARCHAR(100), work_type VARCHAR(100), phonenumber INT, 
    no_of_vacancies INT, city VARCHAR(250), area VARCHAR(1000), pincode int, education VARCHAR(100),expected_salary INT,
    job_for VARCHAR(100), rating FLOAT, totalusers int,
    averagerating FLOAT, parttime_status BOOLEAN, profileurl TEXT, proofurl TEXT,parttime_image_url TEXT,
    FOREIGN KEY(email) REFERENCES businesslogin(email_id) ON DELETE CASCADE

)