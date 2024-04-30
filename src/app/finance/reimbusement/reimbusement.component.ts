import { Component, OnInit } from '@angular/core';
import { ReimbusementsService } from './reimbusement.service';
import { IReimbusement } from 'app/domain/model/finance/IReimbusement';
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
  selector: 'app-reimbusement',
  templateUrl: './reimbusement.component.html',
  styleUrls: ['./reimbusement.component.css'],
  providers: [ReimbusementsService, ConfirmationService, MessageService],
})
export class ReimbusementsComponent {
  reimbusementsDialog: boolean = false;
  reimbusementss!: IReimbusement[];
  reimbusements!: IReimbusement;
  selectedReimbusements!: IReimbusement[] | null;
  lastUpdated = new Date(new Date().getTime() - 86400000);
  uploadedFile: any;
  description!: string | null;

  reimbusementsType: any;
  masterEmployee: any;

  submitted: boolean = false;
  statuses!: any[];
  isDisabled = false;

  form = this.fb.nonNullable.group({
    id: [0],
    employee: [''],
    amount: 0,
    createdDate: new Date(),
    createdBy: 'Administrator',
    updatedDate: new Date(),
    updatedBy: 'Administrator',
    description: [''],
    status: [''],
    reimbusement: [''],
  });

  constructor(
    private reimbusementsService: ReimbusementsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private httpClient: HttpClient,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.httpClient.get<any>('assets/data/data.json').subscribe(s => {
      this.reimbusementsType = s[0].reimbusement;
      this.reimbusementss = s[0].overtimes;
      this.masterEmployee = s[0].employee;
    });
  }

  refreshData() {
    this.lastUpdated = new Date();
  }

  openNew() {
    this.form.reset();
    this.submitted = false;
    this.reimbusementsDialog = true;
    this.isDisabled = false;
  }

  editReimbusements(reimbusements: IReimbusement) {
    this.form.patchValue(reimbusements);
    this.reimbusementsDialog = true;
    this.isDisabled = true;
  }

  deleteReimbusements(reimbusements: IReimbusement) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + reimbusements.employee + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.reimbusementss = this.reimbusementss.filter((val: any) => val.id !== reimbusements.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Data Deleted',
          life: 3000,
        });
      },
    });
  }

  hideDialog() {
    this.reimbusementsDialog = false;
    this.submitted = false;
    this.description = null;
  }

  saveReimbusements() {
    this.submitted = true;

    let newModel = {
      id: 0,
      employee: this.form.value.employee!,
      reimbusement: this.form.value.reimbusement!,
      description: this.form.value.description!,
      amount: this.form.value.amount!,
      createdDate: this.form.value.createdDate!,
      createdBy: this.form.value.createdBy!,
      updatedDate: this.form.value.updatedDate!,
      updatedBy: 'Administrator',
      status: this.form.value.status!,
    };

    if (this.form.value.id === 0) {
      const uploadDateTime = new Date();
      const uploadDateTimeNumber = uploadDateTime.getTime();

      newModel['id'] = uploadDateTimeNumber;
      newModel['status'] = 'Pending';
      newModel['employee'] = newModel.employee;
      this.reimbusementss.push(newModel);
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Reimbusement Created',
        life: 3000,
      });
    } else {
      this.reimbusementss[this.findIndexById(this.form.value.id!)] = newModel;
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Training Updated',
        life: 3000,
      });
    }

    this.reimbusementsDialog = false;
  }

  findIndexById(Id: number): number {
    let index = -1;
    for (let i = 0; i < this.reimbusementss.length; i++) {
      if (this.reimbusementss[i].id === Id) {
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

  getStatus(isStatus: string) {
    switch (isStatus) {
      case 'Payment':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Rejected':
        return 'danger';
      default:
        return 'secondary';
    }
  }
}
