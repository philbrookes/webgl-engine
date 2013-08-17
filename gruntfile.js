module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		uglify: {
			options: {
			},
			build: {
				src: './webgl-engine/*.js',
				dest: './public/webgl-engine/dist/webgl-engine.min.js'
			}
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// Default task(s).
	grunt.registerTask('default', ['uglify']);
};
