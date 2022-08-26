/*
Required dependencies. 

pdfSDK is our main doc services pdf
fs is for file system stuff
*/
const pdfSDK = require('@adobe/pdfservices-node-sdk');
const fs = require('fs');


/*
Defines our input and output, these would be dynamic normally...
*/
const input = './pdfs/national_park.docx';
const output = './pdfs/national_park.pdf';

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
const executionContext = pdfSDK.ExecutionContext.create(credentials),
	createOperation = pdfSDK.CreatePDF.Operation.createNew();

/*
tell the operation object where our input is
*/
const inputPDF = pdfSDK.FileRef.createFromLocalFile(input);
createOperation.setInput(inputPDF);

/*
now do it!
*/
createOperation.execute(executionContext)
.then(result => result.saveAsFile(output))
.catch(err => {
	if(err instanceof pdfSDK.Error.ServiceApiError
		|| err instanceof pdfSDK.Error.ServiceUsageError) {
		console.log('Exception encountered while executing operation', err);
	} else {
		console.log('Exception encountered while executing operation', err);
	}
});
