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
        // qs == querysnapchot
        const qs = await db.collection("movies").get()
        let results = []
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

        if ((req.body).length > 0) {
            const bodyData = JSON.parse(req.body)
            const qs = await db.collection("movies").doc().set(bodyData);

            let results = []
            const qsCallback = await db.collection("movies").get()
            qsCallback.forEach(doc => results.push(doc.data()))
            console.log(results)
            res.send(results)
        }
        else {
            res.send('Rien à ajouter dans la base de données films')
        }
    })

    /**
     * PATCH /:movieId
     * Updates attributes of a pre-existing movie
     */
    router.patch("/v1/movies/:movieId", async (req, res) => {
        console.log('méthode patch')

        if ((req.params.movieId).length > 0 &&
            (req.body).length > 0) {
            const bodyData = JSON.parse(req.body)
            const qs = await db.collection("movies").doc(req.params.movieId).update(bodyData)

            const qsCallback = await db.collection("movies").doc(req.params.movieId).get()
            let result = qsCallback.data()
            console.log(result)
            res.send(result)
        }
        else {
            res.send('Rien à modifier dans la base de données films')
        }
    })

    /**
     * PATCH /:movieId/like
     * Adds a like to a pre-existing movie
     */
    router.patch("/v1/movies/:movieId/like", async (req, res) => {
        console.log('méthode patch +1 like')

        if ((req.params.movieId).length > 0) {
            // NB : works even if the attribute "likes" is undefined
            const qs = await db.collection("movies").doc(req.params.movieId).update({ likes: admin.firestore.FieldValue.increment(1) })

            const qsCallback = await db.collection("movies").doc(req.params.movieId).get()
            let result = qsCallback.data()
            console.log(result)
            res.send(result)
        }
        else {
            res.send('Identifiant du film incorrect')
        }
    })

    /**
     * DELETE /:movieId
     * Deletes a movie by its id
     */
    router.delete("/v1/movies/:movieId", async (req, res) => {
        console.log('delete movie')

        if ((req.params.movieId).length > 0) {
            const qs = await db.collection("movies").doc(req.params.movieId).delete()
            res.send('Movie id ' + req.params.movieId + ' successfully deleted !')
        }
        else {
            res.send('Identifiant du film incorrect')
        }
    })

    // ----------------------------- CATEGORIES ----------------------------- //
    /**
     * GET /
     * gets all the categories
     */
    router.get("/v1/categories", async (req, res) => {
        console.log('GET all categories')

        const qs = await db.collection("categories").get()
        let results = []
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
        console.log(req.body)

        if ((req.body).length > 0) {
            let results = []
            const bodyData = JSON.parse(req.body)
            const qs = await db.collection("categories").doc().set(bodyData);

            const qsCallback = await db.collection("categories").get()
            qsCallback.forEach(doc => results.push(doc.data()))
            console.log(results)
            res.send(results)
        }
        else {
            res.send('Rien à ajouter dans la base de données catégories')
        }
    })

    /**
     * PUT /:categoryId
     * Changes the category
     */
    router.put("/v1/categories/:categoryId", async (req, res) => {
        console.log('category patch')

        if ((req.body).length > 0 &&
            (req.params.categoryId).length > 0) {
            const bodyData = JSON.parse(req.body)
            const qs = await db.collection("categories").doc(req.params.categoryId).update(bodyData)

            let result = null
            const qsCallback = await db.collection("categories").doc(req.params.categoryId).get()
            result = qsCallback.data()
            console.log(result)
            res.send(result)
        }
        else {
            res.send('Rien à modifier dans les catégories')
        }
    })

    /**
     * DELETE /:categoryId
     * Deletes a specific category
     */
    router.delete("/v1/categories/:categoryId", async (req, res) => {
        console.log('delete category')

        if ((req.params.categoryId).length > 0) {
            const qs = await db.collection("categories").doc(req.params.categoryId).delete()
            res.send('Category id ' + req.params.categoryId + ' successfully deleted !')
        }
        else {
            res.send('Identifiant de la catégorie incorrect')
        }
    })

    return router
}

module.exports = monRouter