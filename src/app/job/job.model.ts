export type Job = {
    careerPageUrl: string;
    jobUrl: string;
    isRemoteWork: boolean;
    companyId: number;
    partition_key: number;
    workplaceType: string;
    sort_key: string;
    country: string;
    name: string;
    state: string;
    city: string;
    disabilities: boolean;
    careerPageId: number;
    applicationDeadline: string;
    badges: Badges;
    careerPageLogo: string;
    careerPageName: string;
    description: string;
    id: number;
    publishedDate: string;
    type: string;
}

export type Badges =  {
    friendlyBadge: boolean;
}
  