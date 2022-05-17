const express = require("express");
const { getAllMovies , createMovie, updateMovie, deleteMovie,getMovieDetails, createMovieReview, getMovieReviews, deleteReview,getAdminMovies} = require("../controllers/movieController");
const {isAuthenticatedUser,authorizedRoles} = require("../midlleware/auth");
const { route } = require("./userRoute");
const router = express.Router();

router.route("/movies").get(getAllMovies);

router.route("/admin/movies").get(isAuthenticatedUser,authorizedRoles("admin"),getAdminMovies);

router.route("/admin/movie/new").post(isAuthenticatedUser,authorizedRoles("admin"),createMovie);

router.route("/admin/movie/:id")
.put(isAuthenticatedUser,authorizedRoles("admin"),updateMovie)
.delete(isAuthenticatedUser,authorizedRoles("admin"),deleteMovie)

router.route("/movie/:id").get(getMovieDetails);

router.route("/review").put(isAuthenticatedUser,createMovieReview);

router.route("/reviews").get(getMovieReviews).delete(isAuthenticatedUser,deleteReview);

module.exports = router
