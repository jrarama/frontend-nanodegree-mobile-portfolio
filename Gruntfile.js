(function() {
    'use strict';

    var ngrok = require('ngrok');

    module.exports = function(grunt) {

        // Load grunt tasks
        require('load-grunt-tasks')(grunt);

        // Grunt configuration
        grunt.initConfig({
            pkg: grunt.file.readJSON('package.json'),
            cssmin: {
                options: {
                    shorthandCompacting: false,
                    roundingPrecision: -1
                },
                pizza: {
                    files: {
                      './css/pizza.min.css': ['./css/bootstrap-grid.css', './css/style.css']
                    }
                },
                main: {
                    files: {
                      './css/style.min.css': ['./css/style.css'],
                      './css/print.min.css': ['./css/print.css'],
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
            watch: {
                scripts: {
                    files: ['Gruntfile.js', './js/**/*.js', '!./js/**/*.min.js'],
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
                    files: [ './**/*.html'],
                    tasks: ['psi-ngrok'],
                    options: {

                    },
                }
            },
            pagespeed: {
                options: {
                    nokey: true,
                    locale: "en_US",
                    threshold: 40
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
        });

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