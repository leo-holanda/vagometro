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

  'afirmativa para talentos negros': InclusionTypes.blackPeople,
  'afirmativa para talento negro': InclusionTypes.blackPeople,
  'afirmativa talentos negros': InclusionTypes.blackPeople,
  'afirmativa talento negro': InclusionTypes.blackPeople,

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

  'exclusiva para profissionais com deficiencia': InclusionTypes.PCD,
  'exclusiva para profissional com deficiencia': InclusionTypes.PCD,
  'exclusiva para pessoas com deficiencia (pcd)': InclusionTypes.PCD,
  'exclusiva para pessoa com deficiencia (pcd)': InclusionTypes.PCD,
  'exclusiva para pessoas com deficiencia': InclusionTypes.PCD,
  'exclusiva para pessoa com deficiencia': InclusionTypes.PCD,

  'exclusiva pessoas com deficiencia': InclusionTypes.PCD,
  'exclusiva pessoa com deficiencia': InclusionTypes.PCD,
  'exclusiva pessoas com deficiencia (pcd)': InclusionTypes.PCD,
  'exclusiva pessoa com deficiencia (pcd)': InclusionTypes.PCD,
  'exclusiva profissionais com deficiencia': InclusionTypes.PCD,
  'exclusiva profissional com deficiencia': InclusionTypes.PCD,

  'exclusiva para pcd': InclusionTypes.PCD,
  'exclusiva pcd': InclusionTypes.PCD,
  'exclusiva (pcd)': InclusionTypes.PCD,

  'vaga exclusiva - pcd': InclusionTypes.PCD,
  'vaga exclusiva - (pcd)': InclusionTypes.PCD,
  'vaga exclusiva - pessoas com deficiência': InclusionTypes.PCD,
  'vaga exclusiva - pessoa com deficiência': InclusionTypes.PCD,

  'exclusiva para pessoas pretas': InclusionTypes.blackPeople,
  'exclusiva pessoas pretas': InclusionTypes.blackPeople,
  'exclusiva para pessoas negras': InclusionTypes.blackPeople,
  'exclusiva pessoas negras': InclusionTypes.blackPeople,

  'exclusiva para talentos negros': InclusionTypes.blackPeople,
  'exclusiva para talento negro': InclusionTypes.blackPeople,
  'exclusiva talentos negros': InclusionTypes.blackPeople,
  'exclusiva talento negro': InclusionTypes.blackPeople,

  'exclusiva para mulheres': InclusionTypes.women,
  'exclusiva mulheres': InclusionTypes.women,
  'exclusiva para mulher': InclusionTypes.women,
  'exclusiva mulher': InclusionTypes.women,
  'exclusiva feminina': InclusionTypes.women,

  'exclusiva para talentos diversos': InclusionTypes.diversePeople,
  'exclusiva para talento diverso': InclusionTypes.diversePeople,
  'exclusiva talentos diversos': InclusionTypes.diversePeople,
  'exclusiva talento diverso': InclusionTypes.diversePeople,

  'exclusiva para pessoas diversas': InclusionTypes.diversePeople,
  'exclusiva para pessoa diversa': InclusionTypes.diversePeople,
  'exclusiva pessoas diversas': InclusionTypes.diversePeople,
  'exclusiva pessoa diversa': InclusionTypes.diversePeople,

  'exclusiva para grupos de diversidade': InclusionTypes.diversePeople,
  'exclusiva para grupo de diversidade': InclusionTypes.diversePeople,
  'exclusiva grupos de diversidade': InclusionTypes.diversePeople,
  'exclusiva grupo de diversidade': InclusionTypes.diversePeople,

  'exclusiva para pessoas trans': InclusionTypes.transgenderPeople,
  'exclusiva para pessoa trans': InclusionTypes.transgenderPeople,
  'exclusiva pessoas trans': InclusionTypes.transgenderPeople,
  'exclusiva pessoa trans': InclusionTypes.transgenderPeople,
};
