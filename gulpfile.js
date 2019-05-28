'use strict';

// Gulp plugins
var gulp = require('gulp');
var sass = require('gulp-sass');
var sassGlob = require('gulp-sass-glob');
var usage = require('gulp-help-doc');


// Gulp config
var watchOptions = {
    usePolling: true, // required when using inside VMs.
}

// Paths
var paths = {
    fractal: {
	assets: `${__dirname}/design/public`,
	components: `${__dirname}/design/components`,
	docs: `${__dirname}/design/docs`
    },
    styles: {  
	src: './design/scss/*.scss',
	watch: './design/**/*.scss',
	dest: './design/public/css/'
    }
};


// Fractal config
var  fractal = require('@frctl/fractal').create();

fractal.set('project.title', 'pattern-library');               // title 
fractal.web.set('builder.dest', 'build');                         // destination for the static export
fractal.web.set('static.path', paths.fractal.assets);            // location of assets
fractal.docs.set('path', paths.fractal.docs);             // location of the documentation directory.
fractal.components.set('path', paths.fractal.components); // location of the component directory.

var  logger = fractal.cli.console; // keep a reference to the fractal CLI console utility


// Tasks

/**
 * Compiles scss files.
 * 
 * @task {styles}
 * @order {4}
 */
function styles() {
    return gulp.src(paths.styles.src)
	.pipe(sassGlob())
	.pipe(sass())
	.pipe(gulp.dest(paths.styles.dest));
}

/**
 * Starts watching for changes in scss files. 
 * 
 * @task {watchStyles}
 * @order {3}
 */
function watchStyles () {
    gulp.watch(paths.styles.watch,watchOptions, styles);
}


/**
 * Starts a fractal server 
 * 
 * @task {fractal}
 * @order {2}
 */
gulp.task('fractalServer', function(){
    const server = fractal.web.server({
        sync: true
    });
    server.on('error', err => logger.error(err.message));
    return server.start().then(() => {
        logger.success(`Fractal server is now running at ${server.url}`);
    });
});


/**
 * Lists all the taks, same as the default task.
 * 
 * @task {help}
 * @order {1}
 */
function help () {
    return usage(gulp);
}
exports.help = help;
gulp.task('default', help);

// main tasks
exports.fractal = gulp.parallel(gulp.series('fractalServer'),watchStyles)
exports.watchStyles = watchStyles;

// sub-tasks
exports.styles = styles;

