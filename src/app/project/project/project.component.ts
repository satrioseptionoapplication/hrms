import { Component } from '@angular/core';
import { ProjectService } from './project.service';
import { IProject } from '../../domain/model/master/IProject';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
  providers: [ProjectService, ConfirmationService, MessageService],
})
export class ProjectComponent {
  projectDialog: boolean = false;
  projects!: IProject[];
  project!: IProject;
  selectedProjects!: IProject[] | null;
  lastUpdated = new Date(new Date().getTime() - 86400000);
  description!: string | null;

  manager = [
    { name: 'John Doe', code: 'John Doe' },
    { name: 'Roy Valos', code: 'Roy Valos' },
    { name: 'Marcus', code: 'Marcus' },
  ];

  members = [
    { id: 'Alice Smith', text: 'Alice Smith' },
    { id: 'Bob Johnson', text: 'Bob Johnson' },
    { id: 'Charlie Brown', text: 'Charlie Brown' },
    { id: 'Mark', text: 'Mark' },
    { id: 'Justin', text: 'Justin' },
    { id: 'Vanessa', text: 'Vanessa' },
    { id: 'Diky', text: 'Diky' },
  ];

  submitted: boolean = false;
  statuses!: any[];

  form = this.fb.nonNullable.group({
    projectId: [0],
    projectName: ['', [Validators.required]],
    startDate: [new Date(), [Validators.required]],
    endDate: [new Date(), [Validators.required]],
    status: ['', [Validators.required]],
    description: ['', [Validators.required]],
    manager: ['', [Validators.required]],
    teamMembers: new Array(),
    isActive: [true, [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.projects = [
      {
        projectId: 1,
        projectName: 'Website Redesign',
        startDate: new Date('2024-04-01'),
        endDate: new Date('2024-05-31'),
        status: 'In Progress',
        description: 'Redesign the company website to improve user experience.',
        manager: 'John Doe',
        teamMembers: ['Alice Smith', 'Bob Johnson', 'Charlie Brown'],
        isActive: true,
      },
      {
        projectId: 2,
        projectName: 'Migration',
        startDate: new Date('2023-02-02'),
        endDate: new Date('2023-05-05'),
        status: 'Completed',
        description: 'OPBG to TIPLUS',
        manager: 'Roy Valos',
        teamMembers: ['Mark', 'Justin', 'Vanessa'],
        isActive: false,
      },
      {
        projectId: 2,
        projectName: 'Treasury',
        startDate: new Date('2023-02-02'),
        endDate: new Date('2023-05-05'),
        status: 'Cancel',
        description: 'Treasury Apps',
        manager: 'Marcus',
        teamMembers: ['Diky', 'Yiti'],
        isActive: true,
      },
    ];
  }

  openNew() {
    this.form.reset();
    this.submitted = false;
    this.projectDialog = true;
  }

  refreshData() {
    this.lastUpdated = new Date();
  }

  editProject(project: IProject) {
    this.form.patchValue(project);
    this.projectDialog = true;
  }

  deleteProject(project: IProject) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + project.projectName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.projects = this.projects.filter(val => val.projectId !== project.projectId);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Project Deleted',
          life: 3000,
        });
      },
    });
  }

  hideDialog() {
    this.projectDialog = false;
    this.submitted = false;
    this.description = null;
  }

  onDropdownChangeManager(event: any) {
    console.log(event);
    console.log(event.value.name);
    this.form.value.manager = event.value.name;
  }

  saveProject() {
    this.submitted = true;

    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Project Created',
      life: 3000,
    });

    this.projects.push({
      projectId: this.createId(),
      projectName: this.form.value.projectName!,
      startDate: this.form.value.startDate!,
      endDate: this.form.value.endDate!,
      status: 'Completed',
      description: this.form.value.description!,
      manager: this.form.value.manager!,
      teamMembers: this.form.value.teamMembers,
      isActive: true,
    });
    this.description = null;
    this.projectDialog = false;

    console.log(this.projects);
  }

  findIndexById(Id: number): number {
    let index = -1;
    for (let i = 0; i < this.projects.length; i++) {
      if (this.projects[i].projectId === Id) {
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
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'warning';
      case 'Cancel':
        return 'danger';
      default:
        return 'secondary';
    }
  }
}
