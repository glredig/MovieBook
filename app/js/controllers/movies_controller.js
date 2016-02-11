app.controller('MoviesController', function($scope, $http) {
	$scope.movies = [];

	$http.get('https://api.themoviedb.org/3/collection/528?api_key=' + api_key)
		.then(function(data) {
			$scope.movies = data.data.parts;
			$scope.selected_movie = $scope.movies[0];
		});

	$scope.updateSelected = function(movie) {
		$scope.selected_movie = movie;
		console.log(movie);
	};
});