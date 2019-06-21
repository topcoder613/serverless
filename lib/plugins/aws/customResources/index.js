'use strict';

const path = require('path');
const { execSync } = require('child_process');

function addCustomResourceToService(resourceName) {
  const servicePath = this.serverless.config.servicePath;

  let funcName;
  let handler;
  let srcDirPath;
  let destDirPath;

  if (resourceName === 's3') {
    funcName = this.provider.naming.getCustomResourceS3HandlerFunctionName();
    handler = this.provider.naming.getCustomResourceS3HandlerPath();
    const destDirName = this.provider.naming.getCustomResourceS3ArtifactsPath();

    srcDirPath = path.join(__dirname, 's3');
    destDirPath = path.join(servicePath, destDirName);
  }

  this.serverless.service.functions[funcName] = {
    handler,
  }

  // copy the custom resource source files
  this.serverless.utils.copyDirContentsSync(srcDirPath, destDirPath);

  // install the npm dependencies
  execSync('npm install', { cwd: destDirPath });
}

module.exports = {
  addCustomResourceToService,
};
