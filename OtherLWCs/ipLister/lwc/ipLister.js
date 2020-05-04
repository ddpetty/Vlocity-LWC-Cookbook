import { LightningElement, api, track } from 'lwc';

import callIP from '@salesforce/apex/ipLWCWrapper.callIP';


export default class IpLister extends LightningElement {
	@api pathToData ="";
	@api recordId;
	@api titles = "";
	@api names = "";
	@api ipname = "";

	@api prop1;
	@api prop2;

	@track ipResult = '';
	@track rows = [];
	@track headers = [];

	connectedCallback() {
		let sInput =  '{ "recordId": "' + this.recordId +'"}';
		console.log("Input: " + sInput);
		callIP({ ipName: this.ipname, input: sInput, options: '{}' })
		.then((result) => {
			console.log(typeof(result));
			console.log('Success: ' + JSON.stringify(result));
			let parsedData = JSON.parse(result);

			try {
			parsedData = parsedData[this.pathToData];
			} catch (e) {
				this.ipResult = "Unable to find data";
				return;
			}

			// Handle singleton vs array data
			if (Array.isArray(parsedData)) {
				// do nothing
			} else {
				parsedData = [ parsedData ];
			}

			console.log("Rows: " + JSON.stringify(parsedData));

			let arrayTitles = this.titles.split(',');

			// Generate the headers to display in the page
			arrayTitles.forEach((k, i) => {
				// console.log("Title: " + k);
				this.headers.push({ key : i, value: k.trim()});
			})

			let arrayNames = this.names.split(',');
			// Now generate the rows of data
			parsedData.forEach((row, i) => {
				let rowdata = [];
				arrayNames.forEach((k,j) => {
					k = k.trim();
					// console.log("key: " + k + ", value: "+row[k]);
					rowdata.push({key : j, value: row[k]});
				});
				this.rows.push({ key: i, value: rowdata});
			});
		})
		.catch((error) => {
			this.ipResult = 'Error: ' + JSON.stringify(error);
			console.log(this.ipResult);
		})
	}
}