/*
I am an example of handling multiple operations at once. File-based, and would be 
better as a stream, but still useful imo.
*/

const pdfSDK = require('@adobe/pdfservices-node-sdk');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const input = './pdfs/calculus.pdf';
const output = './misc/output.pdf';
const creds = 'pdfservices-api-credentials.json';

(async () => {

	console.log(`Going to process ${input} and save it to ${output}.`);

	// first, ocr it to a temp place
	let temp = uuidv4() + '.pdf';
	await ocr(input, temp, creds);

	console.log('OCR done, now to compress...');
	await compress(temp, output, creds);

	// clean up
	fs.unlinkSync(temp);
	
	console.log('All done.');
	
})();

async function ocr(input, output, creds) {

	return new Promise((resolve, reject) => {

		const credentials =  pdfSDK.Credentials
		.serviceAccountCredentialsBuilder()
		.fromFile(creds)
		.build();

		const executionContext = pdfSDK.ExecutionContext.create(credentials),
			ocrOperation = pdfSDK.OCR.Operation.createNew();

		const inputPDF = pdfSDK.FileRef.createFromLocalFile(input);
		ocrOperation.setInput(inputPDF);

		ocrOperation.execute(executionContext)
		.then(result => result.saveAsFile(output))
		.then(resolve)
		.catch(err => {
			reject(err);
		});
	
	});

}

async function compress(input, output, creds) {

	return new Promise((resolve, reject) => {

		const credentials =  pdfSDK.Credentials
		.serviceAccountCredentialsBuilder()
		.fromFile(creds)
		.build();

		const executionContext = pdfSDK.ExecutionContext.create(credentials),
			compressOperation = pdfSDK.CompressPDF.Operation.createNew();

		const inputPDF = pdfSDK.FileRef.createFromLocalFile(input);
		compressOperation.setInput(inputPDF);

		compressOperation.execute(executionContext)
		.then(result => result.saveAsFile(output))
		.then(resolve)
		.catch(err => {
			reject(err);
		});
	
	});

}