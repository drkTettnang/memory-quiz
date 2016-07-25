/* global module:false */
module.exports = function(grunt) {
   grunt.initConfig({
      app: grunt.file.readJSON('package.json'),
      sass: {
         dist: {
            options: {
               style: 'expanded'
            },
            files: {
               'css/style.css': 'scss/style.scss'
            }
         }
      },
      autoprefixer: {
         no_dest: {
            src: 'css/style.css'
         }
      },
      prettysass: {
         options: {
            alphabetize: false,
            indent: 4
         },
         jsxc: {
            src: ['scss/*.scss']
         }
      },
      jshint: {
         options: {
            jshintrc: '.jshintrc'
         },
         gruntfile: {
            src: 'Gruntfile.js'
         },
         files: ['js/*.js']
      },
      jsbeautifier: {
         files: ['js/*.js'],
         options: {
            config: '.jsbeautifyrc'
         }
      },
      watch: {
         css: {
            files: ['scss/*'],
            tasks: ['sass', 'autoprefixer']
         }
      }
   });
   
   grunt.loadNpmTasks('grunt-contrib-sass');
   grunt.loadNpmTasks('grunt-contrib-watch');
   grunt.loadNpmTasks('grunt-autoprefixer');
   grunt.loadNpmTasks('grunt-contrib-jshint');
   grunt.loadNpmTasks('grunt-jsbeautifier');
   grunt.loadNpmTasks('grunt-prettysass');
   
   grunt.registerTask('default', [ 'commit', 'watch' ]);
   
   grunt.registerTask('commit', [ 'prettysass', 'sass', 'autoprefixer', 'jsbeautifier', 'jshint' ]);
};
