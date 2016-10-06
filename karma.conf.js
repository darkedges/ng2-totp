var webpackConfig = require('./webpack.config');

var ENV = process.env.npm_lifecycle_event;
var isTestWatch = ENV === 'test-watch';

// #docregion
module.exports = function (config) {

    var appBase = 'dist/';       // transpiled app JS and map files
    var appSrcBase = 'dist/';       // app source TS files
    var appAssets = '/base/src/'; // component assets fetched by Angular's compiler

    var testBase = 'testing/';       // transpiled test JS and map files
    var testSrcBase = 'testing/';       // test source TS files

    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        plugins: [
            require("karma-webpack"),
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-phantomjs-launcher'),
            require('karma-sourcemap-loader'),
            require('karma-coverage'),
            require('karma-jasmine-html-reporter'), // click "Debug" in browser to see it
            require('karma-htmlfile-reporter') // crashing w/ strange socket error
        ],

        customLaunchers: {
            // From the CLI. Not used here but interesting
            // chrome setup for travis CI using chromium
            Chrome_travis_ci: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },
        files: [
            { pattern: './karma-shim.js', watched: false }
        ],

        // Proxied base paths for loading assets
        proxies: {
            // required for component assets fetched by Angular's compiler
            "/app/": appAssets
        },

        exclude: [],
        preprocessors: {
            'dist/**/!(*spec).js': ['coverage'],
            './karma-shim.js': ['webpack', 'sourcemap']
        },
        // disabled HtmlReporter; suddenly crashing w/ strange socket error
        reporters: ['progress', 'html', 'coverage'],//'html'],

        // HtmlReporter configuration
        htmlReporter: {
            // Open this file to see results in browser
            outputFile: 'test-output/tests.html',

            // Optional
            pageTitle: 'Unit Tests',
            subPageTitle: __dirname
        },

        // CoverageReporter configuration
        coverageReporter: {
            reporters: [
                { type: 'json', subdir: '.', file: 'coverage-final.json' }
            ]
        },

        webpack: webpackConfig,

        webpackMiddleware: {
            stats: 'errors-only'
        },

        webpackServer: {
            noInfo: true
        },

        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: isTestWatch ? ['Chrome'] : ['PhantomJS'], 
        singleRun: true
    })
}