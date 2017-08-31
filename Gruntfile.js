var grunt = require('grunt');
grunt.loadNpmTasks('grunt-strip-code');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-babel');
grunt.loadNpmTasks('grunt-contrib-uglify');

grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
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
    uglify: {
        all_src: {
            options: {
                sourceMap: true,
                sourceMapName: 'build/sourceMap.map'
            },
            src: 'build/*-compiled.js',
            dest: 'build/<%= pkg.name %>.js'
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

grunt.registerTask('deploy', ['jshint', 'strip_code', 'babel', 'uglify']);