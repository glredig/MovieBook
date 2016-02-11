app.controller('MoviesController', function($scope) {
	$scope.movies = [
		{ 
			title: 'terminator', 
			year: '1986'
		},
		{
			title: 'terminator 2: judgement day',
			year: '1992'
		}
	]

	$scope.selected_movie = $scope.movies[0];
	$scope.movies[0].selected = true;

	$scope.updateSelected = function(movie) {
		$scope.movies.forEach(function(movie) {
			movie.selected = false
		});
		movie.selected = true;
		$scope.selected_movie = movie;
	};
});