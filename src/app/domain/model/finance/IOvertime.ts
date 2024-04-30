export interface IOvertime {
  id: number;
  employee: string;
  type: string;
  startDate: Date;
  endDate: Date;
  amount: number;
  status: string;
  createdDate: Date;
  createdBy: string;
  updatedDate: Date;
  updatedBy: string;
  isActive: boolean;
}
