app.controller('MoviesController', function($scope, $q, movieService) {
	var base_url;
	$scope.movies = {};

	// Use TMDB API to grab base url for images, then continue with init
	movieService.getConfig()
		.then(function(url) {
			base_url = url;
			populateMovies();
		})



	// Get all movies in the collection (currently hardcoded
	// to get the Terminator collection)
	function populateMovies() {
		movieService.getCollection(528)
			.then(function(movies) {
				$scope.movies = movies.movies_data;
				$scope.selected_movie = $scope.movies[movies.first_id];

				populatePosters();
			})
	}



	// In order to lazy load, we have to populate the
	// movie posters for all movies in the collection (to 
	// allow for movie selection)
	function populatePosters() {
		var poster_promises = [];

		for (var id in $scope.movies) {

			// Watch out for closure on id
			(function (id) {
				movieService.getMovie(id, base_url)
					.then(function(images) {
						$scope.movies[id].poster_url = images.poster_url;
						$scope.movies[id].thumb_url = images.thumb_url;
					})
				
			})(id);
		}

		// Populate credits for default movie on init
		populateCredits($scope.selected_movie.id);
	}


	// Fetch movie info for movie with @id
	function populateCredits(id) {
		return movieService.getCredits(id, base_url)
			.then(function(credits) {
				$scope.movies[id].writers = credits.writers;
				$scope.movies[id].stars = credits.stars;
				$scope.movies[id].actors = credits.actors;
				$scope.movies[id].director = credits.director;
			})
	}

	$scope.updateSelectedMovie = function(movie) {
		// This will show the spinner
		$scope.selected_movie = undefined;

		if ($scope.movies[movie.id].actors === undefined) {
			populateCredits(movie.id)
				.then(function() {
					$scope.selected_movie = $scope.movies[movie.id];
					
					// Make sure to select first actor when switching movies
					$scope.updateSelectedActor($scope.movies[movie.id].actors[0]);
				})
		}
		else {
			$scope.selected_movie = $scope.movies[movie.id];
					
			// Make sure to select first actor when switching movies
			$scope.updateSelectedActor($scope.movies[movie.id].actors[0]);
		}
	};

	$scope.updateSelectedActor = function(actor) {
		$scope.selected_actor = actor;
	}
});