import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stateAbbreviation',
  standalone: true,
})
export class StateAbbreviationPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    const splittedState = value.split(' ');
    return `${splittedState[0][0]}${
      splittedState[splittedState.length - 1][0]
    }`;
  }
}
