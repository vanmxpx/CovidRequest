import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, OnInit, ViewChild, Input } from '@angular/core';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _ from 'lodash';

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
    mode: MainTableMode = MainTableMode.View;
    @Input() public requests: CovidRequest[];
    covRequestColumns = covRequestColumns;
    fixedColumns = [];
    displayedColumns = [];
    dataSource: MatTableDataSource<CovidRequest>;
    rowToEdit: CovidRequest = null;
    templateRequest: CovidRequest = null;
    createNew: boolean = false;
    saveAsTemplate: boolean = false;
    isPersonDoctor: boolean = false;

    constructor(
        private lsService: LocalStorageService,
        private snackBar: MatSnackBar
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


        this.rowToEdit = new CovidRequest(0);

        this.templateRequest = lsService.loadFromLS(LocalStorgeKey.RequestTemplate);
        this.createRequestGroup();
    }

    ngAfterViewInit(): void {
        this.dataSource = new MatTableDataSource(this.requests);
        this.dataSource.sort = this.sort;
    }

    openEditor(request: CovidRequest): void {
        if (request === null) {
            request = new CovidRequest(this.requests.length);
            if (this.templateRequest) {
                request = { ...request, ...this.templateRequest };
            }
        }
        this.rowToEdit = _.cloneDeep(request);
        this.createRequestGroup();
        this.mode = MainTableMode.EditRow;
    }
    closeEditor(): void {
        if (this.requestForm.dirty && !confirm('Несохраненные изменения будут отменены. Продолжить?')) {
            return;
        }

        this.rowToEdit = null;
        this.mode = MainTableMode.View;
    }

    save(): void {
        this.requestForm.markAllAsTouched();
        this.requestForm.updateValueAndValidity();
        if (!this.requestForm.valid) {
            this.snackBar.open('Будь ласка, виправте усi помилки.' , 'OK', {
                duration: 5000
            });
            return;
        }
        this.rowToEdit = { id: this.rowToEdit.id, isDoctor: this.isPersonDoctor, ...this.requestForm.getRawValue() };
        let selectedItemIndex = this.requests.findIndex(r => r.id === this.rowToEdit.id);
        if (selectedItemIndex !== -1) {
            this.requests[selectedItemIndex] = _.cloneDeep(this.rowToEdit);
        } else {
            this.requests.push(_.cloneDeep(this.rowToEdit));
        }
        this.dataSource.data = this.requests;
        if (this.saveAsTemplate) {
            this.saveTemplate(this.rowToEdit);
            this.saveAsTemplate = false;
        }
        this.snackBar.open('Збережено.' , 'OK', {
            duration: 5000
        });
        if (this.createNew) {
            this.openEditor(null);
        } else {
            this.mode = MainTableMode.View;
        }

    }

    deleteRequest(request: CovidRequest) {
        if (!confirm('Видалений запрос неможливо буде повернути. Продовжити?')) {
            return;
        }
        let deleteIndex = this.requests.findIndex(r => r.id === request.id);
        this.requests.splice(deleteIndex, 1);
        this.dataSource.data = this.requests;
    }
    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.displayedColumns, event.previousIndex + 2, event.currentIndex + 2); // 2 columst at start is not draggble
        this.lsService.saveToLS(LocalStorgeKey.DispalyedColumns, this.displayedColumns);
    }

    resetTable(): void {
        if (!confirm('Сконфiгурований вид таблицi неможливо буде повернути. Продовжити?')) {
            return;
        }
        this.displayedColumns = ['delete', 'id', ...covRequestColumns];
        this.fixedColumns = ['delete', 'id'];
        this.lsService.saveToLS(LocalStorgeKey.StaticColumns, this.fixedColumns);
        this.lsService.saveToLS(LocalStorgeKey.DispalyedColumns, this.displayedColumns);
    }

    saveStaticColumns(column: string): void {
        let index = this.fixedColumns.findIndex(c => c === column);
        if (index !== -1) {
            this.fixedColumns.splice(index, 1);
        } else {
            this.fixedColumns.push(column);
        }
        this.lsService.saveToLS(LocalStorgeKey.StaticColumns, this.fixedColumns);
    }
    saveDisplayedColumns(column: string): void {
        let index = this.displayedColumns.findIndex(c => c === column);
        if (index !== -1) {
            this.displayedColumns.splice(index, 1);
        } else {
            let oldPosition = this.covRequestColumns.findIndex(c => c === column) + 2; // dont forger two udeleteble columns
            let lastIndex = this.displayedColumns.length - 1;
            this.displayedColumns.splice(oldPosition > lastIndex ?  lastIndex : oldPosition , 0, column);
        }
        this.lsService.saveToLS(LocalStorgeKey.DispalyedColumns, this.displayedColumns);
    }
    isSticky(id: string) {
        return this.fixedColumns.includes(id);
    }
    deleteTemplate(): void {
        if (!confirm('Ви дiйсно бажаєте видалити шаблон?')) {
            return;
        }
        this.templateRequest = null;
        this.lsService.saveToLS(LocalStorgeKey.RequestTemplate, this.templateRequest);
        this.snackBar.open('Шаблон видалено.' , 'OK', {
            duration: 5000
        });
    }

    saveTemplate(request: CovidRequest): void {
        this.templateRequest = ({
            city: request.city,
            zoz: request.zoz,
            zozAddress: request.zozAddress,
            senderFullName: request.senderFullName,
            senderProfession: request.senderProfession
        } as any);
        this.lsService.saveToLS(LocalStorgeKey.RequestTemplate, this.templateRequest);
        this.snackBar.open('Збережено як шаблон.' , 'OK', {
            duration: 5000
        });
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
    createRequestGroup() {
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
            patientAge: new FormControl({
                value: this.rowToEdit.patientAge,
                disabled: true
            }),
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
            }),
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

        this.requestControl('patientBirthDate').valueChanges.subscribe(value => {
            if (value) {
                let age = new Number((new Date().getTime() - new Date(value).getTime()) / 31536000000).toFixed(0);
                this.requestControl('patientAge').setValue(age);
            }
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
