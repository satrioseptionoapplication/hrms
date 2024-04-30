import { Component } from '@angular/core';
import { DocumentService } from '../requestor/document.service';
import { IDocument } from '../../domain/model/master/IDocument';
import { ConfirmationService, Message, MessageService } from 'primeng/api';

@Component({
  selector: 'app-document-approval',
  templateUrl: './document-approval.component.html',
  styleUrls: ['./document-approval.component.css'],
  providers: [DocumentService, ConfirmationService, MessageService],
})
export class DocumentApprovalComponent {
  documentapprovalDialog: boolean = false;
  documentapprovals!: IDocument[];
  documentapproval!: IDocument;
  selectedDocumentApprovals!: IDocument[] | null;
  lastUpdated = new Date(new Date().getTime() - 86400000);
  uploadedFile: any;
  description!: string | null;

  submitted: boolean = false;
  statuses!: any[];

  totalapproved = 0;
  totalpending = 0;
  totalreject = 0;

  constructor(
    private documentapprovalService: DocumentService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.documentapprovals = [
      {
        Id: 1,
        fileName: 'documentapproval1.pdf',
        fileOriginalName: 'ori-doc.pdf',
        fileType: 'pdf',
        fileSize: 25, // 1 MB
        fileUrl: 'https://example.com/files/documentapproval1.pdf',
        description: 'file deskripsi',
        createdDate: new Date('2024-04-14T08:00:00Z'),
        createdBy: 'Josh',
        updatedDate: new Date('2024-04-01T08:00:00Z'),
        updatedBy: 'Josh',
        status: 'Pending',
        isActive: true,
      },
      {
        Id: 2,
        fileName: 'image1.jpg',
        fileOriginalName: 'doc-jan.pdf',
        fileType: 'jpeg',
        fileSize: 1300, // 512 KB
        fileUrl: 'https://example.com/files/image1.jpg',
        description: 'file detail gambar',
        createdDate: new Date('2024-04-14T08:00:00Z'),
        createdBy: 'Josh',
        updatedDate: new Date('2024-04-14T15:00:00Z'),
        updatedBy: 'Josh',
        status: 'Approved',
        isActive: false,
      },
      {
        Id: 3,
        fileName: 'presentation.pptx',
        fileOriginalName: 'ori-final.pdf',
        fileType: 'xls',
        fileSize: 500, // 2 MB
        fileUrl: 'https://example.com/files/presentation.pptx',
        description: 'perhitungan amount',
        createdDate: new Date('2024-04-14T08:00:00Z'),
        createdBy: 'Josh',
        updatedDate: new Date('2024-04-21T20:00:00Z'),
        updatedBy: 'Josh',
        status: 'Rejected',
        isActive: true,
      },
    ];

    this.totalCard();
  }

  totalCard() {
    let countApproved = 0;
    this.documentapprovals.forEach((employee: any) => {
      if (employee.status === 'Approved') {
        countApproved++;
      }
    });
    this.totalapproved = countApproved;

    let countPending = 0;
    this.documentapprovals.forEach((employee: any) => {
      if (employee.status === 'Pending') {
        countPending++;
      }
    });
    this.totalpending = countPending;

    let countReject = 0;
    this.documentapprovals.forEach((employee: any) => {
      if (employee.status === 'Rejected') {
        countReject++;
      }
    });
    this.totalreject = countReject;
  }

  refreshData() {
    this.lastUpdated = new Date();
  }

  openNew() {
    this.submitted = false;
    this.documentapprovalDialog = true;
  }

  editDocumentApproval(documentapproval: IDocument) {
    this.description = documentapproval.description;
    this.documentapproval = documentapproval;
    this.documentapprovalDialog = true;
  }

  deleteDocumentApproval(documentapproval: IDocument) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + documentapproval.fileName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.documentapprovals = this.documentapprovals.filter(
          val => val.Id !== documentapproval.Id
        );
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'DocumentApproval Deleted',
          life: 3000,
        });
      },
    });
  }

  hideDialog() {
    this.documentapprovalDialog = false;
    this.submitted = false;
    this.description = null;
  }

  onFileUpload(event: any) {
    this.uploadedFile = event.files[0]; // Assuming only one file is uploaded
  }

  saveDocumentApproval() {
    this.submitted = true;
    const files = this.uploadedFile;

    if (!this.description) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Description is required',
        life: 3000,
      });
      return;
    }
    if (!files) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'File is required',
        life: 3000,
      });
      return;
    }

    this.documentapprovals.push({
      Id: this.createId(),
      fileName: files.name,
      fileOriginalName: files.name,
      fileType: files.type,
      fileSize: files.size, // 1 MB
      fileUrl: 'https://example.com/files/documentapproval1.pdf',
      description: this.description,
      createdDate: new Date(),
      createdBy: 'Admin',
      updatedDate: new Date(),
      updatedBy: 'Admin',
      status: 'Waiting Approval',
      isActive: true,
    });
    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'DocumentApproval Created',
      life: 3000,
    });

    this.documentapprovals = [...this.documentapprovals];
    this.description = null;
    this.documentapprovalDialog = false;
  }

  downloadDocumentApproval(documentapproval: Document) {
    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'DocumentApproval Downloaded',
      life: 3000,
    });
  }

  findIndexById(Id: number): number {
    let index = -1;
    for (let i = 0; i < this.documentapprovals.length; i++) {
      if (this.documentapprovals[i].Id === Id) {
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
      case 'Pending':
        return 'warning';
      case 'Approved':
        return 'success';
      case 'Rejected':
        return 'danger';
      default:
        return 'secondary';
    }
  }
}
