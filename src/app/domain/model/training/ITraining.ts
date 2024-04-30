export interface ITraining {
  trainingId: number;
  trainingName: string;
  trainingType: string;
  trainers: string;
  employees: string[] | null; // An array of team members involved in the project
  startDate: Date;
  endDate: Date;
  description: string;
  isActive: boolean;
  createdDate: Date;
  createdBy: string;
  updatedDate: Date;
  updatedBy: string;
}
