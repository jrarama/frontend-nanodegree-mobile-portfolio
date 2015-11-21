(function() {
    'use strict';

    var ngrok = require('ngrok');

    module.exports = function(grunt) {

        // Load grunt tasks
        require('load-grunt-tasks')(grunt);

        // Grunt configuration
        var config = {
            pkg: grunt.file.readJSON('package.json'),
            inline: { },
            cssmin: {
                options: {
                    shorthandCompacting: false,
                    roundingPrecision: -1
                },
                pizza: {
                    files: {
                      './css/pizza.min.css': ['./css/bootstrap-grid.css', './css/pizza.css']
                    }
                },
                main: {
                    files: {
                      './css/style.min.css': ['./css/style.css'],
                      './css/print.min.css': ['./css/print.css']
                    }
                }
            },
            uglify: {
                options: {
                    mangle: false,  // Use if you want the names of your functions and variables unchanged
                },
                views: {
                    files: {
                        './js/pizza.min.js': ['./js/pizza.js'],
                    }
                },
                main: {
                    files: {
                        './js/perfmatters.min.js': ['./js/perfmatters.js'],
                    }
                },
            },
            jshint: {
                all: ['Gruntfile.js', './js/**/*.js', '!./js/**/*.min.js'],
                options: {
                    undef: true,
                    curly: true,
                    eqnull: true,
                    globals: {
                        document: false,
                        window: false,
                        require: false,
                        console: false,
                        module: false
                    }
                }
            },
            htmlmin: {                                     // Task
                dist: {                                      // Target
                    options: {                                 // Target options
                        removeComments: true,
                        collapseWhitespace: true,
                        preserveLineBreaks: true,
                        minifyJS: true
                    },
                    files: {

                    }
                }
            },
            watch: {
                scripts: {
                    files: ['./js/**/*.js', '!./js/**/*.min.js'],
                    tasks: ['jshint:all', 'uglify', 'psi-ngrok'],     //tasks to run
                    options: {
                        livereload: true                        //reloads the browser
                    }
                },
                styles: {
                    files: [ './css/**/*.css', '!./css/**/*.min.css' ],
                    tasks: ['cssmin', 'psi-ngrok'],     //tasks to run
                    options: {
                        livereload: true                        //reloads the browser
                    }
                },
                html: {
                    files: [ './src/*.html'],
                    tasks: ['inline', 'htmlmin', 'psi-ngrok'],
                    options: {

                    },
                },
                grunt: {
                    files: ['Gruntfile.js'],
                    tasks: [ 'jshint:all', 'uglify', 'cssmin', 'inline', 'htmlmin', 'psi-ngrok', ]
                }
            },
            pagespeed: {
                options: {
                    nokey: true,
                    locale: "en_US",
                    threshold: 40,
                    paths: [ '/pizza.html' ]
                },
                local: {
                    options: {
                        strategy: "desktop"
                    }
                },
                mobile: {
                    options: {
                        strategy: "mobile"
                    }
                }
            }
        };

        /* Loop all html in src since inline task can't have array tasks
         */
        ['index', 'pizza', 'project-2048', 'project-mobile', 'project-webperf']
            .forEach(function(item) {
                var key = 'src/' + item + '.html';
                var val = item + '.html';
                config.inline[item] = {
                    src: key,
                    dest: val
                };

                config.htmlmin.dist.files[val] = val;
            });

        grunt.initConfig(config);

        /**
         * grunt-pagespeed-ngrok
         * http://www.jamescryer.com/grunt-pagespeed-ngrok
         */
        // Register customer task for ngrok
        grunt.registerTask('psi-ngrok', 'Run pagespeed with ngrok', function() {
            var done = this.async();
            var port = 8080;

            ngrok.connect(port, function(err, url) {
                if (err !== null) {
                    grunt.fail.fatal(err);
                    return done();
                }
                grunt.config.set('pagespeed.options.url', url);
                grunt.task.run('pagespeed');
                done();
            });
        });

        // Register default tasks
        grunt.registerTask('default', ['watch']);
    };
})();