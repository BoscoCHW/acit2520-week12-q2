/*
 * Project:
 * File Name: main.js
 * Description:
 *
 * Created Date:
 * Author:
 *
 */

const IOhandler = require("./IOhandler"),
  zipFilePath = `${__dirname}/myfile.zip`,
  pathUnzipped = `${__dirname}/unzipped`,
  pathProcessed = `${__dirname}/grayscaled`;

const path = require("path")


IOhandler.unzip(zipFilePath, pathUnzipped)
  .then(() => IOhandler.readDir(pathUnzipped))
  .then((files) => Promise.all(files.map(file => 
    IOhandler.grayScale(path.join(pathUnzipped, file), path.join(pathProcessed, file))
  )))
  .then((messages) => console.log(messages))
  .catch(err => console.log(err))

// IOhandler.grayScale(path.join(pathUnzipped, "in.png"), path.join(pathProcessed, "in.png"))