module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-wrap');
  grunt.initConfig({


    meta: {
      pkg: grunt.file.readJSON('package.json'),
      build: '../js/app/',
      config: '../js/config/',
      production: '../js/public/'
    },


    concat: {
      app: {
        options: {
          banner: '<%= meta.banner %>\n',
          stripBanners: {
            options: 'block'
          }
        },
        src: [
          '<%= meta.config %>app.js',
          '<%= meta.build %>directives/*.js',
          '<%= meta.build %>filters/*.js',
          '<%= meta.build %>controllers/*.js',
          '<%= meta.build %>services/**/*.js'
        ],
        dest: '<%= meta.production %>app.js'
      }
    },


    jshint: {
			files: [
				'Gruntfile.js',
				'../js/app/**/*.js',
				'../js/config/*.js',
				'../js/public/app.js'
			],
			exclude: [
				'../js/public/app.js'
			],
			options: {
				// options here to override JSHint defaults
				globals: {
					console: true,
					sub: true
				}
			}
		},


    watch: {
			concat: {
				files: [
					'../js/app/**/*.js',
					'../js/config/*.js'
				],
				tasks: ['build']
			}
		},
  });

  grunt.registerTask('build', ['jshint', 'concat', 'wrap']);
};
