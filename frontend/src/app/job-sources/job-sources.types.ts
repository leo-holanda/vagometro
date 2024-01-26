export enum JobSources {
  gupy = 'gupy',
  frontendbr = 'frontendbr',
  backendbr = 'backendbr',
}

export type JobSourceData = {
  name: string;
  icon: string;
  isActive: boolean;
};

export type JobSourcesMap = Record<JobSources, JobSourceData>;

export const jobSourcesMap: JobSourcesMap = {
  gupy: {
    name: 'Gupy',
    icon: 'bx bxs-business',
    isActive: false,
  },
  frontendbr: {
    name: 'frontendbr/vagas',
    icon: 'bx bxl-github',
    isActive: false,
  },
  backendbr: {
    name: 'backend-br/vagas',
    icon: 'bx bxl-github',
    isActive: false,
  },
};
