export class CovidRequest {
    id: number;
    city: string;
    zoz: string;
    zozAddress: string;
    registrationDate: Date = new Date();
    senderFullName: string;
    senderProfession: string;
    requestReason: string;
    sickPatientFullName: string;
    sickPatientAddress: string;
    sickPatienDate: Date;
    patientFirstName: string;
    patientLastName: string;
    patientMiddleName: string;
    patientSex: string;
    patientBirthDate: Date;
    get patientAge(): number {
        if (!this.patientBirthDate) {
            return 0;
        }
        return new Date().getFullYear() - this.patientBirthDate.getFullYear();
    }
    patientCity: string;
    patientAddress: string;
    additinalInfo: string;
    isDoctor: boolean;
    doctorProfession: string;
    materialType: string;
    diagnos: string;

    constructor(id: number) {
        this.id = id;
    }
}
