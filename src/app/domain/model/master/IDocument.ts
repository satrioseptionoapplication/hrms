export interface IDocument {
  Id: number; // A unique identifier for each file
  fileName: string; // The name of the uploaded file
  fileOriginalName: string; // The original name of the uploaded file
  fileType: string; // The MIME type or file extension to identify the type of file (e.g., image/jpeg, application/pdf)
  fileSize: number; // The size of the file in bytes
  fileUrl: string; // The URL or file path where the file is stored
  description: string;
  isActive: boolean;
  status: string;
  createdDate: Date;
  createdBy: string;
  updatedDate: Date;
  updatedBy: string;
}
