
-- This makes sure that foreign_key constraints are observed and that errors will be thrown for violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

--create your tables with SQL commands here (watch out for slight syntactical differences with SQLite)

CREATE TABLE IF NOT EXISTS testUsers (
    test_user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS testUserRecords (
    test_record_id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_record_value TEXT NOT NULL,
    test_user_id  INT, --the user that the record belongs to
    FOREIGN KEY (test_user_id) REFERENCES testUsers(test_user_id)
);

CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    subtitle TEXT,
    content TEXT,
    created DATE,
    lastModified DATE,
    published BOOLEAN,
    publishedDate DATE,
    likes INT,
    dislikes INT,
    views INT
);

CREATE TABLE IF NOT EXISTS blogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    blogTitle TEXT,
    blogSubtitle TEXT,
    author TEXT
);

CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    comment TEXT,
    articleId INT,
    createdAt DATE,
    FOREIGN KEY (articleId) REFERENCES articles(id) ON DELETE CASCADE
);
--insert default data (if necessary here)

INSERT INTO testUsers ("test_name") VALUES ("Simon Star");
INSERT INTO testUserRecords ("test_record_value", "test_user_id") VALUES( "Lorem ipsum dolor sit amet", 1); --try changing the test_user_id to a different number and you will get an error
INSERT INTO articles ("title", "subtitle", "content", "created", "lastModified","published", "publishedDate", "likes", "dislikes", "views") VALUES ("My first article", "This is my first article","Hi everyone this is my first test article", "2018-01-01", "2018-01-01", 0, NULL, 0, 0, 0);
INSERT INTO articles ("title", "subtitle", "content", "created", "lastModified","published", "publishedDate", "likes", "dislikes", "views") VALUES ("My second article", "This is my second article","Hi everyone this is my second test article", "2019-01-01", "2019-01-01", 1, "2019-01-02", 2, 1, 10);
INSERT INTO blogs ("blogTitle", "blogSubtitle", "author") VALUES ("Things I Ponder About", "The Mind of a Fellow Human", "John Doe");
INSERT INTO comments ("comment", "articleId", "createdAt") VALUES ("This is a comment", 2, "2019-01-02 12:00:00 UTC");
COMMIT;

