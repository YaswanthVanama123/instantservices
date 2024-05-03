-- Create Notification Table
CREATE TABLE Notification (
    notificationId INTEGER PRIMARY KEY,
    notificationNumber INTEGER ,
    userId INTEGER NOT NULL,
    skilledWorkerId INTEGER NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(userId),
    FOREIGN KEY (skilledWorkerId) REFERENCES SkilledWorkers(skilledWorkerId)
);