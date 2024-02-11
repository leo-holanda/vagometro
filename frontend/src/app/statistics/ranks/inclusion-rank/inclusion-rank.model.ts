export enum InclusionTypes {
  PCD = 'Também para PCD',
  blackPeople = 'Pessoas negras',
  women = 'Mulheres',
  transgender = 'Trans',
  diversePeople = 'Pessoas diversas',
  nonPCD = 'Não-PCD',
  unknown = 'Desconhecido',
}

export type InclusionData = {
  name: InclusionTypes;
  count: number;
};

interface InclusionRelatedTerms {
  [key: string]: InclusionTypes;
}

export const inclusionRelatedTerms: InclusionRelatedTerms = {
  'para pessoas com deficiência': InclusionTypes.PCD,
  'para pessoa com deficiência': InclusionTypes.PCD,
  'para pessoas com deficiência (pcd)': InclusionTypes.PCD,
  'para pessoa com deficiência (pcd)': InclusionTypes.PCD,
  'para profissionais com deficiência': InclusionTypes.PCD,
  'para profissional com deficiência': InclusionTypes.PCD,
  'para pcd': InclusionTypes.PCD,
  'vaga afirmativa - pcd': InclusionTypes.PCD,

  'para pessoas negras': InclusionTypes.blackPeople,

  'para mulheres': InclusionTypes.women,
  'para mulher': InclusionTypes.women,
  'afirmativa feminina': InclusionTypes.women,

  'para talentos diversos': InclusionTypes.diversePeople,
  'para talento diverso': InclusionTypes.diversePeople,
  'para pessoas diversas': InclusionTypes.diversePeople,
  'para pessoa diversa': InclusionTypes.diversePeople,
  'para grupos de diversidade': InclusionTypes.diversePeople,
  'para grupo de diversidade': InclusionTypes.diversePeople,

  'para pessoas trans': InclusionTypes.transgender,
  'para pessoa trans': InclusionTypes.transgender,
};
