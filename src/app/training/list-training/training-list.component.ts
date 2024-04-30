import { Component, OnInit } from '@angular/core';
import { TrainingListService } from './training-list.service';
import { ITraining } from '../../domain/model/training/ITraining';
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
  selector: 'app-trainingList',
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.css'],
  providers: [TrainingListService, ConfirmationService, MessageService],
})
export class TrainingListComponent {
  trainingListDialog: boolean = false;
  trainingLists!: ITraining[];
  trainingList!: ITraining;
  selectedTrainingLists!: ITraining[] | null;
  lastUpdated = new Date(new Date().getTime() - 86400000);
  uploadedFile: any;
  description!: string | null;

  masterEmployee: any;
  masterManagers: any;
  masterTrainers: any;
  masterPositions: any;
  masterDepartments: any;
  masterTrainingType: any;

  submitted: boolean = false;
  statuses!: any[];

  form = this.fb.nonNullable.group({
    trainingId: 0,
    trainingName: [''],
    trainingTypeName: [''],
    trainers: new Array(),
    employees: new Array(),
    startDate: new Date(),
    endDate: new Date(),
    description: '',
    isActive: true,
    createdDate: new Date(),
    createdBy: '',
    updatedDate: new Date(),
    updatedBy: '',
  });

  constructor(
    private trainingListService: TrainingListService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private httpClient: HttpClient,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.httpClient.get<any>('assets/data/data.json').subscribe(s => {
      this.masterEmployee = s[0].employee;
      this.masterManagers = s[0].managers;
      this.trainingLists = s[0].training;
      this.masterPositions = s[0].positions;
      this.masterDepartments = s[0].departments;
      this.masterTrainers = s[0].trainers;
      this.masterTrainingType = s[0].trainingType;

      console.log(this.masterEmployee);
    });
  }

  refreshData() {
    this.lastUpdated = new Date();
  }

  openNew() {
    this.form.reset();
    this.submitted = false;
    this.trainingListDialog = true;
  }

  editTrainingList(trainingList: ITraining) {
    console.log(trainingList);
    trainingList.startDate = new Date(trainingList.startDate);
    trainingList.endDate = new Date(trainingList.endDate);
    this.form.patchValue(trainingList);
    this.trainingListDialog = true;
  }

  deleteTrainingList(trainingList: ITraining) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + trainingList.trainingName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.trainingLists = this.trainingLists.filter(
          val => val.trainingId !== trainingList.trainingId
        );
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Training Deleted',
          life: 3000,
        });
      },
    });
  }

  hideDialog() {
    this.trainingListDialog = false;
    this.submitted = false;
    this.description = null;
  }

  async saveTrainingList() {
    this.submitted = true;

    let newModel: any = {
      trainingId: this.form.value.trainingId!,
      trainingName: this.form.value.trainingName!,
      trainingTypeName: this.form.value.trainingTypeName!,
      trainers: this.form.value.trainers,
      employees: this.form.value.employees,
      startDate: this.form.value.startDate!,
      endDate: this.form.value.endDate!,
      description: this.form.value.description!,
      isActive: this.form.value.isActive!,
      createdDate: new Date(),
      createdBy: 'Administrator',
      updatedDate: new Date(),
      updatedBy: 'Administrator',
    };

    if (this.form.value.trainingId === 0) {
      const uploadDateTime = new Date();
      const uploadDateTimeNumber = uploadDateTime.getTime();

      newModel['trainingId'] = uploadDateTimeNumber;
      console.log(newModel);
      this.trainingLists.push(newModel);
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Training Created',
        life: 3000,
      });
      console.log(this.trainingLists);
    } else {
      this.trainingLists[this.findIndexById(this.form.value.trainingId!)] = newModel;
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Training Updated',
        life: 3000,
      });
    }
    this.trainingListDialog = false;
  }

  findIndexById(Id: number): number {
    let index = -1;
    for (let i = 0; i < this.trainingLists.length; i++) {
      if (this.trainingLists[i].trainingId === Id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): number {
    const uploadDateTime = new Date();
    const uploadDateTimeNumber = uploadDateTime.getTime();
    return uploadDateTimeNumber;
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

  getStatusTrainingList(isStatus: string) {
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
