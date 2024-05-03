-- Create Actions Table
CREATE TABLE Actions (
    actionId INTEGER PRIMARY KEY,
    notificationId INTEGER NOT NULL,
    userId INTEGER NOT NULL,
    actionType VARCHAR(10) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (notificationId) REFERENCES Notification(notificationId),
    FOREIGN KEY (userId) REFERENCES Users(userId)
);