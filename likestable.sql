CREATE TABLE IF NOT EXISTS reaction (
    lid INTEGER PRIMARY KEY AUTOINCREMENT,
    liketype VARCHAR(20),
    business_email VARCHAR(20),
    user_email VARCHAR(20) UNIQUE,
    reactiontime DATETIME, 
    FOREIGN KEY(business_email) REFERENCES businesslogin(email_id) ON DELETE CASCADE,
    FOREIGN KEY(user_email) REFERENCES userlogin(email_id) ON DELETE CASCADE
);
