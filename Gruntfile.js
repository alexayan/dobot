module.exports = function (grunt) {
    'use strict';
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        csslint: {
            src: ['css/**/*.css']
        },
        jshint: {
            all: ['Gruntfile.js', 'app/**/*.js']
        },
        imagemin: {
            dist: {
                options: {
                    optimizationLevel: 3
                },
                files: [
                    {
                        expand: true,
                        cwd: 'app/images',
                        src: ['**/*.{png,jpg,jpeg}'], 
                        dest: 'dist/images/'
                    }
                ]
            }
        },
        concat: {
            css : {
                src : ['app/styles/*.css', '!app/styles/all.css'],
                dest : 'dist/all.css'
            },
            module: {
                src: ['app/scripts/**/*.js'],
                dest: 'dist/js/module.js'
            },
            init : {
                src: ['app/init.js'],
                dest : 'dist/js/init.js'
            },
            lib : {
                src: ['bower_components/angular.js'],
                dest : 'dist/js/lib.js'
            },
            core : {
                src : ['app/core.js'],
                dest : 'dist/js/core.js'
            },
            buildjs : {
                src : ['bower_components/angular/angular.js',
                       'bower_components/angular-cookies/angular-cookies.js',
                       'bower_components/angular-bootstrap/ui-bootstrap.js',
                       'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
                       'bower_components/angular-ui-switch/angular-ui-switch.js',
                       'bower_components/ngDialog/js/ngDialog.js',
                       'bower_components/angular-toasty/dist/angular-toasty.js',
                       'bower_components/angular-translate/angular-translate.js',
                       'bower_components/angular-translate/angular-translate.js',
                       'bower_components/angular-soundmanager2/dist/angular-soundmanager2.js',
                       'dist/js/templates.js',
                       'dist/js/module.js',
                       'dist/js/init.js'],
                dest : 'build/all.js'
            },
            buildcss : {
                src : ['dist/all.css',
                       'bower_components/bootstrap/dist/css/bootstrap.css',
                       'bower_components/angular-toasty/dist/angular-toasty.css'],
                dest : 'build/all.css'
            }
        },
        cssmin: {
            options: {
                keepSpecialComments: 0 
            },
            compress: {
                 files: [{
                    expand: true,
                    src: ['build/all.css'],
                    ext: '.min.css'
                }]
            }
        },
        uglify: {
            minjs: { 
                files: [{
                    expand: true,
                    src: ['build/all.js'],
                    ext: '.min.js'
                }]
            }
        },
        watch: {
            js : {
                files : ['app/**/*.js', 'Gruntfile.js'],
                tasks : ['jshint','concat:module','concat:init','concat:core']
            },
            css : {
                files : ['app/styles/*.css'],
                tasks : ['csslint','concat:css']
            },
            template: {
                files : ['app/**/*.tpl.html'],
                tasks : ['html2js']
            }
        },
        wiredep : {
            src : ['app/index.html']
        },
        concurrent: {
          server: [
            'compass:server'
          ],
          dist: [
            'compass:dist',
            'imagemin',
            'svgmin'
          ]
        },
        connect: {
            options: {
                port: 8888,
                hostname: 'localhost',
                livereload: 35720
            },
            dev: {
                options: {
                    open: true,
                    middleware: function (connect) {
                        return [
                          connect().use(
                            '/bower_components',
                            connect.static('./bower_components')
                          ),
                          connect().use(
                            '/',
                            connect.static('./app')
                          ),
                          connect().use(
                            '/dist',
                            connect.static('./dist')
                          )
                        ];
                      }
                }
            }
        },
        html2js: {
            main: {
                src: ['app/**/*.tpl.html'],
                dest: 'dist/js/templates.js'
            },
        },
    });
    grunt.registerTask('default', ['csslint', 'jshint', 'imagemin', 'cssmin', 'concat', 'uglify']);
    grunt.registerTask('css', ['concat:css', 'cssmin']);
    grunt.registerTask('dev', ['watch']);
    grunt.registerTask('test','test', function(){
        require('wiredep')({ src: 'app/index.html' });
    });
    grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
        grunt.task.run([
          'connect',
          'watch'
        ]);
      });
    grunt.registerTask('build', ['concat:buildcss','cssmin','concat:buildjs','uglify']);
};