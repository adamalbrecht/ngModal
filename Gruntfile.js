module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    coffee: {
      compile: {
        files: {
          "spec/build/specs.js": ["spec/*.coffee"],
          "dist/ng-modal.js": ["src/*.coffee"]
        }
      }
    },
    uglify: {
      my_target: {
        files: {
          "dist/ng-modal.min.js": "dist/ng-modal.js"
        }
      }
    },
    less: {
      compile: {
        files: {
          "dist/ng-modal.css": ["src/ng-modal.less"]
        }
      }
    },
    watch: {
      scripts: {
        files: ['**/*.coffee', '**/*.less'],
        tasks: ['coffee', 'uglify', 'less'],
        options: {
          debounceDelay: 250,
        },
      }
    },
    zip: {
      'package': {
        cwd: 'dist/',
        src: ['dist/*.js', 'dist/*.css'],
        dest: 'dist/ng-modal.zip'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-zip');

  grunt.registerTask('default', ['coffee', 'uglify', 'less', 'watch']);
  grunt.registerTask('package', ['coffee', 'uglify', 'less', 'zip']);
};
