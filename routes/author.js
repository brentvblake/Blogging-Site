/**
 * These are example routes for user management
 * This shows how to correctly structure your routes for the project
 */

const express = require("express");
const router = express.Router();
const assert = require('assert');

// retrieve all articles from the database to populate the home page
router.get("/home", (req, res, next) => {
// get all articles from the database
    global.db.all("SELECT * FROM articles", function (err, rows) {
        if (err) {
            next(err);
        } else {
            // filter the articles into drafts and published articles
            const drafts = rows.filter(row => row.published === 0);
            const publishedArticles = rows.filter(row => row.published === 1);
            // get the blog data from the database
            global.db.get("SELECT * FROM blogs", function (err, blogData) {
                if (err) {
                    next(err);
                } else {
                    res.render("home", { drafts, publishedArticles, blogData });
                }
            });
        }
    });
});


// retrieves an article from the database to populate the edit page
router.get("/edit-article/:id", (req, res, next) => {

    let id = req.params.id;
    // get certain article from the database
    global.db.all("SELECT * FROM articles WHERE id = ? AND published = 0", [id], function (err, rows) {
        if (err) {
        next(err); //send the error on to the error handler
        } else {
            res.render("edit-article", {article: rows[0]});
        }
    });
});

// updates an article in the database
router.post("/edit-article", (req, res, next) => {
    let id = req.body.id;
    let title = req.body.title;
    let subtitle = req.body.subtitle;
    let content = req.body.content;
    let lastModified = new Date().toISOString().slice(0,10);
    // update the article in the database with new data
    global.db.run("UPDATE articles SET title = ?, subtitle = ?, content = ?, lastModified = ? WHERE id = ?", [title, subtitle, content, lastModified, id], function (err) {
        if (err) {
            next(err);
        } else {
            res.redirect("/author/home");
        }
    });
});

// renders the create new draft page
router.get("/create-new-draft", (req, res) => {
    res.render("create-new-draft");
});

// creates a new draft in the database
router.post("/create-new-draft", (req, res, next) => {
    let title = req.body.title;
    let subtitle = req.body.subtitle;
    let content = req.body.content;
    let created = new Date().toISOString().slice(0,10);
    let lastModified = new Date().toISOString().slice(0,10);
    let published = 0;
    let publishedDate = null;
    let likes = 0;
    let dislikes = 0;
    let views = 0;
    // insert the new draft into the database
    global.db.run("INSERT INTO articles (title, subtitle, content, created, lastModified, published, publishedDate, likes, dislikes, views) VALUES (?,?,?,?,?,?,?,?,?,?)", [title, subtitle, content, created, lastModified, published, publishedDate, likes, dislikes, views], function (err) {
        if (err) {
            next(err);
        } else {
            res.redirect("/author/home");
        }
    });
});

// moves a draft to the published articles table
router.get("/publish-article/:id", (req, res, next) => {
    let id = req.params.id;
    let publishedDate = new Date().toISOString().slice(0,10);
    // update the article in the database to be a published article
    global.db.run("UPDATE articles SET published = 1, publishedDate = ? WHERE id = ?", [publishedDate, id], function (err) {
        if (err) {
            next(err);
        } else {
            res.redirect("/author/home");
        }
    });
});

// deletes an article from the database
router.get("/delete-article/:id", (req, res, next) => {
    let id = req.params.id;
    // delete the article and comments from that article from the database
    global.db.run("DELETE FROM articles WHERE id = ?", [id], function (err) {
        if (err) {
            next(err);
        } else {
            res.redirect("/author/home");
        }
    });
});

// retrieves the settings page and populates the form with the current blog settings
router.get("/settings", (req, res, next) => {
    // get the blog data from the database
    global.db.all("SELECT * FROM blogs", function (err, rows) {
        if (err) {
        next(err);
        } else {
            res.render("settings", { blogTitle: rows[0].blogTitle, blogSubtitle: rows[0].blogSubtitle, author: rows[0].author });
        }
    });
});

// updates the blog settings in the database
router.post("/settings", (req, res, next) => {
    let blogTitle = req.body.blogTitle;
    let blogSubtitle = req.body.blogSubtitle;
    let author = req.body.author;

    if (!blogTitle || !blogSubtitle || !author) {
        // If any of the inputs are empty, return an error message
        return res.status(400).send({error: 'All fields are required'});
    }
    // update the blog settings in the database
    global.db.run("UPDATE blogs SET blogTitle = ?, blogSubtitle = ?, author = ?", [blogTitle, blogSubtitle, author], function (err) {
        if (err) {
            next(err);
        } else {
            res.redirect("/author/home");
        }
    });
});


module.exports = router;