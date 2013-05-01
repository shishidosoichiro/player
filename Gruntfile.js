module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
			options: { 
				jshintrc: ".jshintrc" 
			},
			node: {
				options: { 
					node: true
				},
				files: '*.js'
			},
			client: {
				options: { 
					jquery: true
				},
				files: 'src/*.js'
			},
			demo: {
				options: { 
					jquery: true
				},
				files: 'example/*.js'
			}
    },
    concat: {
			dist: {
				src: ['src/player.js', 'src/player-*.js'],
				dest: 'build/player.js'
			}
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'build/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    watch: {
			files: ['<%= jshint.node.files %>', '<%= jshint.client.files %>', '<%= jshint.example.files %>'],
			tasks: ['jshint', 'concat', 'uglify']
		}
  });

  // Load the plugins.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'concat', 'uglify']);

};