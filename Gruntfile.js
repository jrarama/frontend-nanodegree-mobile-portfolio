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
            uncss: {
                dist: {
                    files: {
                        'css/pizza.tidy.min.css': ['src/pizza.html']
                    }
                }
            },
            processhtml: {
                dist: {
                    files: {
                        'pizza.html': ['src/pizza.html']
                    }
                }
            },
            cssmin: {
                options: {
                    shorthandCompacting: false,
                    roundingPrecision: -1,
                    keepSpecialComments: 0
                },
                pizza: {
                    files: {
                      './css/pizza.min.css': ['./css/bootstrap-grid.css', './css/pizza.css']
                    }
                },
                pizzaTidy: {
                    files: {
                      './css/pizza.tidy.min.css': ['./css/pizza.tidy.min.css']
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
                },
                pizza: {
                    options: {                                 // Target options
                        removeComments: true,
                        collapseWhitespace: true,
                        preserveLineBreaks: true,
                        minifyJS: true
                    },
                    files: {
                        'pizza.html' : 'pizza.html'
                    }
                }
            },
            watch: {
                scripts: {
                    files: ['./js/*.js'],
                    tasks: ['jshint:all', 'uglify', 'psi-ngrok'],     //tasks to run
                    options: {
                        livereload: true                        //reloads the browser
                    }
                },
                styles: {
                    files: [ './css/style.css', './css/print.css' ],
                    tasks: ['cssmin:main', 'psi-ngrok'],     //tasks to run
                    options: {
                        livereload: true                        //reloads the browser
                    }
                },
                pizza: {
                    files: [ './css/pizza.css', './css/bootstrap-grid.css' ],
                    tasks: [ 'uncss', 'cssmin:pizzaTidy', 'processhtml', 'htmlmin:pizza'],     //tasks to run
                    options: {
                        livereload: true                        //reloads the browser
                    }
                },
                pizzaTidy: {
                    files: [ './src/pizza.html' ],
                    tasks: [ 'uncss', 'cssmin:pizzaTidy', 'processhtml', 'htmlmin:pizza']
                },
                html: {
                    files: [], // This array is set on the loop below
                    tasks: ['inline', 'htmlmin:dist', 'psi-ngrok'],
                    options: {

                    },
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
        ['index', 'project-2048', 'project-mobile', 'project-webperf']
            .forEach(function(item) {
                var key = 'src/' + item + '.html';
                var val = item + '.html';
                config.inline[item] = {
                    src: key,
                    dest: val
                };

                config.watch.html.files.push(key);

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