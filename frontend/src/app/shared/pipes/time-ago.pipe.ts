import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true,
})
export class TimeAgoPipe implements PipeTransform {
  transform(pastDate: Date): string {
    if (!pastDate) return '';

    const now = new Date();
    const seconds = Math.floor((now.getTime() - pastDate.getTime()) / 1000);

    const intervals: { [key: string]: number } = {
      ano: 31536000,
      mês: 2592000,
      semana: 604800,
      dia: 86400,
      hora: 3600,
      minuto: 60,
      segundo: 1,
    };

    for (const i in intervals) {
      const interval = Math.floor(seconds / intervals[i]);
      if (interval >= 1) {
        switch (i) {
          case 'segundo':
            return `Há ${interval} ${interval === 1 ? 'segundo' : 'segundos'}`;
          case 'minuto':
            return `Há ${interval} ${interval === 1 ? 'minuto' : 'minutos'}`;
          case 'hora':
            return `Há ${interval} ${interval === 1 ? 'hora' : 'horas'}`;
          case 'dia':
            return interval === 1 ? 'Ontem' : `Há ${interval} dias`;
          case 'semana':
            return `Há ${interval} ${interval === 1 ? 'semana' : 'semanas'}`;
          case 'mês':
            return interval === 1 ? 'Um mês atrás' : `Há ${interval} meses`;
          case 'ano':
            return interval === 1 ? 'Um ano atrás' : `Há ${interval} anos`;
        }
      }
    }

    return 'Agora mesmo';
  }
}
