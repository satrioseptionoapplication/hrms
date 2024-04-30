export interface IProject {
  projectId: number; // A unique identifier for each project
  projectName: string; // The name of the project
  startDate: Date; // The start date of the project
  endDate: Date; // The end date of the project
  status: string; // The status of the project (e.g., "In Progress", "Completed", "On Hold")
  description: string; // A brief description of the project
  manager: string; // The name of the project manager
  teamMembers: string[] | null; // An array of team members involved in the project
  isActive: boolean;
}
