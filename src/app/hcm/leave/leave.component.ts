import { Component, OnInit } from '@angular/core';
import { LeaveService } from './leave.service';
import { ILeave } from '../../domain/model/hcm/ILeave';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.css'],
  providers: [LeaveService, ConfirmationService, MessageService],
})
export class LeaveComponent {
  leaveDialog: boolean = false;
  leaves!: ILeave[];
  leave!: ILeave;
  selectedLeaves!: ILeave[] | null;
  lastUpdated = new Date(new Date().getTime() - 86400000);
  uploadedFile: any;
  description!: string | null;

  masterEmployee!: ILeave[];
  masterManagers: any;
  masterLeave: any;
  masterPositions: any;
  masterDepartments: any;

  submitted: boolean = false;
  statuses!: any[];

  totalapproved = 0;
  totalpending = 0;
  totalreject = 0;

  form = this.fb.nonNullable.group({
    leaveId: 0,
    employeeName: [''],
    startDate: new Date(),
    endDate: new Date(),
    leaveType: [''],
    duration: [''],
    days: 0,
    state: [''],
    createdDate: new Date(),
    createdBy: [''],
    reason: [''],
    balance: 0,
    manager: [''],
  });

  constructor(
    private leaveService: LeaveService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private httpClient: HttpClient,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.httpClient.get<any>('assets/data/data.json').subscribe(s => {
      this.masterEmployee = s[0].employee;
      this.masterManagers = s[0].managers;
      this.masterLeave = s[0].leave;
      this.masterPositions = s[0].positions;
      this.masterDepartments = s[0].departments;

      this.totalCard();
    });
  }

  openNew() {
    this.form.reset();
    this.submitted = false;
    this.leaveDialog = true;
  }

  totalCard() {
    let countApproved = 0;
    this.masterEmployee.forEach((employee: any) => {
      if (employee.state === 'Approved') {
        countApproved++;
      }
    });
    this.totalapproved = countApproved;

    let countPending = 0;
    this.masterEmployee.forEach((employee: any) => {
      if (employee.state === 'Pending') {
        countPending++;
      }
    });
    this.totalpending = countPending;

    let countReject = 0;
    this.masterEmployee.forEach((employee: any) => {
      if (employee.state === 'Rejected') {
        countReject++;
      }
    });
    this.totalreject = countReject;
  }

  refreshData() {
    this.lastUpdated = new Date();
  }

  editLeave(leave: ILeave) {
    var startDate: any = new Date(leave.startDate);
    var endDate: any = new Date(leave.endDate);
    var differenceInMs = endDate - startDate;

    // Convert milliseconds to days
    var daysDifference = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
    leave.startDate = new Date(leave.startDate);
    leave.endDate = new Date(leave.endDate);
    leave.duration = daysDifference + ' days';
    leave.days = daysDifference;
    this.form.patchValue(leave);
    this.leaveDialog = true;
  }

  deleteLeave(leave: ILeave) {
    console.log(leave);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + leave.employeeName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.masterEmployee = this.masterEmployee.filter(
          (val: any) => val.leaveId !== leave.leaveId
        );
        this.totalCard();
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Leave Deleted',
          life: 3000,
        });
      },
    });
  }

  hideDialog() {
    this.leaveDialog = false;
    this.submitted = false;
    this.description = null;
  }

  saveLeave() {
    this.submitted = true;

    var startDate: any = new Date(this.form.value.startDate!);
    var endDate: any = new Date(this.form.value.endDate!);
    var differenceInMs = endDate - startDate;

    // Convert milliseconds to days
    var daysDifference = Math.floor(differenceInMs / (1000 * 60 * 60 * 24)) + 1;

    let newModel: any = {
      leaveId: this.form.value.leaveId,
      employeeName: this.form.value.employeeName,
      startDate: this.form.value.startDate,
      endDate: this.form.value.endDate,
      leaveType: this.form.value.leaveType,
      duration: daysDifference + ' days',
      days: daysDifference,
      state: this.form.value.state,
      createdDate: new Date(),
      createdBy: 'Administrator',
      reason: this.form.value.reason,
      balance: 12 - daysDifference,
      manager: this.form.value.manager,
    };

    if (this.form.value.leaveId === 0) {
      const uploadDateTime = new Date();
      const uploadDateTimeNumber = uploadDateTime.getTime();

      newModel['leaveId'] = uploadDateTimeNumber;
      newModel['state'] = 'Pending';
      this.masterEmployee.push(newModel);
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Training Created',
        life: 3000,
      });
    } else {
      this.masterEmployee[this.findIndexById(this.form.value.leaveId!)] = newModel;
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Training Updated',
        life: 3000,
      });
    }

    this.totalCard();
    this.leaveDialog = false;
  }

  approveLeave(leave: ILeave) {
    console.log(this.leave);
    this.leaves = [...this.leaves];
  }

  rejectLeave(leave: ILeave) {
    console.log(this.leave);
    this.leaves = [...this.leaves];
  }

  findIndexById(Id: number): number {
    let index = -1;
    for (let i = 0; i < this.masterEmployee.length; i++) {
      if (this.masterEmployee[i].leaveId === Id) {
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

  getStatusLeave(isStatus: string) {
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
