export class CovidRequest {
    id: number;
    city: string;
    zoz: string;
    zozAddress: string;
    registrationDate: Date = new Date();
    get registrationDateString(): string {
        return this.convertDate(this.registrationDate);
    }
    senderFullName: string;
    senderProfession: string;
    requestReason: string;
    sickPatientFullName: string;
    sickPatientAddress: string;
    sickPatienDate: Date;
    get sickPatienDateString(): string {
        return this.convertDate(this.sickPatienDate);
    }
    patientFirstName: string;
    patientLastName: string;
    patientMiddleName: string;
    patientSex: string;
    patientBirthDate: Date;
    get patientBirthDateString(): string {
        return this.convertDate(this.patientBirthDate);
    }
    patientAge: number;
    // get patientAge(): number {
    //     if (!this.patientBirthDate) {
    //         return 0;
    //     }
    //     return new Date().getFullYear() - this.patientBirthDate.getFullYear();
    // }
    patientCity: string;
    patientAddress: string;
    patientPhone: string;
    patientWasAbroad: boolean;
    additinalInfo: string;
    comment: string;
    isDoctor: boolean;
    doctorProfession: string;
    materialType: string;
    diagnos: string; // Пiдозрiлий чи Ймовiрний
    constructor(id: number) {
        this.id = id;
    }
    public loadTemplate(templateRequest: CovidRequest): void {
        this.city = templateRequest.city;
        this.zoz = templateRequest.zoz;
        this.zozAddress = templateRequest.zozAddress;
        this.senderFullName = templateRequest.senderFullName;
        this.senderProfession = templateRequest.senderProfession;
    }
    private convertDate(date: Date): string {
        return date.toLocaleDateString('uk-UA');
    }
}
