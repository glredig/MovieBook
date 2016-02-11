app.controller('MoviesController', function($scope, $http) {
	var base_url;
	$scope.movies = [];

	$http.get('https://api.themoviedb.org/3/configuration?api_key=' + api_key)
		.then(function(data) {
			base_url = data.data.images.base_url;
			populateMovies();
		});

	function populateMovies() {
		$http.get('https://api.themoviedb.org/3/collection/528?api_key=' + api_key)
			.then(function(data) {
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

					$http.get('https://api.themoviedb.org/3/movie/' + movie.id + '/credits?api_key=' + api_key)
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

								movie.actors.push(actor);
								movie.stars.push(actor.name);
							});
						});
				});
			});
	}

	$scope.updateSelected = function(movie) {
		$scope.selected_movie = movie;
	};
});