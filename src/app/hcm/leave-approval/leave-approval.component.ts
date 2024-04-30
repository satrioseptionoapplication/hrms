import { Component, OnInit } from '@angular/core';
import { LeaveEmployeeService } from '../leave-employee/leave-employee.service';
import { ILeave } from '../../domain/model/hcm/ILeave';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-leave-approval',
  templateUrl: './leave-approval.component.html',
  styleUrls: ['./leave-approval.component.css'],
  providers: [LeaveEmployeeService, ConfirmationService, MessageService],
})
export class LeaveApprovalComponent {
  LeaveApprovalDialog: boolean = false;
  leaveApprovals!: ILeave[];
  LeaveApproval!: ILeave;
  selectedLeaveApprovalEmployees!: ILeave[] | null;
  lastUpdated = new Date(new Date().getTime() - 86400000);
  uploadedFile: any;
  description!: string | null;

  masterEmployee: any;
  masterManagers: any;
  masterLeaveApproval: any;
  masterPositions: any;
  masterDepartments: any;
  masterLeave: any;

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

  submitted: boolean = false;
  statuses!: any[];

  constructor(
    private leaveEmployeeService: LeaveEmployeeService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private httpClient: HttpClient,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.httpClient.get<any>('assets/data/data.json').subscribe(s => {
      this.leaveApprovals = s[0].employee;
      this.masterManagers = s[0].managers;
      this.masterLeave = s[0].leave;
      this.masterLeaveApproval = s[0].LeaveApproval;
      this.masterPositions = s[0].positions;
      this.masterDepartments = s[0].departments;
    });
  }

  openNew() {
    this.form.reset();
    this.submitted = false;
    this.LeaveApprovalDialog = true;
  }

  refreshData() {
    this.lastUpdated = new Date();
  }

  editLeaveApproval(LeaveApproval: ILeave) {
    var startDate: any = new Date(LeaveApproval.startDate);
    var endDate: any = new Date(LeaveApproval.endDate);
    var differenceInMs = endDate - startDate;

    // Convert milliseconds to days
    var daysDifference = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
    LeaveApproval.startDate = new Date(LeaveApproval.startDate);
    LeaveApproval.endDate = new Date(LeaveApproval.endDate);
    LeaveApproval.duration = daysDifference + ' days';
    LeaveApproval.days = daysDifference;
    this.form.patchValue(LeaveApproval);
    this.LeaveApprovalDialog = true;
  }

  deleteLeaveApproval(LeaveApproval: ILeave) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + LeaveApproval.employeeName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.leaveApprovals = this.leaveApprovals.filter(
          val => val.leaveId !== LeaveApproval.leaveId
        );
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Leave Employee Deleted',
          life: 3000,
        });
      },
    });
  }

  hideDialog() {
    this.LeaveApprovalDialog = false;
    this.submitted = false;
    this.description = null;
  }

  saveLeaveApproval(id: number) {
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
      duration: this.form.value.duration,
      days: this.form.value.days,
      state: 'Approved',
      createdDate: this.form.value.createdDate,
      createdBy: this.form.value.createdBy,
      reason: this.form.value.reason,
      balance: this.form.value.balance,
      manager: this.form.value.manager,
    };
    console.log(this.leaveApprovals);
    console.log(newModel);
    this.leaveApprovals[this.findIndexById(id)] = newModel;
    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Data Updated',
      life: 3000,
    });
    console.log(this.leaveApprovals);
    this.LeaveApprovalDialog = false;
  }

  saveLeaveRejected(id: number) {
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
      duration: this.form.value.duration,
      days: this.form.value.days,
      state: 'Rejected',
      createdDate: this.form.value.createdDate,
      createdBy: this.form.value.createdBy,
      reason: this.form.value.reason,
      balance: this.form.value.balance,
      manager: this.form.value.manager,
    };

    this.leaveApprovals[this.findIndexById(id)] = newModel;
    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Data Updated',
      life: 3000,
    });

    this.LeaveApprovalDialog = false;
  }

  findIndexById(Id: number): number {
    let index = -1;
    for (let i = 0; i < this.leaveApprovals.length; i++) {
      if (this.leaveApprovals[i].leaveId === Id) {
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

  getStatusLeaveApproval(isStatus: string) {
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
