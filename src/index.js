import through from 'through2'
import path from 'path'
import gutil from 'gulp-util'

export default (opts) => {
  let mainFile;
  const prepend = [];
  const append = [];

  const log = (...args) => {
    if(!opts.debug){ return; }
    gutil.log.apply(gutil, [`${gutil.colors.magenta('[Scss Combine]')} ${args.join('')}`])
  }

  const buffer = (file, enc, cb) => {
    const filename = path.basename(file.path)

    // Ignore _ files
    if(filename[0] === '_'){
      log('[Ignoring] ', filename)
    }

    else if(file.path === opts.main){
      mainFile = file;
      log('[Found main] ', filename)
    }

    else{
      let relative = path.relative(opts.main, file.path);
      relative = relative.replace('../../', '../');
      log('[Prepending] ', relative)
      prepend.push(file)
    }

    cb()
  }


  // Concat files...
  const endStream = function(cb){

    const prependString = prepend.map((file) => {
      let relative = path.relative(opts.main, file.path);
      relative = relative.replace('../../', '../');
      return `@import '${relative}';`
    })

    let content = mainFile.contents.toString()
    content += '\n' + prependString.join('\n');


    mainFile.contents = new Buffer(content);

    this.push(mainFile)

    cb()
  }

  return through.obj(buffer, endStream);
}