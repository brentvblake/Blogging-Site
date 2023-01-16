const express = require("express");
const router = express.Router();
const assert = require('assert');

// populates user home page with articles and blog info from an author
router.get("/reader-home", (req, res) => {
    // get blog info
    global.db.get("SELECT * FROM blogs", (err, row) => {
        if (err) {
            next(err);
        } else {
            const { blogTitle, blogSubtitle, author } = row;
            // get articles
            global.db.all("SELECT * FROM articles WHERE published = 1 ORDER BY publishedDate DESC", (err, rows) => {
                if (err) {
                    next(err);
                } else {
                    const articles = rows;
                    res.render("reader-home", { blogTitle, blogSubtitle, author, articles });
                }
            });
        }
    });
});

// populates the article page with the article, comments, likes and views
router.get("/article/:id", (req, res, next) => {
    const articleId = req.params.id;
    // get articles info
    global.db.all("SELECT * FROM articles WHERE id = ?", [articleId], (err, rows) => {
        if (err) {
            next(err);
        } else if (!rows.length) {
            res.status(404).json({error: "Article not found"});
        } else {
            const article = rows[0];
            // get comments from an article
            global.db.all("SELECT * FROM comments WHERE articleId = ? ORDER BY createdAt DESC", [articleId], (err, comments) => {
                if (err) {
                    next(err);
                } else {
                    res.render("reader-article", { article, comments });
                }
            });
        }
    });
});

// add a comment to the article
router.post("/article/:id/comment", (req, res, next) => {
    const articleId = req.params.id;
    const comment = req.body.comment;
    // Validate the comment input
    if (!comment) {
        return res.status(400).json({error: "Comment is required"});
    }
    // Insert the comment into the database
    let publishedDate = new Date().toISOString().slice(0,19).replace('T', ' ') + " UTC";
    global.db.run("INSERT INTO comments (articleId, comment, createdAt) VALUES (?, ?, ?)", [articleId, comment, publishedDate], function (err) {
        if (err) {
            next(err);
        } else {
            res.redirect(`/reader/article/${articleId}`);
        }
    });
});

// increment likes when like button is hit
router.get("/article/:id/like", (req, res, next) => {
    const articleId = req.params.id;
    global.db.run("UPDATE articles SET likes = likes + 1 WHERE id = ?", [articleId], function (err) {
        if (err) {
            next(err);
        } else {
            res.redirect(`/reader/article/${articleId}`);
        }
    });
});

// increment dislikes when dislike button is hit
router.get("/article/:id/dislike", (req, res, next) => {
    const articleId = req.params.id;
    global.db.run("UPDATE articles SET dislikes = dislikes + 1 WHERE id = ?", [articleId], function (err) {
        if (err) {
            next(err);
        } else {
            res.redirect(`/reader/article/${articleId}`);
        }
    });
});

//if reader clicks on article link then views get incremented
router.get("/article/:id/view", (req, res, next) => {
    const articleId = req.params.id;
    global.db.run("UPDATE articles SET views = views + 1 WHERE id = ?", [articleId], function (err) {
        if (err) {
            next(err);
        } else {
            res.redirect(`/reader/article/${articleId}`);
        }
    });
});


module.exports = router;