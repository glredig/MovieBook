describe('movieService', function() {
	var movieService, httpBackend;

	beforeEach(module('app'));

	beforeEach(inject(function(_movieService_, $httpBackend) {
		movieService = _movieService_;
		httpBackend = $httpBackend;
	}));

	describe('getCollection', function() {
		it('should return a movie object with default id and movie info object', function() {
			httpBackend.whenGET('https://api.themoviedb.org/3/collection/1?api_key=' + api_key).respond(
				{
					parts: [
						{
							id: 5,
							title: 'Terminator'
						},
						{
							id: 10,
							title: 'Terminator 2'
						}
					]
				});


			movieService.getCollection(1).then(function(movies) {
				var movies_data = {
					5: {
						id: 5,
						title: 'Terminator'
					},
					10: {
						id: 10,
						title: 'Terminator 2'
					}
				};
				expect(movies.first_id).toBe(5);
				expect(movies.movies_data).toEqual(movies_data);
			});
			httpBackend.flush();
		});
	});

	describe('getMovie', function() {

	});
});