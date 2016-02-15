app.service('movieService', function($http, $q) {
	this.getConfig = function() {
		return $http.get('https://api.themoviedb.org/3/configuration?api_key=' + api_key)
			.then(function(data) {
				return data.data.images.base_url;
			});
	};

	this.getCollection = function(id) {
		return $http.get('https://api.themoviedb.org/3/collection/' + id + '?api_key=' + api_key)
			.then(function(data) {
				var movies = {
					// Inelegant way of ensuring we initialize with the first
					// movie in the collection
					first_id: data.data.parts[0].id,
					movies_data: {}	
				};

				// We want to store our movies as a key/value object to make referencing
				// specific movies (by id) easier
				data.data.parts.forEach(function(movie) {
					movies.movies_data[movie.id] = movie;
				});

				return movies;
			});
	};

	this.getMovie = function(id, base_url) {
		return $http.get('https://api.themoviedb.org/3/movie/' + id + '?api_key=' + api_key)
			.then(function(data) {
				return {
					poster_url: base_url + 'w185' + data.data.poster_path,
					thumb_url: base_url + 'w154' + data.data.poster_path
				}
			});
	}

	this.getCredits = function(id, base_url) {
		return $http.get('https://api.themoviedb.org/3/movie/' + id + '/credits?api_key=' + api_key)
			.then(function(data) {
				var writers = [],
					stars = [],
					actors = [],
					director;

				data.data.crew.forEach(function(member) {
					if (member.job === 'Director') {
						director = member.name;

					}
					else if (member.job === 'Writer') {
						writers.push(member.name);
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

					actors.push(actor);
					if (stars.length < 5) {
						stars.push(actor.name);									
					}
				});

				return {
					writers: writers.length > 0 ? writers : ['None listed'],
					stars: stars,
					actors: actors,
					director: director
				}
			});
	}
})