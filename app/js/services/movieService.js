app.service('movieService', function($http, $q) {
	this.getConfig = function() {
		return $http.get('https://api.themoviedb.org/3/configuration?api_key=' + api_key)
			.then(function(data) {
				return data.data.images.base_url;
			});
	};
})