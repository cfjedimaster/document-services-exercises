/*
Required dependencies. 

pdfSDK is our main doc services pdf
fs is for file system stuff
AdmZip is our zip library
*/
const pdfSDK = require('@adobe/pdfservices-node-sdk');
const fs = require('fs');
const AdmZip = require('adm-zip');



/*
Defines our input and output, these would be dynamic normally...
*/
const input = './pdfs/adobe-document-services-security-overview.pdf';
const output = './pdfs/extract-result.zip';

/*
ensure it actually exist...
*/
if(!fs.existsSync(input)) {
	console.error(`Can't find input file ${input}`);
	process.exit(1);
}


/*
Clean up previous output if it exists. In a real environment, you have multiple alternatives you could use.
For example, taking the filename and appending "_ocr". You could append a time stamp. A UUID. etc.
*/
if(fs.existsSync(output)) fs.unlinkSync(output);

/*
Specify credentials location. Note that the json file also says where the private key is.
*/
const credentials =  pdfSDK.Credentials
	.serviceAccountCredentialsBuilder()
	.fromFile('pdfservices-api-credentials.json')
	.build();

/*
define top level objects for our work
*/
const options = new pdfSDK.ExtractPDF.options.ExtractPdfOptions.Builder()
          .addElementsToExtract(pdfSDK.ExtractPDF.options.ExtractElementType.TEXT).build();


const executionContext = pdfSDK.ExecutionContext.create(credentials);

const extractOperation = pdfSDK.ExtractPDF.Operation.createNew(),
          inputPDF = pdfSDK.FileRef.createFromLocalFile(input,
              pdfSDK.ExtractPDF.SupportedSourceFormat.pdf
          );

// Set operation input from a source file.
extractOperation.setInput(inputPDF);

// Set options
extractOperation.setOptions(options);

/*
now do it!
*/
extractOperation.execute(executionContext)
.then(result => result.saveAsFile(output))
.then(() => {
	console.log('Zip saved, now time to read from it and parse...');

	let zip = new AdmZip(output);
	let jsondata = zip.readAsText('structuredData.json');
	let data = JSON.parse(jsondata);
	data.elements.forEach(element => {
		console.log(element.Text);
	});

})
.catch(err => {
	if(err instanceof pdfSDK.Error.ServiceApiError
		|| err instanceof pdfSDK.Error.ServiceUsageError) {
		console.log('Exception encountered while executing operation', err);
	} else {
		console.log('Exception encountered while executing operation', err);
	}
});
