export enum InclusionTypes {
  PCD = 'PCD',
  nonPCD = 'Não-PCD',
  alsoForPCD = 'Também para PCD',
  women = 'Mulheres',
  blackPeople = 'Pessoas negras',
  transgenderPeople = 'Trans',
  diversePeople = 'Pessoas diversas',
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
  'afirmativa para profissionais com deficiencia': InclusionTypes.PCD,
  'afirmativa para profissional com deficiencia': InclusionTypes.PCD,
  'afirmativa para pessoas com deficiencia (pcd)': InclusionTypes.PCD,
  'afirmativa para pessoa com deficiencia (pcd)': InclusionTypes.PCD,
  'afirmativa para pessoas com deficiencia': InclusionTypes.PCD,
  'afirmativa para pessoa com deficiencia': InclusionTypes.PCD,

  'afirmativa pessoas com deficiencia': InclusionTypes.PCD,
  'afirmativa pessoa com deficiencia': InclusionTypes.PCD,
  'afirmativa pessoas com deficiencia (pcd)': InclusionTypes.PCD,
  'afirmativa pessoa com deficiencia (pcd)': InclusionTypes.PCD,
  'afirmativa profissionais com deficiencia': InclusionTypes.PCD,
  'afirmativa profissional com deficiencia': InclusionTypes.PCD,

  'afirmativa para pcd': InclusionTypes.PCD,
  'afirmativa pcd': InclusionTypes.PCD,
  'afirmativa (pcd)': InclusionTypes.PCD,

  'vaga afirmativa - pcd': InclusionTypes.PCD,
  'vaga afirmativa - (pcd)': InclusionTypes.PCD,
  'vaga afirmativa - pessoas com deficiência': InclusionTypes.PCD,
  'vaga afirmativa - pessoa com deficiência': InclusionTypes.PCD,

  'afirmativa para pessoas pretas': InclusionTypes.blackPeople,
  'afirmativa pessoas pretas': InclusionTypes.blackPeople,
  'afirmativa para pessoas negras': InclusionTypes.blackPeople,
  'afirmativa pessoas negras': InclusionTypes.blackPeople,

  'afirmativa para mulheres': InclusionTypes.women,
  'afirmativa mulheres': InclusionTypes.women,
  'afirmativa para mulher': InclusionTypes.women,
  'afirmativa mulher': InclusionTypes.women,
  'afirmativa feminina': InclusionTypes.women,

  'afirmativa para talentos diversos': InclusionTypes.diversePeople,
  'afirmativa para talento diverso': InclusionTypes.diversePeople,
  'afirmativa talentos diversos': InclusionTypes.diversePeople,
  'afirmativa talento diverso': InclusionTypes.diversePeople,

  'afirmativa para pessoas diversas': InclusionTypes.diversePeople,
  'afirmativa para pessoa diversa': InclusionTypes.diversePeople,
  'afirmativa pessoas diversas': InclusionTypes.diversePeople,
  'afirmativa pessoa diversa': InclusionTypes.diversePeople,

  'afirmativa para grupos de diversidade': InclusionTypes.diversePeople,
  'afirmativa para grupo de diversidade': InclusionTypes.diversePeople,
  'afirmativa grupos de diversidade': InclusionTypes.diversePeople,
  'afirmativa grupo de diversidade': InclusionTypes.diversePeople,

  'afirmativa para pessoas trans': InclusionTypes.transgenderPeople,
  'afirmativa para pessoa trans': InclusionTypes.transgenderPeople,
  'afirmativa pessoas trans': InclusionTypes.transgenderPeople,
  'afirmativa pessoa trans': InclusionTypes.transgenderPeople,
};
