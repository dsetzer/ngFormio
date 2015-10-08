module.exports = function(gulp, plugins) {
  return function () {
    var stream = require('merge-stream')();

    stream.add(gulp.src('src/images/**/*')
      .pipe(plugins.cache(plugins.imagemin({
        progressive: true,
        interlaced: true,
        svgoPlugins: [{cleanupIDs: false}]
      })))
      .pipe(gulp.dest('dist/images'))
    );

    // Copy over images from kendo-ui
    stream.add(gulp.src('bower_components/kendo-ui/styles/Bootstrap/**/*')
      .pipe(gulp.dest('dist/styles/Bootstrap')));

    return stream;
  };
};
