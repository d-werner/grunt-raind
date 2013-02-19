module.exports = function(grunt) {

  var fs = require('fs');
//    , exec = require('child_process').exec
//    , spawn = require('child_process').spawn;


  // -- CONFIG -------------------------------------------------------------------------------------------------------//

  // The file where the process ID of the runnin raind process is stored.
  // Gets created if it does not exist already.
  var processFile = ".rain";

  // The log file containing raind's stdout and stderr output.
  var logFile = "raind.log";

  // -- TASKS --------------------------------------------------------------------------------------------------------//

  grunt.registerTask('kill-raind', 'Terminates the RAIN daemon', function() {
    kill();
  });

  grunt.registerTask('restart-raind', 'Restarts the RAIN daemon', function() {
    restart();
  });

  function start() {
    var out = fs.openSync(logFile, 'a')
      , err = fs.openSync(logFile, 'a')
      , raindSpawn = grunt.util.spawn({
        cmd : "raind",
        opts : {
          stdio: [ "ignore", out, err ]
        }
      });

    try {
      _setPid(raindSpawn.pid);
      grunt.log.writeln("Started raind, pid " + raindSpawn.pid +", " +_getDateString());
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
        grunt.log.writeln("Terminated raind, pid " + processId +", " +_getDateString());
      }
    } catch(ex) {
      grunt.log.error().error(ex);
    }
  }

  function restart() {
    kill();
    start();
  }

  // -- UTIL ---------------------------------------------------------------------------------------------------------//

  function _getPid() {
    try {
      return fs.readFileSync(processFile, 'utf8');
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
      fs.writeFileSync(processFile, pid, 'utf8');
    } catch(ex) {
      grunt.fail.warn(ex);
    }
  }

  function _getDateString() {
    var today = new Date();
    return today.getFullYear() + "." + (today.getMonth()+1) + "." + today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + " ";
  }


//  function start(callback) {
//    var cdProc = spawn("cd", [rootPath])
//      , out = fs.openSync(logFile, 'a')
//      , err = fs.openSync(logFile, 'a');
//
//    cdProc.stderr.on('data', function (data) {
//      grunt.log.error(data);
//    });
//
//    cdProc.on("exit", function(code) {
//      if(code) {
//        onCdExit();
//      }
//    });
//
//    function onCdExit() {
//      var raindProc = spawn("raind", [], {
//        detached : true,
//        stdio: [ "ignore", out, err ]
//      });
//      raindProc.unref();
//
//      callback(raindProc.pid);
//    }
//  }
//
//  function kill(callback) {
//    grunt.log.debug("kill");
//
//    exec("ps aux | grep raind", function(error, stdout, stderr) {
//      grunt.log.debug(stdout);
//      var pids = stdout.split("\n").map(function(line) {
//        var match = line.match(/\d+/);
//        return match ? match[0] : null;
//      });
//
//      pids.forEach(function(pid) {
//        if ( pid && pid != process.pid ) {
//          grunt.log.debug(_getDateString() + "kill", pid);
//
//          try {
//            process.kill(pid);
//          } catch(error) { }
//        }
//      });
//
//      callback();
//    });
//  }

};