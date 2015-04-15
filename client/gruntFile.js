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
        releasedir: 'dist/webinterface.arch',
        pkg: grunt.file.readJSON('package.json'),
        banner:
            '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
                ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' +
                ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */\n',
        src: {
            js: [ 'src/assets/**/*.js', 'src/common/**/*.js', 'src/app/**/*.js', '<%= releasedir %>/js/templates/**/*.js'],
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
                files: [{ dest: '<%= releasedir %>', src : '**', expand: true, cwd: 'src/assets/' },
                        { dest: '<%= releasedir %>/font', src : '**', expand: true, cwd: 'vendor/font-awesome/font/' }]
            },
            csp : {
                files: [{ dest : '<%= releasedir %>/css', src : '*csp.css', expand: true, cwd: 'vendor/angular/' }]
            },
            chrome : {
                files: [{ dest : '<%= releasedir %>/js', src : 'chrome.js', expand: true, cwd: 'src/' }]
            },
            /*
            data : {
                files: [{ dest : '<%= releasedir %>/js/data', src : '**', expand: true, cwd: 'src/app/data/' }]
            },
            */
            manifests : {
              files: [{ dest: '<%= releasedir %>', src : 'manifest.*', expand: true, cwd: 'src'}]
            },
            xml : {
              files: [{ dest: '<%= releasedir %>', src : '*.xml', expand: true, cwd: 'src'}]
            }
        },
        html2js: {
            app: {
                options: {
                    base: 'src/app'
                },
                src: ['<%= src.tpl.app %>'],
                dest: '<%= releasedir %>/js/app.js',
                module: 'templates.app'
            }
        },
        concat:{
             dist:{
                options: {
                    banner: "<%= banner %>"
                },
                src:['<%= src.js %>', '<%= releasedir %>/js/app.js'],
                dest:'<%= releasedir %>/js/<%= pkg.name %>.js'
            },
            index: {
                src: ['src/index.html'],
                dest: '<%= releasedir %>/index.html',
                options: {
                    process: true
                }
            },
            angular: {
                src:[
                    'vendor/angular/angular.js',
                    'vendor/angular-animate/angular-animate.js',
                    'vendor/angular-ui-router/release/angular-ui-router.js',
                    'vendor/angular-touch/angular-touch.js',
                ],
                dest: '<%= releasedir %>/js/lib/angular.js'
            },
            thirdparty: {
                src:[

                    'vendor/lrInfiniteScroll/lrInfiniteScroll.js',
                    'vendor/mousetrap/mousetrap.js',
                    'vendor/chrome-platform-analytic/google-analytics-bundle.js'
                ],
                dest: '<%= releasedir %>/js/lib/third.js'
            }
        },
        uglify: {
            dist:{
                options: {
                    banner: "<%= banner %>"
                },
                src:['<%= src.js %>', '<%= releasedir %>/js/app.js'],
                dest:'<%= releasedir %>/js/<%= pkg.name %>.js'
            },
            angular: {
                src:[
                    'vendor/angular/angular.js',
                    'src/assets/js/ui-bootstrap-custom-0.10.0.js',
                    'vendor/angular-ui-router/release/angular-ui-router.js',
                    'vendor/angular-touch/angular-touch.js',
                    'vendor/lrInfiniteScroll/lrInfiniteScroll.js'
                ],
                dest: '<%= releasedir %>/js/lib/angular.js'
            }
        },
        recess: {
            build: {
                files: {
                    '<%= releasedir %>/css/yin.css':
                        ['<%= src.less.yin %>', 'vendor/font-awesome/less/font-awesome.less'],
                    '<%= releasedir %>/css/yang.css':
                        ['<%= src.less.yang %>', 'vendor/font-awesome/less/font-awesome.less']
                },
                options: {
                    compile: true
                }
            },
            min: {
                files: {
                    '<%= releasedir %>/css/yin.css': ['<%= src.less.yin %>', 'vendor/font-awesome/less/font-awesome.less'],
                    '<%= releasedir %>/css/yang.css': ['<%= src.less.yang %>', 'vendor/font-awesome/less/font-awesome.less']
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
                    archive: '<%= distdir %>/<%= pkg.title || pkg.name %>.<%= pkg.version %>.zip',
                    mode: 'zip'
                },
                files: [
                    { expand: true, cwd: '<%= distdir %>/', src: ['**']}
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