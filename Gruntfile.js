var grunt = require('grunt');
grunt.loadNpmTasks('grunt-strip-code');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-babel');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-mocha-test');
grunt.loadNpmTasks('grunt-contrib-copy');

grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
        main: {
            expand: true,
            flatten: true,
            src: ['build/node-scrapinghubapi.min.js', 'build/sourceMap.map'],
            dest: 'dist/',
        },
    },
    babel: {
        options: {
            'sourceMap': true
        },
        dist: {
            files: [{
                'src': ['build/<%= pkg.name %>.js'],
                'dest': 'build/<%= pkg.name %>-compiled.js',
            }]
        }
    },
    mochaTest: {
        test: {
            options: {
                reporter: 'spec',
                quiet: false, // Optionally suppress output to standard out (defaults to false)
                clearRequireCache: false, // Optionally clear the require cache before running tests (defaults to false)
                noFail: false // Optionally set to not fail on failed tests (will still fail on other errors)
            },
            src: ['test/*.js']
        }
    },
    uglify: {
        all_src: {
            options: {
                sourceMap: true,
                sourceMapName: 'build/sourceMap.map'
            },
            src: 'build/*-compiled.js',
            dest: 'build/<%= pkg.name %>.min.js'
        }
    },
    jshint: {
        all: ['index.js'],
    },
    strip_code: {
        your_target: {
            src: 'index.js',
            dest: 'build/<%= pkg.name %>.js',
        }
    }
});

grunt.registerTask('default', ['jshint', 'mochaTest', 'strip_code', 'babel', 'uglify', 'copy']);