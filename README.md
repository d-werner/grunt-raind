grunt-raind
===================

> Automatically restarts the [RAIN](https://github.com/rainjs/rainjs) server if CSS and templates are changed.
> To be used as watch task in conjunction with [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch).

## Getting Started (for RAIN developers)
This plugin requires Grunt `~0.4.0` and plugin grunt-contrib-watch to be used meaningfully.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins.

### Installation
As this plugin is not published in npm, you have to add it with its repository URL (together with grunt-contrib-watch) as development dependency to your RAIN project's package.json.

Example:
```js
  "devDependencies" : {
    "grunt" : "0.4.x",
    "grunt-raind" : "git://github.com/d-werner/grunt-raind.git",
    "grunt-contrib-watch" : "*"
  }
```

Install grunt and the plugins with this command in your project root directory.

```shell
npm install
```

### Configuring Grunt

Create a Gruntfile in your project root directory and enable the plugins with these lines of Code:

```js
grunt.loadTasks("node_modules/grunt-contrib-watch/tasks");
grunt.loadTasks("node_modules/grunt-raind/tasks");
```

Setup a watch task that executes task `raind-restart` and watches for file changes in your components' CSS and template directories.
As we want the RAIN server to be up and running immediately, we need a combined task that first executes `raind-restart` to start the server and calling our new watch task afterwards.
This task is registered as `raind` in the following example.

Example:
```js
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
```

This [example](https://github.com/d-werner/grunt-raind/blob/master/watch_example/Gruntfile.js) will be checked-out with the rain plugin.

## Usage

Call Grunt with the task starting the RAIN server and the watch task in your project root directory.
According to the previous example, the command would be:

```shell
grunt raind
```

Terminating the grunt process will also terminate the RAIN server.

## Server logs

The server's STDOUT and STDERR are written into `raind.log` in the project root directory.

## Why is the server not restarted on CSS or template changes?

If the file changes do not trigger the watch task, this could be due to the editor's "safe write" mechanism (s. [watch issue 13](https://github.com/gruntjs/grunt-contrib-watch/issues/13#issuecomment-11179084)).
It is possible to disable this feature in IntelliJ IDEs by unchecking `IDE Settings > General > Use "safe write"`
