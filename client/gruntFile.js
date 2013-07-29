module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-recess');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-contrib-compress');

    // Default task.
    grunt.registerTask('default', ['jshint','build']);
    grunt.registerTask('build', ['clean','html2js','concat','recess:build','copy']);
    grunt.registerTask('release', ['clean','html2js','uglify', 'concat:index', 'recess:min','copy']);
    grunt.registerTask('marketplace', ['clean','html2js', 'concat', 'recess:min','copy','compress']);

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
            js: ['src/**/*.js', '<%= wwwdir %>/js/templates/**/*.js'],
            html: ['src/index.html'],
            manifests : ['src/manifest.*'],
            tpl: {
                app: ['src/app/**/*.tpl.html']
            },
            less: ['src/less/app.less'], // recess:build doesn't accept ** in its file patterns
            lessWatch: ['src/less/**/*.less']
        },
        clean: ['<%= distdir %>/*'],
        copy: {
            assets: {
                files: [{ dest: '<%= wwwdir %>', src : '**', expand: true, cwd: 'src/assets/' },
                        { dest: '<%= wwwdir %>/font', src : '**', expand: true, cwd: 'vendor/font-awesome/font/' }]
            },
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
                src:['vendor/angular/angular.js'],
                dest: '<%= wwwdir %>/js/lib/angular.js'
            },
            angularuirouter: {
                src:['vendor/angular-ui-router/release/angular-ui-router.js'],
                dest: '<%= wwwdir %>/js/lib/angular-ui-router.js'
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
                src:['<%= concat.angular.src %>'],
                dest: '<%= wwwdir %>/js/lib/angular.js'
            },
            angularuirouter: {
                src:['<%= concat.angularuirouter.src %>'],
                dest: '<%= wwwdir %>/js/lib/angular-ui-router.js'
            }
        },
        recess: {
            build: {
                files: {
                    '<%= wwwdir %>/css/<%= pkg.name %>.css':
                        ['<%= src.less %>', 'vendor/font-awesome/less/font-awesome.less'] },
                options: {
                    compile: true
                }
            },
            min: {
                files: {
                    '<%= wwwdir %>/css/<%= pkg.name %>.css': ['<%= src.less %>', 'vendor/font-awesome/less/font-awesome.less']
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