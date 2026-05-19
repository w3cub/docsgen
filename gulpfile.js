const { series, watch } = require('gulp');
const { spawn } = require('child_process');
const path = require('path');

function runBuilder(cb){
  const proc = spawn(process.execPath, [path.join(__dirname, 'tools', 'build-widget-config.js')], { stdio: 'inherit' });
  proc.on('close', code => cb(code ? new Error('build failed') : null));
}

function watchWidgets(){
  watch('widget/src/**', runBuilder);
}

exports.build = runBuilder;
exports.watch = watchWidgets;
exports.default = series(runBuilder, watchWidgets);
