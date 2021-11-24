/*
 * Project:
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date:
 * Author:
 *
 */

const unzipper = require("unzipper"),
  fs = require("fs"),
  fsPromise = require("fs/promises")
  PNG = require("pngjs").PNG,
  path = require("path");

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
  return fs.createReadStream(pathIn)
      .pipe(unzipper.Extract({ path: pathOut }))
      .promise()
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = async (dir) => {
  const files = await fsPromise.readdir(dir)
  const filenames = []
  files.forEach(file => {
    const filename = path.basename(file)
    if (path.extname(filename) === ".png") {
      filenames.push(filename)
    }
  })
  return filenames
};

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = async (pathIn, pathOut) => {

  fs.createReadStream(pathIn)
    .pipe(
      new PNG({
        filterType: 1,
        colorType: 0
      })
    )
    .on("parsed", function () {
      for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
          var idx = (this.width * y + x) << 2;
  
          // invert color
          const val = 0.299 * this.data[idx] + 0.587 * this.data[idx + 1] + 0.114 * this.data[idx + 2]; 
          this.data[idx] = val; 
          this.data[idx + 1] = val;
          this.data[idx + 2] = val;
  
        }
      }
  
      this.pack().pipe(fs.createWriteStream(pathOut));
    });

    return "done"
};

module.exports = {
  unzip,
  readDir,
  grayScale,
};
