import { Component, OnInit } from '@angular/core';
import { LeaveEmployeeService } from './leave-employee.service';
import { ILeave } from '../../domain/model/hcm/ILeave';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-leave-employee',
  templateUrl: './leave-employee.component.html',
  styleUrls: ['./leave-employee.component.css'],
  providers: [LeaveEmployeeService, ConfirmationService, MessageService],
})
export class LeaveEmployeeComponent {
  leaveEmployeeDialog: boolean = false;
  leaveEmployees!: ILeave[];
  leaveEmployee!: ILeave;
  selectedLeaveEmployeeEmployees!: ILeave[] | null;
  lastUpdated = new Date(new Date().getTime() - 86400000);
  uploadedFile: any;
  description!: string | null;

  masterEmployee: any;
  masterManagers: any;
  masterLeaveEmployee: any;
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
      this.leaveEmployees = s[0].employee;
      this.masterManagers = s[0].managers;
      this.masterLeave = s[0].leave;
      this.masterLeaveEmployee = s[0].leaveEmployee;
      this.masterPositions = s[0].positions;
      this.masterDepartments = s[0].departments;
    });
  }

  openNew() {
    this.form.reset();
    this.submitted = false;
    this.leaveEmployeeDialog = true;
  }

  refreshData() {
    this.lastUpdated = new Date();
  }

  editLeaveEmployee(leaveEmployee: ILeave) {
    var startDate: any = new Date(leaveEmployee.startDate);
    var endDate: any = new Date(leaveEmployee.endDate);
    var differenceInMs = endDate - startDate;

    // Convert milliseconds to days
    var daysDifference = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
    leaveEmployee.startDate = new Date(leaveEmployee.startDate);
    leaveEmployee.endDate = new Date(leaveEmployee.endDate);
    leaveEmployee.duration = daysDifference + ' days';
    leaveEmployee.days = daysDifference;
    this.form.patchValue(leaveEmployee);
    this.leaveEmployeeDialog = true;
  }

  deleteLeaveEmployee(leaveEmployee: ILeave) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + leaveEmployee.employeeName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.leaveEmployees = this.leaveEmployees.filter(
          val => val.leaveId !== leaveEmployee.leaveId
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
    this.leaveEmployeeDialog = false;
    this.submitted = false;
    this.description = null;
  }

  saveLeaveEmployee() {
    this.submitted = true;

    var startDate: any = new Date(this.form.value.startDate!);
    var endDate: any = new Date(this.form.value.endDate!);
    var differenceInMs = endDate - startDate;

    // Convert milliseconds to days
    var daysDifference = Math.floor(differenceInMs / (1000 * 60 * 60 * 24)) + 1;

    let newModel: any = {
      leaveId: this.form.value.leaveId,
      employeeName: 'John Doe',
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
      console.log(this.leaveEmployees);
      console.log(newModel);
      this.leaveEmployees.push(newModel);
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Training Created',
        life: 3000,
      });
    } else {
      console.log(this.leaveEmployees);
      console.log(this.leaveEmployees[this.findIndexById(this.form.value.leaveId!)]);
      console.log(newModel);
      this.leaveEmployees[this.findIndexById(this.form.value.leaveId!)] = newModel;
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Training Updated',
        life: 3000,
      });
    }

    this.leaveEmployeeDialog = false;
  }

  findIndexById(Id: number): number {
    let index = -1;
    for (let i = 0; i < this.leaveEmployees.length; i++) {
      if (this.leaveEmployees[i].leaveId === Id) {
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

  getStatusLeaveEmployee(isStatus: string) {
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
