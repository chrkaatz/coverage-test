const gulp = require('gulp');
const { spawn } = require('child_process');
const fancyLog = require('fancy-log');
const beeper = require('beeper');

gulp.task('test', () => {
  return new Promise((resolve, reject) => {
    const server = spawn('c8', ['-x', 'node_modules', '-r', 'html', 'node', 'server.js'], { cwd: process.cwd() });
    const gracePeriod = 500;
    let testExitCode = 0;

    server.stdout.setEncoding('utf8');
    server.stdout.on('data', (data) => {
      fancyLog(data);
    });

    server.stderr.setEncoding('utf8');
    server.stderr.on('data', (data) => {
      fancyLog.error(data);
      beeper();
    });

    process.on('SIGINT', function() {
      server.kill('SIGINT');
    });
    process.on('SIGTERM', function() {
      server.kill('SIGTERM');
    });

    server.on('close', (code) => {
      fancyLog('Server going down with exit code', code);
      if(testExitCode > 0) {
        reject(testExitCode);
      }
      resolve(testExitCode);
    });

    fancyLog(`Running tests in ${gracePeriod} ms`);
    setTimeout(() => {
      const runTests = spawn('newman', ['run', 'tests/testsuite.postman_collection.json'], { cwd: process.cwd() });
      runTests.stdout.setEncoding('utf8');
      runTests.stdout.on('data', (data) => {
        fancyLog(data);
      });

      runTests.stderr.setEncoding('utf8');
      runTests.stderr.on('data', (data) => {
        fancyLog.error(data);
        beeper();
      });

      runTests.on('close', (code) => {
        fancyLog('Tests done with exit code', code);
        testExitCode = code;
        server.kill('SIGINT');
      });
    }, gracePeriod);
  });
});
