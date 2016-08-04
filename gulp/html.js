var ternaryStream = require('ternary-stream');
module.exports = function(gulp, plugins) {
  return function () {
    var stream = require('merge-stream')();

    stream.add(gulp.src('src/*.html')
      .pipe(plugins.useref({searchPath: ['.tmp', 'src', '.']}))
      .pipe(plugins.debug({title: 'html:'}))
      .pipe(ternaryStream(function(file) {
        return !!file.path.match(/\/app\.js$|\/plugins\.js$/);
      }, plugins.uglify()))
      .pipe(ternaryStream(function(file) {
        return !!file.path.match(/\.css$/);
      }, plugins.csso()))
      .pipe(ternaryStream(function(file) {
        return !!file.path.match(/\.html$/);
      }, plugins.htmlmin({collapseWhitespace: true})))
      .pipe(gulp.dest('dist')));

    stream.add(gulp.src('src/config.js')
      .pipe(plugins.replace('serverHost = host;', 'serverHost = \'localhost:3000\';'))
      .pipe(gulp.dest('.tmp')));

    return stream;
  };
};
