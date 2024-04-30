export interface IReimbusement {
  id: number;
  employee: string;
  reimbusement: string;
  description: string;
  amount: number;
  createdDate: Date;
  createdBy: string;
  updatedDate: Date;
  updatedBy: string;
  status: string;
}
