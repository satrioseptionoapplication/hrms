import { Component, OnInit } from '@angular/core';
import { TrainersService } from './trainers.service';
import { ITrainers } from 'app/domain/model/training/ITrainers';
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
  selector: 'app-trainers',
  templateUrl: './trainers.component.html',
  styleUrls: ['./trainers.component.css'],
  providers: [TrainersService, ConfirmationService, MessageService],
})
export class TrainersComponent {
  trainersDialog: boolean = false;
  trainingTypes!: ITrainers[];
  trainers!: ITrainers;
  selectedTrainingTypes!: ITrainers[] | null;
  lastUpdated = new Date(new Date().getTime() - 86400000);
  uploadedFile: any;
  description!: string | null;

  masterEmployee: any;
  masterTrainers: any;
  masterSkills: any;

  submitted: boolean = false;
  statuses!: any[];

  form = this.fb.nonNullable.group({
    trainersId: [0],
    trainersName: [''],
    email: [''],
    skills: new Array(),
    isActive: true,
    createdDate: new Date(),
    createdBy: [''],
    updatedDate: new Date(),
    updatedBy: [''],
  });

  constructor(
    private trainersService: TrainersService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private httpClient: HttpClient,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.httpClient.get<any>('assets/data/data.json').subscribe(s => {
      this.masterSkills = s[0].skills;
      this.trainingTypes = s[0].trainers;
      this.masterTrainers = s[0].trainers;

      console.log(this.masterEmployee);
    });
  }

  refreshData() {
    this.lastUpdated = new Date();
  }

  openNew() {
    this.form.reset();
    this.submitted = false;
    this.trainersDialog = true;
  }

  editTrainers(trainers: ITrainers) {
    this.form.patchValue(trainers);
    this.trainersDialog = true;
  }

  deleteTrainers(trainers: ITrainers) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + trainers.trainersName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.trainingTypes = this.trainingTypes.filter(
          val => val.trainersId !== trainers.trainersId
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
    this.trainersDialog = false;
    this.submitted = false;
    this.description = null;
  }

  async saveTrainers() {
    this.submitted = true;

    let newModel: any = {
      trainersId: this.form.value.trainersId,
      trainersName: this.form.value.trainersName,
      email: this.form.value.email,
      skills: this.form.value.skills,
      isActive: this.form.value.isActive,
      createdDate: new Date(),
      createdBy: 'Administrator',
      updatedDate: new Date(),
      updatedBy: 'Administrator',
    };

    if (this.form.value.trainersId === 0) {
      const uploadDateTime = new Date();
      const uploadDateTimeNumber = uploadDateTime.getTime();

      newModel['trainersId'] = uploadDateTimeNumber;
      console.log(newModel);
      this.trainingTypes.push(newModel);
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Training Created',
        life: 3000,
      });
      console.log(this.trainingTypes);
    } else {
      this.trainingTypes[this.findIndexById(this.form.value.trainersId!)] = newModel;
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Training Updated',
        life: 3000,
      });
    }
    this.trainersDialog = false;
  }

  findIndexById(Id: number): number {
    let index = -1;
    for (let i = 0; i < this.trainingTypes.length; i++) {
      if (this.trainingTypes[i].trainersId === Id) {
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

  getStatusTrainers(isStatus: string) {
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
