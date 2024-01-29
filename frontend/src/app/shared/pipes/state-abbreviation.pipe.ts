import { Pipe, PipeTransform } from '@angular/core';

type StatesDict = {
  [id: string]: string;
};

@Pipe({
  name: 'stateAbbreviation',
  standalone: true,
})
export class StateAbbreviationPipe implements PipeTransform {
  states: StatesDict = {
    Acre: 'AC',
    Alagoas: 'AL',
    Amapá: 'AP',
    Amazonas: 'AM',
    Bahia: 'BA',
    Ceará: 'CE',
    'Espírito Santo': 'ES',
    Goiás: 'GO',
    Maranhão: 'MA',
    'Mato Grosso': 'MT',
    'Mato Grosso do Sul': 'MS',
    'Minas Gerais': 'MG',
    Pará: 'PA',
    Paraíba: 'PB',
    Paraná: 'PR',
    Pernambuco: 'PE',
    Piauí: 'PI',
    'Rio de Janeiro': 'RJ',
    'Rio Grande do Norte': 'RN',
    'Rio Grande do Sul': 'RS',
    Rondônia: 'RO',
    Roraima: 'RR',
    'Santa Catarina': 'SC',
    'São Paulo': 'SP',
    Sergipe: 'SE',
    Tocantins: 'TO',
    'Distrito Federal': 'DF',
  };

  transform(value: string, ...args: unknown[]): unknown {
    return this.states[value] || 'Desconhecido';
  }
}
