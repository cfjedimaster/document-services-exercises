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
const input = './pdfs/adobe-developer-terms.pdf';
const output = './pdfs/adobe-developer-terms-protected.pdf';

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
const executionContext = pdfSDK.ExecutionContext.create(credentials);
const protectPDF = pdfSDK.ProtectPDF;
const protectPDFOptions = protectPDF.options;
const permissions = protectPDFOptions.Permissions.createNew();

/*
one or more permissions
*/
permissions.addPermission(protectPDFOptions.Permission.PRINT_HIGH_QUALITY);
permissions.addPermission(protectPDFOptions.Permission.PRINT_LOW_QUALITY);




const options = new protectPDFOptions.PasswordProtectOptions.Builder()
		.setOwnerPassword('password')
		.setPermissions(permissions)
		.setEncryptionAlgorithm(protectPDFOptions.EncryptionAlgorithm.AES_256)
		.setContentEncryption(protectPDFOptions.ContentEncryption.ALL_CONTENT_EXCEPT_METADATA)
		.build();

const protectPDFOperation = protectPDF.Operation.createNew(options);

/*
tell the operation object where our input is
*/
const inputPDF = pdfSDK.FileRef.createFromLocalFile(input);
protectPDFOperation.setInput(inputPDF);

/*
now do it!
*/
protectPDFOperation.execute(executionContext)
.then(result => result.saveAsFile(output))
.catch(err => {
	if(err instanceof pdfSDK.Error.ServiceApiError
		|| err instanceof pdfSDK.Error.ServiceUsageError) {
		console.log('Exception encountered while executing operation', err);
	} else {
		console.log('Exception encountered while executing operation', err);
	}
});
