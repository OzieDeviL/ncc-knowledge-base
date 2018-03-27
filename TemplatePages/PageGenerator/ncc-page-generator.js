//pass the filename of the JSON scheme as the first argument in the command line after "node page-component-generator.js"
//pass the file to emit as the subsequent argument
//e.g. node ncc-page-generator.js ./example.json ./example.html

let ejs = require('ejs');
let fs = require('fs');
let optionsFile = process.argv[2];
let options = require(optionsFile);
let outputFile = process.argv[3];

if (Object.keys(options.article.sections) && Object.keys(options.article.sections).length > 0) {
    let _ejs = ejs;
    let sections = options.article.sections;
    Object.keys(sections).forEach(function (sectionKey) {      
        let subsectionKeys = Object.keys(sections[sectionKey].subsections);
        if (subsectionKeys && subsectionKeys.length > 0) {            
            subsectionKeys.forEach(function (subsectionKey) {
                let subsection = sections[sectionKey].subsections[subsectionKey];
                ejs.renderFile('./subsection-template.ejs', { subsection: subsection }, function (err, renderedSubsection) {
                    if (err) throw new Error(err);
                    subsection.body = renderedSubsection;
                });
            });
        }
        ejs.renderFile('./section-template.ejs', { section: sections[sectionKey] }, function (err, renderedSection) {
            if (err) throw new Error(err);
            sections[sectionKey].body = renderedSection;
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
            fs.writeFile(outputFile, renderedString, (err) => {
                if (err) throw err;
                console.log('The "data to append" was written to the file!');
            })
        }
    }
);