const templateName = 'VueTestTemplate.js';
const ignored = ['.git', 'node_modules']
const { lstatSync, readdir, access, constants, readFile, writeFile } = require('fs');

const findFiles = (path) => {
  readdir(path, function(err, items) {
    for (let i=0; i<items.length; i++) {
        const file = items[i];
        const fullPath = path + '/' + file;
        const isDir = lstatSync(fullPath).isDirectory();
        if(isDir){
          if(!ignored.includes(file))
          findFiles(fullPath)
        }
        else if( file.indexOf('.vue') > -1 ){
          const testShouldBe = fullPath.replace('.vue', '.test.js')
          access(testShouldBe, constants.F_OK, (err) => {
            if(err){
              createTestFile(testShouldBe, file);
            }
          });
        }
    }
  });
}
const createTestFile = (path, component) => {
  access(templateName, constants.F_OK, (err) => {
    if(err){
      console.error(`test template not found at: ${templateName}`)
    }
    else {
      readFile(templateName, 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        const justName = component.replace('.vue','');
        const result = data.replace(/COMPONENT_NAME/g, justName);
        writeFile(path, result, 'utf8', function (err) {
           if (err) return console.log(err);
        });
      });
    }
  });
}

findFiles('.');
