const { body, check, validationResult } = require('express-validator');
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
    router.post("/v1/movies",
        [body('name').isLength({ min: 3 }),
        body('author').isLength({ min: 3 }),
        body('description').isLength({ min: 3 }),
        body('video').isURL(),
        body('img').isURL()],
        async (req, res) => {

            const errors = validationResult(req)
            console.log(errors);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() })
            }

            const qs = await db.collection("movies").doc().set(req.body);
            let results = []
            const qsCallback = await db.collection("movies").get()
            qsCallback.forEach(doc => {
                let content = doc.data()
                content.identifier = doc.id
                results.push(content)
            })

            res.send(results)
        })

    /**
     * PATCH /:movieId
     * Updates attributes of a pre-existing movie
     */
    router.patch("/v1/movies/:movieId", async (req, res) => {

        const qs = await db.collection("movies").doc(req.params.movieId).update(req.body)

        const qsCallback = await db.collection("movies").doc(req.params.movieId).get()
        let result = qsCallback.data()

        res.send(result)
    })

    /**
     * PATCH /:movieId/like
     * Adds a like to a pre-existing movie
     */
    router.patch("/v1/movies/:movieId/like", async (req, res) => {

        if ((req.params.movieId).length > 0) {
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
        qs.forEach(doc => {
            let content = doc.data()
            content.identifier = doc.id
            results.push(content)
        })

        res.send(results)
    })

    /**
     * GET /:categoryId
     * gets a specific category
     */
    router.get("/v1/categories/:categoryId", async (req, res) => {
        const qs = await db.collection("categories").doc(req.params.categoryId).get()
        let result = qs.data()
        result.identifier = qs.id

        res.send(result)
    })

    /**
     * POST /
     * Adds a new category
     */
    router.post("/v1/categories",
        body('name').isLength({ min: 2 }),
        async (req, res) => {

            const errors = validationResult(req)
            console.log(errors);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() })
            }

            let results = []
            const qs = await db.collection("categories").doc().set(req.body);

            const qsCallback = await db.collection("categories").get()
            qsCallback.forEach(doc => results.push(doc.data()))

            res.send(results)
        })

    /**
     * PUT /:categoryId
     * Changes the category
     */
    router.put("/v1/categories/:categoryId",
        body('name').isLength({ min: 2 }),
        async (req, res) => {

            const errors = validationResult(req)
            console.log(errors);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() })
            }

            const qs = await db.collection("categories").doc(req.params.categoryId).update(req.body)

            const qsCallback = await db.collection("categories").doc(req.params.categoryId).get()
            let result = qsCallback.data()

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

module.exports = monRouter