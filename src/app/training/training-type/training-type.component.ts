import { Component, OnInit } from '@angular/core';
import { ITrainingType } from 'app/domain/model/training/ITrainingType';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-training-type',
  templateUrl: './training-type.component.html',
  styleUrls: ['./training-type.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class TrainingTypesComponent {
  trainingTypesDialog: boolean = false;
  trainingTypes!: ITrainingType[];
  trainingType!: ITrainingType;
  selectedTrainingTypes!: ITrainingType[] | null;
  lastUpdated = new Date(new Date().getTime() - 86400000);
  uploadedFile: any;
  description!: string | null;

  masterEmployee: any;
  masterTrainingTypes: any;
  masterSkills: any;

  submitted: boolean = false;
  statuses!: any[];

  form = this.fb.nonNullable.group({
    trainingTypeId: [0, Validators.required],
    trainingTypeName: '',
    createdBy: 'Administrator',
    createdDate: new Date(),
    updatedBy: 'Administrator',
    updatedDate: new Date(),
    isActive: 'Yes',
  });

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private httpClient: HttpClient,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.httpClient.get<any>('assets/data/data.json').subscribe(s => {
      this.masterSkills = s[0].skills;
      this.trainingTypes = s[0].trainingType;
      this.masterTrainingTypes = s[0].trainingType;

      console.log(this.masterEmployee);
    });
  }

  refreshData() {
    this.lastUpdated = new Date();
  }

  openNew() {
    this.form.reset();
    this.submitted = false;
    this.trainingTypesDialog = true;
  }

  editTrainingTypes(trainingType: ITrainingType) {
    this.form.patchValue({
      trainingTypeId: trainingType.trainingTypeId,
      trainingTypeName: trainingType.trainingTypeName,
    });
    this.trainingTypesDialog = true;
  }

  deleteTrainingTypes(trainingType: ITrainingType) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + trainingType.trainingTypeName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.trainingTypes = this.trainingTypes.filter(
          val => val.trainingTypeId !== trainingType.trainingTypeId
        );
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Employee Deleted',
          life: 3000,
        });
      },
    });
  }

  hideDialog() {
    this.trainingTypesDialog = false;
    this.submitted = false;
    this.description = null;
  }

  async saveTrainingTypes() {
    this.submitted = true;

    let newModel: any = {
      trainingTypeName: this.form.value.trainingTypeName!,
      isActive: true,
      createdDate: this.form.value.createdDate!,
      createdBy: this.form.value.createdBy!,
      updatedDate: this.form.value.updatedDate!,
      updatedBy: this.form.value.updatedBy!,
    };

    if (this.form.value.trainingTypeId === 0) {
      const uploadDateTime = new Date();
      const uploadDateTimeNumber = uploadDateTime.getTime();

      newModel['trainingTypeId'] = uploadDateTimeNumber;
      this.trainingTypes.push(newModel);
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Training Created',
        life: 3000,
      });
    } else {
      this.trainingTypes[this.findIndexById(this.form.value.trainingTypeId!)] = newModel;
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Training Updated',
        life: 3000,
      });
    }
    this.trainingTypesDialog = false;
  }

  findIndexById(Id: number): number {
    let index = -1;
    for (let i = 0; i < this.trainingTypes.length; i++) {
      if (this.trainingTypes[i].trainingTypeId === Id) {
        index = i;
        break;
      }
    }

    return index;
  }

  async createId(): Promise<any> {
    new Promise((resolve, reject) => {
      const success = true;
      if (success) {
        const uploadDateTime = new Date();
        const uploadDateTimeNumber = uploadDateTime.getTime();
        resolve(uploadDateTimeNumber);
      } else {
        reject('Operation failed!');
      }
    });
  }

  isActive(isActive: boolean) {
    switch (isActive) {
      case true:
        return 'success';
      case false:
        return 'danger';
      default:
        return '';
    }
  }

  getStatusTrainingTypes(isStatus: string) {
    if (isStatus === null) {
      return 'info';
    }
    switch (isStatus) {
      case 'Approved':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Rejected':
        return 'danger';
      default:
        return 'info';
    }
  }
}
