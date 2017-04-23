//jshint strict: false
module.exports = function (config) {
    config.set({

        basePath: './app',

        files: [
            'bower_components/angular/angular.js',
            'bower_components/angular-*/angular-*.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/angular-loader/angular-loader.js',
            'bower_components/angular-material/modules/js/**/*.js',
            'bower_components/ngstorage/ngStorage.js',
            'bower_components/angular-filter/dist/angular-filter.js',
            'app.js',
            'components/**/*.js',
            'view*/**/*.js',
            'services/**/*.js',
            'view*/**/*.html'
        ],

        autoWatch: true,

        frameworks: ['jasmine'],

        browsers: ['Chrome'],

        plugins: [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter',
            'karma-coverage',
            'karma-coveralls',
            'karma-ng-html2js-preprocessor'
        ],

        junitReporter: {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        },

        reporters: ['progress', 'coverage', 'coveralls'],

        preprocessors: {
            'components/**/!(*_test).js': ['coverage'],
            'view*/**/!(*_test).js': ['coverage'],
            'service*/**/!(*_test).js': ['coverage'],
            '**/*.html': ['ng-html2js']
        },

        coverageReporter: {
            type: 'lcov',
            dir: 'coverage/',
            subdir: '.'
        }

    });
};
