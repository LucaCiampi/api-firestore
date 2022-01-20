const functions = require("firebase-functions");
const admin = require("firebase-admin")
const express = require("express")
const monRouter = require("./router");

// Initialize firebase in order to access its services
admin.initializeApp(functions.config().firebase);

// initialize the database
const db = admin.firestore()

// Creates express server
const app = express()

// Uses the middleware
app.use(monRouter(db))

exports.api = functions.region('europe-west3').https.onRequest(app)
