module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('karma-sonarqube-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false
    },
    reporters: ['progress', 'kjhtml', 'coverage', 'sonarqube'],

    // Configuration pour générer lcov.info
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcov' }  // Génère lcov.info
      ],
      fixWebpackSourcePaths: true
    },

    sonarqubeReporter: {
      basePath: 'src/app',
      filePattern: '**/*spec.ts',
      encoding: 'utf-8',
      outputFolder: 'reports',
      legacyMode: false,
      reportName: 'sonarqube_report.xml'
    },

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    restartOnFileChange: true,

    // Custom launcher qui correspond à votre angular.json
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-web-security', '--disable-gpu']
      }
    }
  });
};
