app.controller('MoviesController', function($scope, $http, $q) {
	var base_url;
	$scope.movies = [];

	$http.get('https://api.themoviedb.org/3/configuration?api_key=' + api_key)
		.then(function(data) {
			console.log(data);
			base_url = data.data.images.base_url;
			populateMovies();
		});

	function populateMovies() {
		$http.get('https://api.themoviedb.org/3/collection/528?api_key=' + api_key)
			.then(function(data) {
				var credits_promises = [];
				
				$scope.movies = data.data.parts;
				$scope.selected_movie = $scope.movies[0];

				$scope.movies.forEach(function(movie) {
					movie.writers = [];
					movie.stars = [];
					movie.actors = [];

					$http.get('https://api.themoviedb.org/3/movie/' + movie.id + '?api_key=' + api_key)
						.then(function(data) {
							movie.poster_url = base_url + 'w185' + data.data.poster_path;
							movie.thumb_url = base_url + 'w154' + data.data.poster_path;
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