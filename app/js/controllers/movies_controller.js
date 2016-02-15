app.controller('MoviesController', function($scope, $http, $q, movieService) {
	var base_url;
	$scope.movies = [];

	movieService.getConfig()
		.then(function(url) {
			base_url = url;
			populateMovies();
		})

	function populateMovies() {
		movieService.getCollection()
			.then(function(movies) {
				$scope.movies = movies;
				$scope.selected_movie = movies[0];

				populateCredits();
			})
	}

	function populateCredits() {
		var credits_promises = [];
				
		$scope.movies.forEach(function(movie) {
			movie.writers = [];
			movie.stars = [];
			movie.actors = [];

			movieService.getMovie(movie.id, base_url)
				.then(function(images) {
					movie.poster_url = images.poster_url;
					movie.thumb_url = images.thumb_url;
				});

			credits_promises.push($http.get('https://api.themoviedb.org/3/movie/' + movie.id + '/credits?api_key=' + api_key)
				.then(function(data) {
					data.data.crew.forEach(function(member) {
						if (member.job === 'Director') {
							movie.director = member.name;

						}
						else if (member.job === 'Writer') {
							movie.writers.push(member.name);
						}
					});

					data.data.cast.forEach(function(star) {
						var actor = {};

						actor.name = star.name;
						actor.character = star.character;

						if (star.profile_path) {
							actor.thumb_url = base_url + '/w185' + star.profile_path;
							actor.image_url = base_url + '/h632' + star.profile_path;
						}
						else {
							actor.thumb_url = actor.image_url = '';
						}

						movie.actors.push(actor);
						if (movie.stars.length < 5) {
							movie.stars.push(actor.name);									
						}
					});
				}));
		});

		// When all credits are fetched, set the initial selected actor
		$q.all(credits_promises).then(function() {
			$scope.selected_actor = $scope.selected_movie.actors[0]
			;
		});
	}

	$scope.updateSelectedMovie = function(movie) {
		$scope.selected_movie = movie;

		// Make sure to select first actor when switching movies
		$scope.updateSelectedActor(movie.actors[0]);
	};

	$scope.updateSelectedActor = function(actor) {
		$scope.selected_actor = actor;
	}
});