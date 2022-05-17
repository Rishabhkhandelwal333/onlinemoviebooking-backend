const Movie = require("../models/movieModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../midlleware/cathAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");

//create movie --admin
exports.createMovie = catchAsyncErrors(async (req, res, next) => {
    let images = [];

    if (typeof req.body.images === "string") {
        images.push(req.body.images);

    }
    else {
        images = req.body.images;

    }

    const imagesLink = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "movies",

        });

        imagesLink.push({
            public_id: result.public_id,
            url: result.secure_url,

        })
    }

    req.body.images = imagesLink;
    req.body.user = req.user.id;





    const movie = await Movie.create(req.body);
    res.status(201).json({
        success: true,
        movie,
    });
});
//Get all Movies
exports.getAllMovies = catchAsyncErrors(async (req, res) => {
    const resultPerPage = 5;
    const movieCount = await Movie.countDocuments();

    const apiFeature = new ApiFeatures(Movie.find(), req.query).search().filter().pagination(resultPerPage);
    const movies = await apiFeature.query;

    res.status(200).json({
        success: true,
        movies,
        movieCount,
        resultPerPage,

    })
})

//Get all Movies --admin
exports.getAdminMovies = catchAsyncErrors(async (req, res) => {

    const movies = await Movie.find();

    res.status(200).json({
        success: true,
        movies,
    })
})


//Update Movie -- admin

exports.updateMovie = catchAsyncErrors(async (req, res, next) => {
    let movie = await Movie.findById(req.params.id);
    if (!movie) {
        return next(new ErrorHandler("Movie Not Found", 404));
    }

    let images = [];

    if (typeof req.body.images === "string") {
        images.push(req.body.images);

    }
    else {
        images = req.body.images;

    }
    if (images !== undefined) {
        // Deleting images from cloudnary 
        for (let i = 0; i < movie.images.length; i++) {
            await cloudinary.v2.uploader.destroy(movie.images[i].public_id);

        }


        const imagesLink = [];

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "movies",

            });

            imagesLink.push({
                public_id: result.public_id,
                url: result.secure_url,

            })
        }

        req.body.images=imagesLink;
        

    }

    movie = await Movie.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({
        success: true,
        movie
    })
})

//Delete Movie 

exports.deleteMovie = catchAsyncErrors(async (req, res, next) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
        return next(new ErrorHandler("Movie Not Found", 404));
    }
    // Deleting images from cloudnary 
    for (let i = 0; i < movie.images.length; i++) {
        await cloudinary.v2.uploader.destroy(movie.images[i].public_id);

    }
    await movie.remove();
    res.status(200).json({
        success: true,
        message: "Movie Deleted Sucessfully",
        isDeleted: true,
    })
})

// Get Movie Details 

exports.getMovieDetails = catchAsyncErrors(async (req, res, next) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
        return next(new ErrorHandler("Movie Not Found", 404));
    }
    res.status(200).json({
        success: true,
        movie,
    })

})


//Create new review or Update the review

exports.createMovieReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, movieId } = req.body

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    const movie = await Movie.findById(movieId);
    const isReviewed = movie.reviews.find(rev => rev.user.toString() === req.user._id.toString());

    if (isReviewed) {

        movie.reviews.forEach(rev => {
            rev.rating = rating,
                rev.comment = comment

        });


    } else {
        movie.reviews.push(review)
        movie.numOfReviews = movie.reviews.length
    }

    let avg = 0;

    movie.ratings = movie.reviews.forEach(rev => {
        avg += rev.rating
    })
    movie.ratings = avg / movie.reviews.length;

    await movie.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
    });
});

//Get all reviews of a movie 

exports.getMovieReviews = catchAsyncErrors(async (req, res, next) => {

    const movie = await Movie.findById(req.query.movieId);

    if (!movie) {
        return next(new ErrorHandler("Movie Not Found", 404));
    }

    res.status(200).json({
        success: true,
        reviews: movie.reviews,
    });

});

//delete a review


exports.deleteReview = catchAsyncErrors(async (req, res, next) => {

    const movie = await Movie.findById(req.query.movieId);

    if (!movie) {
        return next(new ErrorHandler("Movie Not Found", 404));
    }

    const reviews = movie.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id.toString());

    let avg = 0;

    reviews.forEach(rev => {
        avg += rev.rating
    });

    let ratings=0;
    if(reviews.length === 0){
        ratings=0;
    }
    else{

        ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length;
    await Movie.findByIdAndUpdate(req.query.movieId, {
        reviews, ratings, numOfReviews
    });


    res.status(200).json({
        success: true,
    });

});
