app.service('movieService', function($http, $q) {
	this.getConfig = function() {
		return $http.get('https://api.themoviedb.org/3/configuration?api_key=' + api_key)
			.then(function(data) {
				return data.data.images.base_url;
			});
	};

	this.getCollection = function() {
		return $http.get('https://api.themoviedb.org/3/collection/528?api_key=' + api_key)
			.then(function(data) {
				return data.data.parts;
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
})