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
                dest : 'app/styles/all.css'
            },
            module: {
                src: ['app/js/**/*.js'],
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
            }
        },
        cssmin: {
            options: {
                keepSpecialComments: 0 
            },
            compress: {
                files: {
                  'dist/styles/all.min.css': ['app/styles/all.css']
                }
            }
        },
        uglify: {
            minjs: { 
                files: [{
                    expand: true,
                    cwd: 'app/',
                    src: ['**/*.js', '!**/*.min.js'],
                    dest: 'dist/',
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
            }
        },
        wiredep : {
            src : ['app/index.html']
        }
    });
    grunt.registerTask('default', ['csslint', 'jshint', 'imagemin', 'cssmin', 'concat', 'uglify']);
    grunt.registerTask('css', ['concat:css', 'cssmin']);
    grunt.registerTask('dev', ['watch']);
    grunt.registerTask('test','test', function(){
        require('wiredep')({ src: 'app/index.html' });
    });
    grunt.registerTask('build',['concat', 'cssmin', 'uglify','imagemin']);
};