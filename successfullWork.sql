CREATE TABLE successfulWork (
    sid INTEGER PRIMARY KEY,
    notificationNumber INTEGER UNIQUE,
    timeWorked TEXT,
    startTime TEXT,
    finishedTime TEXT,
    chargedAmount INTEGER,
    userId TEXT,
    captainId TEXT,
    FOREIGN KEY (notificationNumber) REFERENCES notificationNum(notificationNumber)
);
