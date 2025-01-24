interface CreateCandidateRequest {
    // Basic Information
    name: string;
    resumeTitle: string;
    contactNumber: string;
    whatsappNumber: string;
    email: string;
    workExp?: string;
    currentCTC: string;
    currentLocation: string;
    state: string;
    currentEmployeer?: string;
    postalAddress?: string;
    preferredLocation?: string;
    dob?: Date;
    remarks?: string;
    
    // Foreign Keys
    UserId: number;
    designationId: number;
    // regionId: number;
    region: string;
    // Related Data
    education?: {
      ugCourse?: string;
      pgCourse?: string|null;
    };
    reasonIds?: number[]; // Array of reason IDs for leaving
  }

export default CreateCandidateRequest;