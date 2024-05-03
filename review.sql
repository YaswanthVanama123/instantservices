CREATE TABLE IF NOT EXISTS review(
    rid INTEGER PRIMARY KEY AUTOINCREMENT,
    business_email VARCHAR(200),
    user_email VARCHAR(200),
    review_time DATETIME,
    content TEXT,
    likecount INTEGER,
    unlikecount INTEGER,
    FOREIGN KEY(business_email) REFERENCES businesslogin(email_id) ON DELETE CASCADE,
    FOREIGN KEY(user_email) REFERENCES userlogin(email_id) ON DELETE CASCADE
);
