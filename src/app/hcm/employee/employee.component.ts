import { Component } from '@angular/core';
import { EmployeeService } from './employee.service';
import { IEmployee } from '../../domain/model/master/IEmployee';
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
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  providers: [EmployeeService, ConfirmationService, MessageService],
})
export class EmployeeComponent {
  employeeDialog: boolean = false;
  employees!: IEmployee[];
  employee!: IEmployee;
  selectedEmployees!: IEmployee[] | null;
  lastUpdated = new Date(new Date().getTime() - 86400000);
  uploadedFile: any;
  description!: string | null;

  submitted: boolean = false;
  statuses!: any[];

  department: any;
  position: any;

  totalemployee = 0;
  totalactive = 0;
  totalpositions = 0;
  totaldepartments = 0;

  form = this.fb.nonNullable.group({
    leaveId: [0, Validators.required],
    birth: new Date(),
    employeeName: '',
    position: '',
    department: '',
    email: '',
    statusLeave: '',
    state: '',
    isActive: true,
    joinDate: new Date(),
  });

  constructor(
    private employeeService: EmployeeService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private httpClient: HttpClient,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.httpClient.get<any>('assets/data/data.json').subscribe(s => {
      this.employees = s[0].employee;
      this.department = s[0].departments;
      this.position = s[0].positions;
      this.totalCard();
    });
  }

  totalCard() {
    this.totalemployee = this.employees.length;
    this.totalactive = this.employees.filter((f: any) => f.isActive == true).length;
    const uniqueDepartments = new Set<string>();
    this.employees.forEach((employee: any) => {
      if (employee.department) {
        uniqueDepartments.add(employee.department);
      }
    });
    this.totaldepartments = uniqueDepartments.size;
    const uniquePositions = new Set<string>();
    this.employees.forEach((employee: any) => {
      if (employee.position) {
        uniquePositions.add(employee.position);
      }
    });

    this.totalpositions = uniquePositions.size;
  }

  refreshData() {
    this.lastUpdated = new Date();
  }

  editEmployee(employee: IEmployee) {
    this.form.patchValue({
      leaveId: employee.leaveId,
      employeeName: employee.employeeName,
      birth: new Date(employee.birth),
      position: employee.position,
      department: employee.department,
      email: employee.email,
      statusLeave: employee.statusLeave,
      state: employee.state,
      isActive: employee.isActive,
    });
    this.employeeDialog = true;
  }

  deleteEmployee(employee: IEmployee) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + employee.employeeName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.employees = this.employees.filter(val => val.leaveId !== employee.leaveId);
        this.totalCard();
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
    this.employeeDialog = false;
    this.submitted = false;
    this.description = null;
  }

  saveEmployee() {
    this.submitted = true;

    let newModel = {
      leaveId: this.form.value.leaveId!,
      employeeName: this.form.value.employeeName!,
      birth: this.form.value.birth!,
      position: this.form.value.position!,
      department: this.form.value.department!,
      email: this.form.value.email!,
      isActive: this.form.value.isActive!,
      statusLeave: this.form.value.statusLeave!,
      state: this.form.value.state!,
      joinDate: this.form.value.joinDate!,
    };
    this.employees[this.findIndexById(this.form.value.leaveId!)] = newModel;

    this.employees = [...this.employees];
    this.description = null;
    this.employeeDialog = false;

    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Employee Updated',
      life: 3000,
    });
  }

  findIndexById(Id: number): number {
    let index = -1;
    for (let i = 0; i < this.employees.length; i++) {
      if (this.employees[i].leaveId === Id) {
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
