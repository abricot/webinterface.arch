module.exports = function (grunt) {

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // Default task.
    grunt.registerTask('default', ['build']);
    grunt.registerTask('build', ['clean','html2js','concat','recess:build','copy']);
    grunt.registerTask('release', ['clean','html2js','concat','recess:build','copy','compress']);

    // Print a timestamp (useful for when watching)
    grunt.registerTask('timestamp', function() {
        grunt.log.subhead(Date());
    });

    // Project configuration.
    grunt.initConfig({
        distdir: 'dist',
        wwwdir: 'dist/www',
        pkg: grunt.file.readJSON('package.json'),
        banner:
            '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
                ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' +
                ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */\n',
        src: {
            js: [ 'src/assets/**/*.js', 'src/common/**/*.js', 'src/app/**/*.js', '<%= wwwdir %>/js/templates/**/*.js'],
            html: ['src/index.html'],
            manifests : ['src/manifest.*'],
            tpl: {
                app: ['src/app/**/*.html']
            },
            less: {
                yin : ['src/less/themes/yin/app.less'], // recess:build doesn't accept ** in its file patterns
                yang : ['src/less/themes/yang/app.less']
            },
            lessWatch: ['src/less/**/*.less']
        },
        clean: ['<%= distdir %>/*'],
        copy: {
            assets: {
                files: [{ dest: '<%= wwwdir %>', src : '**', expand: true, cwd: 'src/assets/' },
                        { dest: '<%= wwwdir %>/font', src : '**', expand: true, cwd: 'vendor/font-awesome/font/' }]
            },
            csp : {
                files: [{ dest : '<%= wwwdir %>/css', src : '*csp.css', expand: true, cwd: 'vendor/angular/' }]
            },
            chrome : {
                files: [{ dest : '<%= wwwdir %>/js', src : 'chrome.js', expand: true, cwd: 'src/' }]
            },
            /*
            data : {
                files: [{ dest : '<%= wwwdir %>/js/data', src : '**', expand: true, cwd: 'src/app/data/' }]
            },
            */
            manifests : {
              files: [{ dest: '<%= wwwdir %>', src : 'manifest.*', expand: true, cwd: 'src'}]
            }
        },
        html2js: {
            app: {
                options: {
                    base: 'src/app'
                },
                src: ['<%= src.tpl.app %>'],
                dest: '<%= wwwdir %>/js/app.js',
                module: 'templates.app'
            }
        },
        concat:{
             dist:{
                options: {
                    banner: "<%= banner %>"
                },
                src:['<%= src.js %>', '<%= wwwdir %>/js/app.js'],
                dest:'<%= wwwdir %>/js/<%= pkg.name %>.js'
            },
            index: {
                src: ['src/index.html'],
                dest: '<%= wwwdir %>/index.html',
                options: {
                    process: true
                }
            },
            angular: {
                src:[
                    'vendor/angular/angular.js', 
                    'src/assets/js/ui-bootstrap-custom-0.10.0.js', 
                    'vendor/angular-ui-router/release/angular-ui-router.js',
                    'vendor/angular-touch/angular-touch.js',
                ],
                dest: '<%= wwwdir %>/js/lib/angular.js'
            },
            mousetrap: {
                src:['vendor/mousetrap/mousetrap.js'],
                dest: '<%= wwwdir %>/js/lib/mousetrap.js'
            },
            googleAnalyticsBundle : {
                src:['vendor/chrome-platform-analytic/google-analytics-bundle.js'],
                dest: '<%= wwwdir %>/js/lib/google-analytics-bundle.js'
            },
            lrInfiniteScroll : {
                src:['vendor/lrInfiniteScroll/lrInfiniteScroll.js'],
                dest: '<%= wwwdir %>/js/lib/lrInfiniteScroll.js'
            }
        },
        uglify: {
            dist:{
                options: {
                    banner: "<%= banner %>"
                },
                src:['<%= src.js %>', '<%= wwwdir %>/js/app.js'],
                dest:'<%= wwwdir %>/js/<%= pkg.name %>.js'
            },
            angular: {
                src:[
                    'vendor/angular/angular.js', 
                    'src/assets/js/ui-bootstrap-custom-0.10.0.js', 
                    'vendor/angular-ui-router/release/angular-ui-router.js'
                ],
                dest: '<%= wwwdir %>/js/lib/angular.js'
            },
            mousetrap: {
                src:['vendor/mousetrap/mousetrap.js'],
                dest: '<%= wwwdir %>/js/lib/mousetrap.js'
            },
            lrInfiniteScroll : {
                src:['vendor/lrInfiniteScroll/lrInfiniteScroll.js'],
                dest: '<%= wwwdir %>/js/lib/lrInfiniteScroll.js'
            }
        },
        recess: {
            build: {
                files: {
                    '<%= wwwdir %>/css/yin.css':
                        ['<%= src.less.yin %>', 'vendor/font-awesome/less/font-awesome.less'],
                    '<%= wwwdir %>/css/yang.css':
                        ['<%= src.less.yang %>', 'vendor/font-awesome/less/font-awesome.less'] 
                },
                options: {
                    compile: true
                }
            },
            min: {
                files: {
                    '<%= wwwdir %>/css/yin.css': ['<%= src.less.yin %>', 'vendor/font-awesome/less/font-awesome.less'],
                    '<%= wwwdir %>/css/yang.css': ['<%= src.less.yang %>', 'vendor/font-awesome/less/font-awesome.less']
                },
                options: {
                    compress: true
                }
            }
        },
        watch:{
            all: {
                files:['<%= src.js %>', '<%= src.lessWatch %>', '<%= src.tpl.app %>', '<%= src.manifests %>', '<%= src.html %>'],
                tasks:['default','timestamp']
            },
            build: {
                files:['<%= src.js %>', '<%= src.lessWatch %>', '<%= src.tpl.app %>', '<%= src.manifests %>', '<%= src.html %>'],
                tasks:['build','timestamp']
            }
        },
        compress: {
            zip: {
                options: {
                    archive: '<%= distdir %>/<%= pkg.title || pkg.name %>.zip',
                    mode: 'zip'
                },
                files: [
                    { expand: true, cwd: '<%= wwwdir %>/', src: ['**']}
                ]
            }
        },
        jshint:{
            files:['gruntFile.js', '<%= src.js %>'],
            options:{
                curly:true,
                eqeqeq:true,
                immed:true,
                latedef:true,
                newcap:true,
                noarg:true,
                sub:true,
                boss:true,
                eqnull:true,
                globals:{}
            }
        }
    });

};