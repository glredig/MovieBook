describe('MoviesController', function() {
	var $rootScope,
		$scope,
		controller;

	beforeEach(function() {
		module('app');

		inject(function($injector) {
			$rootScope = $injector.get('$rootScope');
			$scope = $rootScope.$new();
			controller = $injector.get('$controller')('MoviesController', {$scope: $scope});
		});
	});

	describe('Actions', function() {
		describe('updateSelectedMovie', function() {
			describe('movie cached', function() {
				it('sets selected_movie to cached movie', function() {
					var movie = {
						id: 2,
						title: 'Terminator 2',
						actors: ['Arnold']
					};

					spyOn($scope, 'updateSelectedActor');

					$scope.movies = {
						1: {
							id: 1, 
							title: 'Terminator',
							actors: ['Arnold']
						},
						2: {
							id: 2,
							title: 'Terminator 2',
							actors: ['Arnold']
						}
					}
					$scope.selected_movie = undefined;
					$scope.updateSelectedMovie(movie);
					expect($scope.updateSelectedActor).toHaveBeenCalled();
					expect($scope.selected_movie).toEqual(movie);
				});
			});
		});
		
		describe('updateSelectedActor', function() {
			it('should set the selected actor to passed actor', function() {
				var actor = {name: 'Arnold Schwarzenegger'};
				$scope.selected_actor = undefined;
				$scope.updateSelectedActor(actor);
				expect($scope.selected_actor).toEqual(actor);
			});
		});
	});
});