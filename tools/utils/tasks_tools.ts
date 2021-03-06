import * as gulp from 'gulp';
import * as util from 'gulp-util';
import * as chalk from 'chalk';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import * as _runSequence from 'run-sequence';
import { readdirSync, existsSync, lstatSync } from 'fs';
import { join } from 'path';
import { TOOLS_DIR } from '../config';

const TASKS_PATH = join(TOOLS_DIR, 'tasks');

export function task(taskName: string, option?: string) {
  util.log('loading task', chalk.yellow(taskName, option || ''));
  return require(join('..', 'tasks', taskName))(gulp, gulpLoadPlugins(), option);
}

export function runSequence(...sequence: any[]) {
  let tasks = [];
  let _sequence = sequence.slice(0);
  sequence.pop();

  scanDir(TASKS_PATH, taskName => tasks.push(taskName));

  sequence.forEach(task => {
    if (tasks.indexOf(task) > -1) {
      registerTask(task);
    }
  });

  return _runSequence(..._sequence);
}

// ---------------
// Private Methods
// ---------------
function registerTask(taskName: string, fileName?: string, option: string = ''): void {
  gulp.task(taskName, task(fileName || taskName, option));
}

function scanDir(root: string, cb: (taskName: string) => void) {
  if (!existsSync(root)) return;

  walk(root);

  function walk(path) {
    let files = readdirSync(path);
    for (let i = 0, j = files.length; i < j; i+=1) {
      let file = files[i];
      let curPath = join(path, file);
      if (lstatSync(curPath).isFile() && /\.ts$/.test(file)) {
        let taskName = file.replace(/(\.ts)/, '');
        cb(taskName);
      }
    }
  }
}