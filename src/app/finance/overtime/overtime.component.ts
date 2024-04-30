import { Component, OnInit } from '@angular/core';
import { OvertimesService } from './overtime.service';
import { IOvertime } from 'app/domain/model/finance/IOvertime';
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
  selector: 'app-overtime',
  templateUrl: './overtime.component.html',
  styleUrls: ['./overtime.component.css'],
  providers: [OvertimesService, ConfirmationService, MessageService],
})
export class OvertimesComponent {
  overtimesDialog: boolean = false;
  overtimess!: IOvertime[];
  overtimes!: IOvertime;
  selectedOvertimes!: IOvertime[] | null;
  lastUpdated = new Date(new Date().getTime() - 86400000);
  uploadedFile: any;
  description!: string | null;

  overtimesType: any;
  masterEmployee: any;

  submitted: boolean = false;
  statuses!: any[];

  form = this.fb.nonNullable.group({
    id: [0],
    employee: [''],
    type: [''],
    startDate: new Date(),
    endDate: new Date(),
    amount: 0,
    createdDate: new Date(),
    updatedDate: new Date(0),
    updatedBy: 'Administrator',
    createdBy: 'Administrator',
    status: '',
    isActive: true,
  });

  constructor(
    private overtimesService: OvertimesService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private httpClient: HttpClient,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.httpClient.get<any>('assets/data/data.json').subscribe(s => {
      this.overtimesType = s[0].overtime;
      this.overtimess = s[0].overtimes;
      this.masterEmployee = s[0].employee;
    });
  }

  refreshData() {
    this.lastUpdated = new Date();
  }

  openNew() {
    this.form.reset();
    this.submitted = false;
    this.overtimesDialog = true;
  }

  editOvertimes(overtimes: IOvertime) {
    overtimes.startDate = new Date(overtimes.startDate);
    overtimes.endDate = new Date(overtimes.endDate);
    this.form.patchValue(overtimes);
    this.overtimesDialog = true;
  }

  deleteOvertimes(overtimes: IOvertime) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + overtimes.employee + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.overtimess = this.overtimess.filter((val: any) => val.id !== overtimes.id);
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
    this.overtimesDialog = false;
    this.submitted = false;
    this.description = null;
  }

  saveOvertimes() {
    this.submitted = true;

    let newModel = {
      id: 0,
      employee: this.form.value.employee!,
      type: this.form.value.type!,
      startDate: this.form.value.startDate!,
      endDate: this.form.value.endDate!,
      amount: this.form.value.amount!,
      createdDate: this.form.value.createdDate!,
      createdBy: 'Administrator',
      updatedBy: 'Administrator',
      status: this.form.value.status!,
      isActive: this.form.value.isActive!,
      updatedDate: this.form.value.updatedDate!,
    };

    if (this.form.value.id === 0) {
      const uploadDateTime = new Date();
      const uploadDateTimeNumber = uploadDateTime.getTime();

      newModel['id'] = uploadDateTimeNumber;
      newModel['status'] = 'Pending';
      this.overtimess.push(newModel);
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Reimbusement Created',
        life: 3000,
      });
    } else {
      this.overtimess[this.findIndexById(this.form.value.id!)] = newModel;
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Training Updated',
        life: 3000,
      });
    }

    this.overtimesDialog = false;
  }

  findIndexById(Id: number): number {
    let index = -1;
    for (let i = 0; i < this.overtimess.length; i++) {
      if (this.overtimess[i].id === Id) {
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
