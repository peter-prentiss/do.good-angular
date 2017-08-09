module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      angular: {
        expand: true,
        cwd: 'node_modules/angular/',
        src: ['angular.min.js', 'angular.min.js.map'],
        dest: 'server/public/vendors/'
      },
      htmlcss: {
        expand: true,
        cwd: 'client/views/',
        src: ['**/*.*'],
        dest: 'server/public/views'
      }
    },
    watch: {
      files: ['client/**/*.*'],
      tasks: ['babel', 'copy']
    },
    babel: {
      options: {
        presets: ['babel-preset-env']
      },
      scripts: {
        files: [{
          expand: true,
          cwd: 'client/scripts/',
          src: ['**/*.*'],
          dest: 'temp',
          ext: '.js'
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-babel');

  grunt.registerTask('default', ['babel', 'copy', 'watch']);
}
