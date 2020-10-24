import { Component, OnInit, Input } from '@angular/core';
import { CovidRequest } from '@cov/shared/models/BL/covid-request';
import DocXTemplater from 'docxtemplater';
import docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import PizZipUtils from 'pizzip/utils/index.js';
import { saveAs } from 'file-saver';

@Component({
    selector: 'cov-page-print',
    templateUrl: './cov-page-print.component.html',
    styleUrls: ['./cov-page-print.component.scss']
})
export class CovPagePrintComponent implements OnInit {
    @Input() public requests: CovidRequest[];

    selectedId = -1;
    constructor() { }

    ngOnInit() {
    }

    selectRequestToView(id): void {
        this.selectedId = id;
    }

    loadFile(url, callback) {
        PizZipUtils.getBinaryContent(url, callback);
    }
    save(request: CovidRequest): void {
        this.loadFile('assets/template.docx', ((error, content) => {
            if (error) { throw error };

            // The error object contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
            function replaceErrors(key, value) {
                if (value instanceof Error) {
                    return Object.getOwnPropertyNames(value).reduce(function (error, key) {
                        error[key] = value[key];
                        return error;
                    }, {});
                }
                return value;
            }

            function errorHandler(error) {
                console.log(JSON.stringify({ error: error }, replaceErrors));

                if (error.properties && error.properties.errors instanceof Array) {
                    const errorMessages = error.properties.errors.map(function (error) {
                        return error.properties.explanation;
                    }).join('\n');
                    console.log('errorMessages', errorMessages);
                    // errorMessages is a humanly readable message looking like this :
                    // 'The tag beginning with "foobar" is unopened'
                }
                throw error;
            }

            var zip = new PizZip(content);
            var doc;
            try {
                doc = new docxtemplater().loadZip(zip);
            } catch (error) {
                // Catch compilation errors (errors caused by the compilation of the template : misplaced tags)
                errorHandler(error);
            }

            doc.setData({
                zoz: request.zoz,
                zozAddress: request.zozAddress,
                senderFullName: request.senderFullName,
                diagnos: request.diagnos,
                patientFirstName: request.patientFirstName,
                patientLastName: request.patientLastName,
                patientBirthDate: request.patientBirthDate.toLocaleDateString(),
                patientAge: request.patientAge,
                sickPatientAddress: request.sickPatientAddress,
                patientPhone: request.patientPhone,
                patientSex: request.patientSex,
                materialType: request.materialType,
                additinalInfo: request.additinalInfo
            });
            try {
                // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
                doc.render();
            }
            catch (error) {
                // Catch rendering errors (errors relating to the rendering of the template : angularParser throws an error)
                errorHandler(error);
            }

            var out = doc.getZip().generate({
                type: 'blob',
                mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            }) //Output the document using Data-URI
            saveAs(out, request.patientLastName + request.patientFirstName + '.docx');
        }).bind(this));
    }
}
