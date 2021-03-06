module.exports = function(grunt) {

  var fs = require('fs');

  // -- CONFIG -------------------------------------------------------------------------------------------------------//

  // Hard coded file config to enforce the convention ;-)
  var config = {
    /**
     * The file where the process ID of the running raind process is stored.
     * Gets created if it does not exist already.
     */
    processFile : ".rain",

    /**
     * The log file containing raind's stdout and stderr output.
     */
    logFile : "raind.log"
  };


  // -- TASKS --------------------------------------------------------------------------------------------------------//

  grunt.registerTask('raind-stop', 'Terminates the RAIN server', function() {
    kill();
  });

  grunt.registerTask('raind-restart', '(Re)starts the RAIN server', function() {
    restart();
  });

  function start() {
    var out = fs.openSync(config.logFile, 'a')
      , err = fs.openSync(config.logFile, 'a');

    try {
      var raindSpawn = grunt.util.spawn({
        cmd : "raind",
        opts : {
          stdio: [ "ignore", out, err ]
        }
      }, function(){});

      _setPid(raindSpawn.pid);
      grunt.log.writeln("Started raind, pid " + raindSpawn.pid +", " +_getTimestamp());
    } catch(ex) {
      grunt.log.error().error(ex);
    }
  }

  function kill() {
    try {
      var processId = _getPid();

      if(processId) {
        process.kill(processId);
        _setPid("");
        grunt.log.writeln("Terminated raind, pid " + processId +", " +_getTimestamp());
      }
    } catch(ex) {
      if(ex.code === "ESRCH") {
        grunt.log.debug("Previous raind process terminated before already.")
      } else {
        grunt.log.error().error(ex);
      }
    }
  }

  function restart() {
    kill();
    start();
  }

  // -- UTIL ---------------------------------------------------------------------------------------------------------//

  function _getPid() {
    try {
      return fs.readFileSync(config.processFile, 'utf8');
    } catch(ex) {
      if(ex.code === "ENOENT") {
        _setPid("");
      } else {
        grunt.fail.warn(ex);
      }
      return null;
    }
  }

  function _setPid(pid) {
    try {
      fs.writeFileSync(config.processFile, pid, 'utf8');
    } catch(ex) {
      grunt.fail.warn(ex);
    }
  }

  function _getTimestamp() {
    var date = new Date();
    return date.getFullYear() + "." + (date.getMonth()+1) + "." + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + " ";
  }

};