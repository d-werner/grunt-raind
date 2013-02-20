module.exports = function(grunt) {

  grunt.config.init({

    pkg : grunt.file.readJSON('package.json'),

    meta : {
      banner : "/*! <%= pkg.id %> - v<%= pkg.version %> - " + "<%= grunt.template.today('yyyy-mm-dd') %>*/\n\n"
    },

    files : {
      css : "components/**/client/css/**/*.css",
      template : "components/**/client/templates/**/*.html"
    },

    watch : {
      raind : {
        files : [ "<%= files.css %>", "<%= files.template %>" ],
        tasks : "raind-restart"
      }
    }
  });

  grunt.registerTask("raind", ["raind-restart", "watch:raind"]);

  grunt.loadTasks("node_modules/grunt-contrib-watch/tasks");
  grunt.loadTasks("node_modules/grunt-raind/tasks");
};