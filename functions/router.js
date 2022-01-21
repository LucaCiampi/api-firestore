const { body, validationResult } = require('express-validator');
const admin = require("firebase-admin")
const router = require('express').Router()
const monRouter = (db) => {

    // ----------------------------- MOVIES ----------------------------- //
    /**
     * GET /
     * gets all the movies
     */
    router.get("/v1/movies", async (req, res) => {
        let results = []
        const qs = await db.collection("movies").get()
        qs.forEach(doc => {
            let content = doc.data()
            content.identifier = doc.id
            results.push(content)
        })

        res.send(results)
    })

    /**
     * GET /:movieId
     * gets a specific movie
     */
    router.get("/v1/movies/:movieId", async (req, res) => {
        const qs = await db.collection("movies").doc(req.params.movieId).get()
        let result = qs.data()
        result.identifier = qs.id

        res.send(result)
    })

    /**
     * POST /
     * Adds a new movie
     */
    router.post("/v1/movies", async (req, res) => {
        if ((req.body).length > 0) {
            const bodyData = JSON.parse(req.body)
            
            // Verifications
            // if ((bodyData.video).length > 0) {
            //     if (!verifyUrl(bodyData.video)) res.send('URL de la vidéo incorrect')
            // }

            const qs = await db.collection("movies").doc().set(bodyData);

            let results = []
            const qsCallback = await db.collection("movies").get()
            qsCallback.forEach(doc => {
                let content = doc.data()
                content.identifier = doc.id
                results.push(content)
            })

            res.send(results)
        }
        else {
            res.send("Pas d'objet à ajouter")
        }
    })

    /**
     * PATCH /:movieId
     * Updates attributes of a pre-existing movie
     */
    router.patch("/v1/movies/:movieId", async (req, res) => {
        const bodyData = JSON.parse(req.body)
        const qs = await db.collection("movies").doc(req.params.movieId).update(bodyData)

        const qsCallback = await db.collection("movies").doc(req.params.movieId).get()
        let result = qsCallback.data()

        res.send(result)
    })

    /**
     * PATCH /:movieId/like
     * Adds a like to a pre-existing movie
     */
    router.patch("/v1/movies/:movieId/like", async (req, res) => {

        // NB : works even if the attribute "likes" is undefined
        const qs = await db.collection("movies").doc(req.params.movieId).update({ likes: admin.firestore.FieldValue.increment(1) })

        const qsCallback = await db.collection("movies").doc(req.params.movieId).get()
        let result = qsCallback.data()

        res.send(result)
    })

    /**
     * DELETE /:movieId
     * Deletes a movie by its id
     */
    router.delete("/v1/movies/:movieId", async (req, res) => {
        const qs = await db.collection("movies").doc(req.params.movieId).delete()
        res.send('Movie id ' + req.params.movieId + ' successfully deleted !')
    })

    // ----------------------------- CATEGORIES ----------------------------- //
    /**
     * GET /
     * gets all the categories
     */
    router.get("/v1/categories", async (req, res) => {
        let results = []
        // qs = querysnapchot
        const qs = await db.collection("categories").get()
        qs.forEach(doc => results.push(doc.data()))

        res.send(results)
    })

    /**
     * GET /:categoryId
     * gets a specific category
     */
    router.get("/v1/categories/:categoryId", async (req, res) => {
        const qs = await db.collection("categories").doc(req.params.categoryId).get()
        let result = qs.data()

        res.send(result)
    })

    /**
     * POST /
     * Adds a new category
     */
    router.post("/v1/categories", async (req, res) => {
        let results = []
        console.log(req.body)
        const bodyData = JSON.parse(req.body)
        const qs = await db.collection("categories").doc().set(bodyData);

        const qsCallback = await db.collection("categories").get()
        qsCallback.forEach(doc => results.push(doc.data()))

        res.send(results)
    })

    /**
     * PUT /:categoryId
     * Changes the category
     */
    router.put("/v1/categories/:categoryId", async (req, res) => {
        const bodyData = JSON.parse(req.body)
        const qs = await db.collection("categories").doc(req.params.categoryId).update(bodyData)

        let result = null
        const qsCallback = await db.collection("categories").doc(req.params.categoryId).get()
        result = qsCallback.data()

        res.send(result)
    })

    /**
     * DELETE /:categoryId
     * Deletes a specific category
     */
    router.delete("/v1/categories/:categoryId", async (req, res) => {
        const qs = await db.collection("categories").doc(req.params.categoryId).delete()
        res.send('Category id ' + req.params.categoryId + ' successfully deleted !')
    })

    return router
}

/* Verifications */
const urlRegex =  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/g
function verifyUrl(url) {
    if (urlRegex.test(url)) return true
    else return false
}

module.exports = monRouter