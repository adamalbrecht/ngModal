module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    coffee: {
      compile: {
        files: {
          "spec/build/specs.js": ["spec/*.coffee"],
          "build/ng-modal.js": ["src/*.coffee"]
        }
      }
    },
    uglify: {
      my_target: {
        files: {
          "build/ng-modal.min.js": "build/ng-modal.js"
        }
      }
    },
    less: {
      compile: {
        files: {
          "build/ng-modal.css": ["src/ng-modal.less"]
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
    }
  });

  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['coffee', 'uglify', 'less', 'watch']);
};
