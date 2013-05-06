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
			docs: {
				options: { 
					jquery: true
				},
				files: 'docs/*.js'
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
        src: 'build/<%= pkg.main[0] %>',
        dest: 'build/<%= pkg.main[1] %>'
      }
    },
    copy: {
    	main: {
				files: [
					{
						expand: true,
						cwd: 'build/', 
						src: ['<%= pkg.main[1] %>'],
						dest: 'docs/js'
					},
					{
						expand: true,
						cwd: 'components/jquery/', 
						src: ['jquery.min.js'],
						dest: 'docs/js/'
					},
					{
						expand: true,
						cwd: 'components/bootstrap/docs/assets/css', 
						src: ['**'],
						dest: 'docs/css/'
					},
					{
						expand: true,
						cwd: 'components/bootstrap/docs/assets/js', 
						src: ['bootstrap.min.js', 'html5shiv.js'],
						dest: 'docs/js/'
					},
					{
						expand: true,
						cwd: 'components/bootstrap/docs/assets/img', 
						src: ['glyphicons-halflings-white.png', 'glyphicons-halflings.png'],
						dest: 'docs/img/'
					}
				]
    	}
    },
    watch: {
			files: ['<%= jshint.node.files %>', '<%= jshint.client.files %>', '<%= jshint.docs.files %>'],
			tasks: ['jshint', 'concat', 'uglify']
		}
  });

  // Load the plugins.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'copy']);

};