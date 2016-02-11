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
					$http.get('https://api.themoviedb.org/3/movie/' + movie.id + '?api_key=' + api_key)
						.then(function(data) {
							movie.poster_url = base_url + 'w185' + data.data.poster_path;
							movie.thumb_url = base_url + 'w154' + data.data.poster_path;
						});
				});
			});
	}

	$scope.updateSelected = function(movie) {
		$scope.selected_movie = movie;
	};
});