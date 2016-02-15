// karma.conf.js
module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
    	'lib/angular-1.4.8.min.js',
    	'lib/angular-mocks-1.4.8.js',
    	'app/**/*.js',
    	'tests/**/*.js'
    	]
  });
};