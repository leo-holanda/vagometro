type CollectionData = {
  collectionName: string;
  dbName: string;
};

export const collectionMap: Record<string, CollectionData> = {
  gupyDev: {
    collectionName: 'webdev',
    dbName: 'gupy',
  },
  gupyMobile: {
    collectionName: 'mobile',
    dbName: 'gupy',
  },
  gupyDevops: {
    collectionName: 'devops',
    dbName: 'gupy',
  },
  gupyUIUX: {
    collectionName: 'ui/ux',
    dbName: 'gupy',
  },
  gupyDados: {
    collectionName: 'dados',
    dbName: 'gupy',
  },
  gupyQA: {
    collectionName: 'qa',
    dbName: 'gupy',
  },
  gupyIA: {
    collectionName: 'ia',
    dbName: 'gupy',
  },
  gupyProductManager: {
    collectionName: 'productManager',
    dbName: 'gupy',
  },
  gupyAgileRelated: {
    collectionName: 'agile',
    dbName: 'gupy',
  },
  gupyRecruitment: {
    collectionName: 'recrutamento',
    dbName: 'gupy',
  },
  linkedinDev: {
    collectionName: 'dev',
    dbName: 'linkedin',
  },
  linkedinDevOpsBr: {
    collectionName: 'devops_br',
    dbName: 'linkedin',
  },
};
