export interface IIcon {
  className?: string;
}

export interface IUserResume {
  data: {
    title: string;
    resumeId: string;
    userEmail: string | undefined;
    userName: string | null | undefined;
  };
}

export interface IReusme {
  createdAt?: string;
  documentId?: string;
  id: string;
  locale?: null;
  publishedAt?: string;
  resumeId?: string;
  title?: string;
  updatedAt?: string;
  userEmail?: string;
  userName?: string;
}

export interface IPersonalData {
  firstName: string;
  lastName: string;
  jobTitle: string;
  phone: string;
  email: string;
  address: string;
}

export interface IEducation {
  id?: number;
  universityName: string;
  startDate: string;
  endDate?: string;
  currentlyStudy?: boolean;
  degree: string;
  major: string;
  minor?: string | null;
  description?: string | null;
}

export interface IExperience {
  id?: string;
  title: string;
  companyName: string;
  city: string;
  state: string;
  startDate: string;
  endDate?: string;
  currentlyWorking?: boolean;
  workSummary: string;
}

export interface IProjects {
  id?: string;
  title: string;
  description?: string | null;
  projectUrl?: string | null;
}

export interface ICertification {
  id?: string;
  title: string;
  issuer: string;
  date: string;
}

export interface ISkills {
  id?: string;
  name: string;
  rating?: number | null | undefined;
}

export interface ILanguages {
  id?: string;
  name: string;
  proficiency?: string | null | undefined;
}
export interface IReferences {
  id?: string;
  name: string;
  position: string;
  company: string;
  contact: string;
}
export interface IHobby {
  id: string;
  name: string;
}

export interface IResumeInfo {
  personalData?: IPersonalData[];
  themeColor?: string;
  summary?: string;
  experience?: IExperience[];
  education?: IEducation[];
  skills?: ISkills[];
  certifications?: ICertification[];
  projects?: IProjects[];
  languages?: ILanguages[];
  hobbies?: IHobby[];
  references?: IReferences[];
}

export interface IErrorResponse {
  error: {
    details?: {
      errors: {
        message: string;
      }[];
    };
    message?: string;
  };
}

export interface IFormProbs {
  enableNextBtn: boolean;
  handleEnableNextBtn: () => void;
  handleDisableNextBtn: () => void;
}

export interface IGeneratedSummary {
  summary: string;
  experience_level: "Fresher" | "Mid-Level" | "Senior";
}

// interfaces.ts
export interface IExperienceField {
  title: string;
  companyName: string;
  city: string;
  workSummary: string;
}

export interface IExperienceForm {
  experience: IExperienceField[];
}
