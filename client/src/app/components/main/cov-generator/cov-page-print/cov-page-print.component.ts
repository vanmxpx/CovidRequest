import { Component, OnInit, Input } from '@angular/core';
import { CovidRequest } from '@cov/shared/models/BL/covid-request';
import DocXTemplater from 'docxtemplater';
import docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import PizZipUtils from 'pizzip/utils/index.js';
import { saveAs } from 'file-saver';
import { Row, Workbook } from 'exceljs';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'cov-page-print',
    templateUrl: './cov-page-print.component.html',
    styleUrls: ['./cov-page-print.component.scss']
})
export class CovPagePrintComponent implements OnInit {
    @Input() public requests: CovidRequest[];

    selectedId = -1;
    constructor(
        public http: HttpClient
    ) { }

    async ngOnInit() {
    }

    selectRequestToView(id): void {
        this.selectedId = id;
    }

    generateDoc(request: CovidRequest): void {
        PizZipUtils.getBinaryContent('assets/template.docx', ((error, content) => {
            if (error) { throw error };

            // The error object contains additional information when logged with JSON.stringify 
            // (it contains a properties object containing all suberrors).
            function replaceErrors(key, value) {
                if (value instanceof Error) {
                    return Object.getOwnPropertyNames(value).reduce(function (error, key) {
                        error[key] = value[key];
                        return error;
                    }, {});
                }
                return value;
            }

            let zip = new PizZip(content);
            let doc;
            try {
                doc = new docxtemplater().loadZip(zip);

                this.fillDocPage(request, doc);
                // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
                doc.render();
            }
            catch (error) {
                // Catch rendering errors (errors relating to the rendering of the template : angularParser throws an error)
                console.log(JSON.stringify({ error }, replaceErrors));

                if (error.properties && error.properties.errors instanceof Array) {
                    const errorMessages = error.properties.errors.map( (e) => {
                        return e.properties.explanation;
                    }).join('\n');
                    console.log('errorMessages', errorMessages);
                    // errorMessages is a humanly readable message looking like this :
                    // 'The tag beginning with "foobar" is unopened'
                }
                throw error;
            }

            let out = doc.getZip().generate({
                type: 'blob',
                mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            }); // Output the document using Data-URI
            saveAs(out, request.patientLastName + request.patientFirstName + '-' + new Date().toLocaleDateString('uk-UA')  + '.docx');
        }).bind(this));
    }

    async generateExcel(request: CovidRequest) {
        try {
            const resp = await this.http.get('assets/template.xlsx', { responseType: 'arraybuffer' }).toPromise();
            const workbook = await new Workbook().xlsx.load(resp);

            const worksheet = workbook.worksheets[0];
            const row = worksheet.getRow(4);

            this.fillExcelRow(request, row);
            row.commit();

            const xls64 = await workbook.xlsx.writeBuffer();
            const out = new Blob([xls64], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(out, request.patientLastName + request.patientFirstName + '-' + new Date().toLocaleDateString('uk-UA') + '.xlsx');

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async generateExcelAll() {
        try {
            const resp = await this.http.get('assets/template.xlsx', { responseType: 'arraybuffer' }).toPromise();
            const workbook = await new Workbook().xlsx.load(resp);
            const worksheet = workbook.worksheets[0];
            for (let index = 0; index < this.requests.length; index++) {
                const request = this.requests[index];
                const row = worksheet.getRow(index + 4);
                this.fillExcelRow(request, row);
                row.commit();
            }

            const xls64 = await workbook.xlsx.writeBuffer();
            const out = new Blob([xls64], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(out, 'requests-' + new Date().toLocaleDateString('uk-UA') + '.xlsx');

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    generateDocAll() {
        PizZipUtils.getBinaryContent('assets/template.docx', ((error, content) => {
            if (error) { throw error; }

            // The error object contains additional information when logged with JSON.stringify 
            // (it contains a properties object containing all suberrors).
            function replaceErrors(key, value) {
                if (value instanceof Error) {
                    return Object.getOwnPropertyNames(value).reduce(function (error, key) {
                        error[key] = value[key];
                        return error;
                    }, {});
                }
                return value;
            }

            let zip = new PizZip(content);
            let doc;
            try {
                doc = new docxtemplater().loadZip(zip);

                for (const request of this.requests) {
                    this.fillDocPage(request, doc);
                    doc.render();

                    const out = doc.getZip().generate({
                        type: 'blob',
                        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    }); // Output the document using Data-URI
                    saveAs(out, request.patientLastName + request.patientFirstName + '-'
                    + new Date().toLocaleDateString('uk-UA') + '.docx');
                }
            }
            catch (error) {
                // Catch rendering errors (errors relating to the rendering of the template : angularParser throws an error)
                console.log(JSON.stringify({ error }, replaceErrors));

                if (error.properties && error.properties.errors instanceof Array) {
                    const errorMessages = error.properties.errors.map( (e) => {
                        return e.properties.explanation;
                    }).join('\n');
                    console.log('errorMessages', errorMessages);
                    // errorMessages is a humanly readable message looking like this :
                    // 'The tag beginning with "foobar" is unopened'
                }
                throw error;
            }
        }).bind(this));
    }
    fillDocPage(request: CovidRequest, doc) {
        doc.setData({
            zoz: request.zoz,
            zozAddress: request.zozAddress,
            senderFullName: request.senderFullName,
            diagnos: request.diagnos,
            patientFirstName: request.patientFirstName,
            patientLastName: request.patientLastName,
            patientBirthDate: request.patientBirthDateString,
            patientAge: request.patientAge,
            sickPatientAddress: request.sickPatientAddress,
            patientPhone: request.patientPhone,
            comment: request.comment,
            patientSex: request.patientSex,
            materialType: request.materialType,
            additinalInfo: request.additinalInfo
        });
    }
    fillExcelRow(request: CovidRequest, row: Row) {
        row.getCell('A').value = row.number - 3;
        row.getCell('B').value = request.city;
        // row.getCell('C').value = request;
        row.getCell('D').value = request.zoz;
        row.getCell('E').value = request.zozAddress;
        row.getCell('F').value = request.registrationDateString;
        row.getCell('G').value = request.senderProfession;
        row.getCell('H').value = request.senderFullName;
        row.getCell('I').value = request.requestReason;
        row.getCell('J').value = request.sickPatientFullName;
        row.getCell('H').value = request.sickPatientAddress;
        row.getCell('L').value = request.patientLastName;
        row.getCell('M').value = request.patientFirstName;
        row.getCell('N').value = request.patientMiddleName;
        row.getCell('O').value = request.patientSex;
        row.getCell('P').value = request.patientBirthDateString;
        row.getCell('Q').value = request.patientAge;
        row.getCell('R').value = request.patientCity;
        // row.getCell('S').value = request.patient;
        row.getCell('T').value = request.patientAddress;
        row.getCell('U').value = request.additinalInfo;
        // row.getCell('V').value = request.;
        row.getCell('W').value = request.isDoctor ? 'Так' : 'Ні';
        row.getCell('X').value = request.doctorProfession;
        // row.getCell('Y').value = request.dateString;
        row.getCell('Z').value = request.materialType;
        row.getCell('AA').value = request.diagnos;
        // row.getCell('AB').value = request;
        // row.getCell('AC').value = request;
        // row.getCell('AD').value = request.resultLab;
        // row.getCell('AE').value = request.resultAnswer;
        // row.getCell('AF').value = request.resultDate;
        // row.getCell('AG').value = request;
        // row.getCell('AH').value = request.comment;

    }
}
