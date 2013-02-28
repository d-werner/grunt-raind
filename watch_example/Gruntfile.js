module.exports = function(grunt) {

  grunt.config.init({

    pkg : grunt.file.readJSON('package.json'),

    meta : {
      banner : "/*! <%= pkg.id %> - v<%= pkg.version %> - " + "<%= grunt.template.today('yyyy-mm-dd') %>*/\n\n"
    },

    files : {
      css : "components/**/client/css/**/*.css",
      template : "components/**/client/templates/**/*.html",
      server : "components/**/server/**/*.js",
      config : "conf/*.conf"
    },

    watch : {
      raind : {
        files : [ "<%= files.css %>", "<%= files.template %>", "<%= files.server %>", "<%= files.config %>" ],
        tasks : "raind-restart"
      }
    }
  });

  grunt.registerTask("raind", ["raind-restart", "watch:raind"]);

  grunt.loadTasks("node_modules/grunt-contrib-watch/tasks");
  grunt.loadTasks("node_modules/grunt-raind/tasks");
};