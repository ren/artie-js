#!/usr/bin/env node

// Usage
// $ artie [json file]
//
// Artie then:
//   1. Parses JSON
//   2. Retrieves list of slices for specified artwork file(s)
//   3. Exports that slice to the json specified destination

console.log('Artie powering up.')

if (process.argv.length < 3) {
  process.exit(1);
}

var _u = require('underscore');
var fs = require('fs');
var sys = require('sys')
var exec = require('child_process').exec;

var instruction_set_path = _u.last(process.argv);
var instruction_set = JSON.parse(fs.readFileSync(instruction_set_path, 'utf8'));

_u.each(instruction_set['slices'], function(slice_info){
  console.log('Slicing:', slice_info);

  // To export slices or artboards:
  //
  // > sketchtool export slices <doc.sketch> --output=<folder> --items=<names-or-ids> --scales="1.0, 2.0" --formats="png,pdf,eps,jpg"
  //
  // > sketchtool export artboards <doc.sketch> --output=<folder> --items=<names-or-ids> --scales="1.0, 2.0" --formats="png,pdf,eps,jpg"

  var command = './sketchtool/sketchtool export slices ' + slice_info["doc_path"] + ' --output=' + slice_info["destination_path"] + ' --items=' + slice_info["name"] + ' --scales="' + slice_info["scales"] + '" --formats="' + slice_info["formats"] + '"'

  console.log('Command to run: ', command)

  var child = exec(command, function (error, stdout, stderr) {
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });
})


// Additional sketchtool documentation
//
// To list slices or artboards:
//
// > sketchtool list slices <doc.sketch>
// > sketchtool list artboards <doc.sketch>
//
//
// To export arbitrary rectangles from pages at 1.0 and 2.0 scales, as jpgs:
//
// > sketchtool export pages <doc.sketch> --output=<folder> --items=<page-names-or-ids> --bounds="0,0,256,256" --scales="1.0, 2.0" --formats="jpg"
//
//
// ## Specifying Scales and Formats
//
// By default, we export a layer using the options specified for it in the document.
//
// However, specifying --scales, --formats, or both will override all the size/type export settings.
//
// If --formats is specified but not --scales, the default scale "1.0" is used.
//
// If --scales is specified but not --formats, the default format "png" is used.
//
// If neither is specified, we use the size settings in the document itself.
//
// If both are used, we export all combinations. For example --formats="png,eps" --scales="1.0,2.0" will produce four combinations.
//
//
// ## Defaults
//
// All --options can be ommitted. The defaults are:
//
// --formats=
// --scales=
// --items=(all slices, artboards, pages)
// --bounds=(all content on the page)
// --output=(current working directory)
