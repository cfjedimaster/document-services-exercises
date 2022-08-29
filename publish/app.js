document.addEventListener('DOMContentLoaded', init, false);

function init() {
	if(window.AdobeDC) showPDF();
	else document.addEventListener("adobe_dc_view_sdk.ready", showPDF, false);
}

function showPDF() {

	var adobeDCView = new AdobeDC.View({clientId: "9861538238544ff39d37c6841344b78d", divId: "adobe-dc-view"});
	adobeDCView.previewFile({
		content:{location: {url: "https://documentcloud.adobe.com/view-sdk-demo/PDFs/Bodea Brochure.pdf"}},
		metaData:{fileName: "Bodea Brochure.pdf"}
	}, {
		showDownloadPDF: false, 
		showPrintPDF: false
	});

}