describe('movieService', function() {
	var movieService, httpBackend, base = 'base';

	beforeEach(module('app'));

	beforeEach(inject(function(_movieService_, $httpBackend) {
		movieService = _movieService_;
		httpBackend = $httpBackend;
	}));

	describe('getCollection', function() {
		it('should return a movies object with default id and movie info object', function() {
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
		it('should return a movie object with a poster_url and a thumb_url', function() {
			httpBackend.whenGET('https://api.themoviedb.org/3/movie/5?api_key=' + api_key).respond(
			{
				data: {
					id: 5,
					poster_path: '/12345.jpg'
				}
			});

			movieService.getMovie(5).then(function(movie) {
				var movie_data = {
					poster_url: base + '/w185/12345.jpg',
					thumb_url: base + '/w154/12345.jpg'
				};

				expect(movie.poster_url).toEqual(movie_data.poster_url);
				expect(movie.thumb_url).toEqual(movie_data.thumb_url);
			})
		})
	});

	describe('getCredits', function() {
		it('should return writers, stars, actors and director for a given movie', function() {
			httpBackend.whenGET('https://api.themoviedb.org/3/movie/5/credits?api_key=' + api_key).respond(
			{
				data: {
					cast: [
						{
							id: 1,
							name: 'John Doe',
							character: 'Johnny'
						},
						{
							id: 2,
							name: 'Jane Doe',
							character: 'Janie'
						}
					],
					crew: [
						{
							job: 'Director',
							name: 'John Smith'
						},
						{
							job: 'Writer',
							name: 'Michael Jordan'
						},
						{
							job: 'Writer',
							name: 'Kobe Bryant'
						}
					]
				}
			});

			movieService.getCredits(5).then(function(credits) {
				var credits_data = {
					writers: ['Michale Jordan', 'Kobe Bryant'],
					stars: ['John Doe', 'Jane Doe'],
					actors: [
						{name: 'John Doe', character: 'Johnny'}, 
						{name: 'Jane Doe', character: 'Janie'}
					],
					director: 'John Smith'
				};

				expect(credits.writers).toEqual(credits_data.writers);
				expect(credits.stars).toEqual(credits_data.stars);
				expect(credits.actors).toEqual(credits_data.actors);
				expect(credits.director).toEqual(credits_data.director);
			});
		});
	});
});