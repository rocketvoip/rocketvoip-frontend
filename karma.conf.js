//jshint strict: false
module.exports = function(config) {
  config.set({

    basePath: './app',

    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'components/**/*.js',
      'view*/**/*.js'
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
        'karma-coveralls'
    ],

    junitReporter: {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    },

      reporters: ['coverage', 'coveralls'],

      preprocessors: {
          // source files, that you wanna generate coverage for
          // do not include tests or libraries
          // (these files will be instrumented by Istanbul)
          'components/**/*.js': ['coverage'],
          'view*/**/*.js': ['coverage'],
          '*.js': ['coverage']

      },


      coverageReporter: {
          type: 'lcov', // lcov or lcovonly are required for generating lcov.info files
          dir: 'coverage/'
      }

  });
};
