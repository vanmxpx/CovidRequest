import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LocalStorgeKey } from '@cov/shared/constants/local-storage-keys';
import { MainTableMode } from '@cov/shared/constants/main-table-mode';
import { ValidatorsExtensions } from '@cov/shared/helpers';
import { CovidRequest } from '@cov/shared/models/BL/covid-request';
import { cities } from '@cov/shared/models/enums/cities';
import { diagnoses } from '@cov/shared/models/enums/diagnoses';
import { doctorTypes } from '@cov/shared/models/enums/doctor-types';
import { materialTypes } from '@cov/shared/models/enums/material-types';
import { requestReasons } from '@cov/shared/models/enums/request-reasons';
import { sexes } from '@cov/shared/models/enums/sexes';
import { LocalStorageService } from '@cov/shared/services/local-storage.service';
import { covAnimations } from '../cov-animations';
import { covRequestColumns } from './cov-request-columns';

@Component({
    selector: 'cov-page-table',
    templateUrl: './cov-page-table.component.html',
    styleUrls: ['./cov-page-table.component.scss'],
    animations: [covAnimations.changePane]
})
export class CovPageTableComponent implements AfterViewInit {
    @ViewChild(MatSort) sort: MatSort;
    cities = cities;
    diagnoses = diagnoses;
    doctorTypes = doctorTypes;
    materialTypes = materialTypes;
    requestReasons = requestReasons;
    sexes = sexes;
    MainTableMode = MainTableMode;
    mode: MainTableMode = MainTableMode.EditRow;
    requests: CovidRequest[] = [];
    covRequestColumns = covRequestColumns;
    fixedColumns = [];
    displayedColumns = [];
    dataSource: MatTableDataSource<CovidRequest>;
    rowToEdit: CovidRequest = null;

    createNew: boolean = false;
    isPersonDoctor: boolean = false;

    constructor(
        private lsService: LocalStorageService
    ) {
        let dc: string[] = lsService.loadFromLS(LocalStorgeKey.DispalyedColumns);
        if (!dc) {
            dc = ['delete', 'id', ...covRequestColumns];
        }
        this.displayedColumns = dc;
        let sc: string[] = lsService.loadFromLS(LocalStorgeKey.StaticColumns);
        if (!sc) {
            sc = ['delete', 'id'];
        }
        this.fixedColumns = sc;
        this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    }

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort;
    }

    openEditor(request: CovidRequest): void {
        if (request === null) {
            request = new CovidRequest(this.requests.length);
        }
        this.rowToEdit = request;
        this.mode = MainTableMode.EditRow;
    }
    closeEditor(): void {
        if (!confirm('Несохраненные изменения будут отменены. Продолжить?')) {
            return;
        }

        this.rowToEdit = null;
        this.mode = MainTableMode.View;
    }
    deleteRequest(request: CovidRequest) {
        if (!confirm('Удаленный запрос невозможно будет вернуть. Продолжить?')) {
            return;
        }
        let deleteIndex = this.requests.findIndex(r => r.id === request.id);
        this.requests = this.requests.slice(deleteIndex, 1);
        this.dataSource.data = this.requests;
    }
    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.displayedColumns, event.previousIndex + 2, event.currentIndex + 2); // 2 columst at start is not draggble
        this.saveDisplayedColumns();
    }

    resetTable(): void {
        this.displayedColumns = ['delete', 'id', ...covRequestColumns];
        this.fixedColumns = ['delete', 'id'];
        this.saveStaticColumns();
        this.saveDisplayedColumns();
    }

    saveStaticColumns(): void {
        this.lsService.saveToLS(LocalStorgeKey.StaticColumns, this.fixedColumns);
    }
    saveDisplayedColumns(): void {
        this.lsService.saveToLS(LocalStorgeKey.DispalyedColumns, this.displayedColumns);
    }
    isSticky(id: string) {
        return this.fixedColumns.includes(id);
    }

    calculateAnimation(position: string): 'opened' | 'closeLeft' | 'closeRight' {
        if (position === 'left') {
            if (this.mode === MainTableMode.View) {
                return 'opened';
            } else {
                return 'closeLeft';
            }
        }
        if (position === 'right') {
            if (this.mode === MainTableMode.EditRow) {
                return 'opened';
            } else {
                return 'closeRight';
            }
        }
    }

    //#region EditRequest
    requestForm: FormGroup = new FormGroup({});
    requestControl(value: string): AbstractControl | null {
        return this.requestForm ? this.requestForm.get(value) : null;
    }
    createRequestGroup(request: CovidRequest) {
        this.requestForm = new FormGroup({
            city: new FormControl({
                value: this.rowToEdit.city,
                disabled: false
            }, [Validators.required, ValidatorsExtensions.empty]),
            zoz: new FormControl({
                value: this.rowToEdit.zoz,
                disabled: false
            }, [Validators.required, ValidatorsExtensions.empty]),
            zozAddress: new FormControl({
                value: this.rowToEdit.zozAddress,
                disabled: false
            }, [Validators.required, ValidatorsExtensions.empty]),
            registrationDate: new FormControl({
                value: this.rowToEdit.registrationDate,
                disabled: false
            }, [Validators.required, ValidatorsExtensions.empty]),
            senderFullName: new FormControl({
                value: this.rowToEdit.senderFullName,
                disabled: false
            }, [Validators.required, ValidatorsExtensions.empty]),
            senderProfession: new FormControl({
                value: this.rowToEdit.senderProfession,
                disabled: false
            }, [Validators.required, ValidatorsExtensions.empty]),
            sickPatientFullName: new FormControl({
                value: this.rowToEdit.sickPatientFullName,
                disabled: false
            }, [Validators.required, ValidatorsExtensions.empty]),
            sickPatientAddress: new FormControl({
                value: this.rowToEdit.sickPatientAddress,
                disabled: false
            }, [Validators.required, ValidatorsExtensions.empty]),
            sickPatienDate: new FormControl({
                value: this.rowToEdit.sickPatienDate,
                disabled: false
            }, [Validators.required, ValidatorsExtensions.empty]),
            patientFirstName: new FormControl({
                value: this.rowToEdit.patientFirstName,
                disabled: false
            }, [Validators.required, ValidatorsExtensions.empty]),
            patientLastName: new FormControl({
                value: this.rowToEdit.patientLastName,
                disabled: false
            }, [Validators.required, ValidatorsExtensions.empty]),
            patientMiddleName: new FormControl({
                value: this.rowToEdit.patientMiddleName,
                disabled: false
            }, [Validators.required, ValidatorsExtensions.empty]),
            patientSex: new FormControl({
                value: this.rowToEdit.patientSex,
                disabled: false
            }, [Validators.required, ValidatorsExtensions.empty]),
            patientBirthDate: new FormControl({
                value: this.rowToEdit.patientBirthDate,
                disabled: false
            }, [Validators.required, ValidatorsExtensions.empty]),
            requestReason: new FormControl({
                value: this.rowToEdit.requestReason,
                disabled: false
            }, [Validators.required, ValidatorsExtensions.empty]),
            patientCity: new FormControl({
                value: this.rowToEdit.patientCity,
                disabled: false
            }, [Validators.required, ValidatorsExtensions.empty]),
            patientAddress: new FormControl({
                value: this.rowToEdit.patientAddress,
                disabled: false
            }, [Validators.required, ValidatorsExtensions.empty]),
            additinalInfo: new FormControl({
                value: this.rowToEdit.additinalInfo,
                disabled: false
            }, [Validators.required, ValidatorsExtensions.empty]),
            doctorProfession: new FormControl({
                value: this.rowToEdit.doctorProfession,
                disabled: false
            }, []),
            materialType: new FormControl({
                value: this.rowToEdit.materialType,
                disabled: false
            }, [Validators.required, ValidatorsExtensions.empty]),
            diagnos: new FormControl({
                value: this.rowToEdit.diagnos,
                disabled: false
            }, [Validators.required, ValidatorsExtensions.empty]),
        });
    }
    //#endregion

}

export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
}

const ELEMENT_DATA: any[] = [
    { id: 0, isDoctor: false, zoz: 'asfasfsfaf', zozAddress: 'sadasdasdasd' }
];
