const admin = require("firebase-admin")
const router = require('express').Router()
const monRouter = (db) => {

    // ----------------------------- MOVIES ----------------------------- //
    /**
     * GET /
     * gets all the movies
     */
    router.get("/v1/movies", async (req, res) => {
        console.log('get all the movies')
        let results = []
        // qs == querysnapchot
        const qs = await db.collection("movies").get()
        qs.forEach(doc => results.push(doc.data()))
        console.log(results)
        res.send(results)
    })

    /**
     * GET /:movieId
     * gets a specific movie
     */
    router.get("/v1/movies/:movieId", async (req, res) => {
        console.log('get a specific movie')
        const qs = await db.collection("movies").doc(req.params.movieId).get()
        let result = qs.data()
        console.log(result)
        res.send(result)
    })

    /**
     * POST /
     * Adds a new movie
     */
    router.post("/v1/movies", async (req, res) => {
        console.log('méthode post')
        console.log(req.body)
        const bodyData = JSON.parse(req.body)
        const qs = await db.collection("movies").doc().set(bodyData);

        let results = []
        const qsCallback = await db.collection("movies").get()
        qsCallback.forEach(doc => results.push(doc.data()))
        console.log(results)
        res.send(results)
    })

    /**
     * PATCH /:movieId
     * Updates attributes of a pre-existing movie
     */
    router.patch("/v1/movies/:movieId", async (req, res) => {
        console.log('méthode patch')
        const bodyData = JSON.parse(req.body)
        const qs = await db.collection("movies").doc(req.params.movieId).update(bodyData)

        const qsCallback = await db.collection("movies").doc(req.params.movieId).get()
        let result = qsCallback.data()
        console.log(result)
        res.send(result)
    })

    /**
     * PATCH /:movieId/like
     * Adds a like to a pre-existing movie
     */
    router.patch("/v1/movies/:movieId/like", async (req, res) => {
        console.log('méthode patch +1 like')

        // NB : works even if the attribute "likes" is undefined
        const qs = await db.collection("movies").doc(req.params.movieId).update({ likes: admin.firestore.FieldValue.increment(1) })

        const qsCallback = await db.collection("movies").doc(req.params.movieId).get()
        let result = qsCallback.data()
        console.log(result)
        res.send(result)
    })

    /**
     * DELETE /:movieId
     * Deletes a movie by its id
     */
    router.delete("/v1/movies/:movieId", async (req, res) => {
        console.log('delete movie')
        const qs = await db.collection("movies").doc(req.params.movieId).delete()
        res.send('Movie id ' + req.params.movieId + ' successfully deleted !')
    })

    // ----------------------------- CATEGORIES ----------------------------- //
    /**
     * GET /
     * gets all the categories
     */
    router.get("/v1/categories", async (req, res) => {
        console.log('GET all categories')
        let results = []
        // qs = querysnapchot
        const qs = await db.collection("categories").get()
        qs.forEach(doc => results.push(doc.data()))
        console.log(results)
        res.send(results)
    })

    /**
     * GET /:categoryId
     * gets a specific category
     */
    router.get("/v1/categories/:categoryId", async (req, res) => {
        console.log('catégorie spécifique')
        const qs = await db.collection("categories").doc(req.params.categoryId).get()
        let result = qs.data()
        console.log(result)
        res.send(result)
    })

    /**
     * POST /
     * Adds a new category
     */
    router.post("/v1/categories", async (req, res) => {
        console.log('category post')
        let results = []
        console.log(req.body)
        const bodyData = JSON.parse(req.body)
        const qs = await db.collection("categories").doc().set(bodyData);

        const qsCallback = await db.collection("categories").get()
        qsCallback.forEach(doc => results.push(doc.data()))
        console.log(results)
        res.send(results)
    })

    /**
     * PUT /:categoryId
     * Changes the category
     */
    router.put("/v1/categories/:categoryId", async (req, res) => {
        console.log('category patch')
        const bodyData = JSON.parse(req.body)
        const qs = await db.collection("categories").doc(req.params.categoryId).update(bodyData)

        let result = null
        const qsCallback = await db.collection("categories").doc(req.params.categoryId).get()
        result = qsCallback.data()
        console.log(result)
        res.send(result)
    })

    /**
     * DELETE /:categoryId
     * Deletes a specific category
     */
    router.delete("/v1/categories/:categoryId", async (req, res) => {
        console.log('delete category')
        const qs = await db.collection("categories").doc(req.params.categoryId).delete()
        res.send('Category id ' + req.params.categoryId + ' successfully deleted !')
    })

    return router
}

module.exports = monRouter