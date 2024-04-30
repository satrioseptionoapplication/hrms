import { Component } from '@angular/core';
import { DocumentService } from './document.service';
import { IDocument } from '../../domain/model/master/IDocument';
import { ConfirmationService, Message, MessageService } from 'primeng/api';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css'],
  providers: [DocumentService, ConfirmationService, MessageService],
})
export class DocumentComponent {
  documentDialog: boolean = false;
  documents!: IDocument[];
  document!: IDocument;
  selectedDocuments!: IDocument[] | null;
  lastUpdated = new Date(new Date().getTime() - 86400000);
  uploadedFile: any;
  description!: string | null;

  submitted: boolean = false;
  statuses!: any[];

  totalapproved = 0;
  totalpending = 0;
  totalreject = 0;

  constructor(
    private documentService: DocumentService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.documents = [
      {
        Id: 1,
        fileName: 'document1.pdf',
        fileOriginalName: 'ori-doc.pdf',
        fileType: 'pdf',
        fileSize: 25, // 1 MB
        fileUrl: 'https://example.com/files/document1.pdf',
        description: 'file deskripsi',
        createdDate: new Date('2024-04-14T08:00:00Z'),
        createdBy: 'Josh',
        updatedDate: new Date('2024-04-01T08:00:00Z'),
        updatedBy: 'Josh',
        status: 'Waiting Approval',
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
        status: 'Done',
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
    this.documents.forEach((employee: any) => {
      if (employee.status === 'Approved') {
        countApproved++;
      }
    });
    this.totalapproved = countApproved;

    let countPending = 0;
    this.documents.forEach((employee: any) => {
      if (employee.status === 'Pending') {
        countPending++;
      }
    });
    this.totalpending = countPending;

    let countReject = 0;
    this.documents.forEach((employee: any) => {
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
    this.documentDialog = true;
  }

  editDocument(document: IDocument) {
    this.description = document.description;
    this.document = document;
    this.documentDialog = true;
  }

  deleteDocument(document: IDocument) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + document.fileName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.documents = this.documents.filter(val => val.Id !== document.Id);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Document Deleted',
          life: 3000,
        });
      },
    });
  }

  hideDialog() {
    this.documentDialog = false;
    this.submitted = false;
    this.description = null;
  }

  onFileUpload(event: any) {
    this.uploadedFile = event.files[0]; // Assuming only one file is uploaded
  }

  saveDocument() {
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

    this.documents.push({
      Id: this.createId(),
      fileName: files.name,
      fileOriginalName: files.name,
      fileType: files.type,
      fileSize: files.size, // 1 MB
      fileUrl: 'https://example.com/files/document1.pdf',
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
      detail: 'Document Created',
      life: 3000,
    });

    this.documents = [...this.documents];
    this.description = null;
    this.documentDialog = false;
  }

  downloadDocument(document: IDocument) {
    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Document Downloaded',
      life: 3000,
    });
  }

  findIndexById(Id: number): number {
    let index = -1;
    for (let i = 0; i < this.documents.length; i++) {
      if (this.documents[i].Id === Id) {
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
      case 'Waiting Approval':
        return 'warning';
      case 'Done':
        return 'success';
      case 'Rejected':
        return 'danger';
      default:
        return 'secondary';
    }
  }
}
