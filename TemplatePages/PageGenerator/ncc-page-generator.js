//pass the filename of the JSON scheme as the first argument in the command line after "node page-component-generator.js"
//pass the file to emit as the subsequent argument
//e.g. node ncc-page-generator.js ./example.json ./example.html

let ejs = require('ejs');
let fs = require('fs');
let optionsFile = process.argv[2];
let options = require(optionsFile);
let outputFile = process.argv[3];

let article = options.article;
if (article.sections && article.sections.length > 0) {
    let _ejs = ejs;
    let sections = article.sections;
    sections.forEach(function (section) {              
        if (section.subsections && section.subsections.length > 0) {
            section.subsections.forEach(function (subsection) {                
                ejs.renderFile('./subsection-template.ejs', { subsection: subsection }, function (err, renderedSubsection) {
                    if (err) throw new Error(err);
                    subsection.body = renderedSubsection;
                });
            });
        }
        ejs.renderFile('./section-template.ejs', { section: section }, function (err, renderedSection) {
            if (err) throw new Error(err);
            section.body = renderedSection;
        });
    });
}

ejs.renderFile(
    './article-template.ejs'
    , { article: options.article }
    , null //options
    , function (onError, renderedString) {
        if (onError) {
            throw new Error(onError);
        }
        else {
            fs.appendFile(outputFile, renderedString, (err) => {
                if (err) throw err;
                console.log('The "data to append" was written to the file!');
            })
        }
    }
);