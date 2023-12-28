import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsService } from '../../statistics.service';
import { Translations, TypeData } from './type-rank.model';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'vgm-type-rank',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './type-rank.component.html',
  styleUrls: ['./type-rank.component.scss'],
})
export class TypeRankComponent implements OnInit {
  translations: Translations = {
    vacancy_type_apprentice: 'aprendiz',
    vacancy_type_associate: 'associado',
    vacancy_type_talent_pool: 'piscina de talentos',
    vacancy_type_effective: 'efetivo',
    vacancy_type_internship: 'estágio',
    vacancy_type_summer: 'verão',
    vacancy_type_temporary: 'temporário',
    vacancy_type_outsource: 'terceirizado',
    vacancy_type_trainee: 'estagiário',
    vacancy_type_volunteer: 'voluntário',
    vacancy_legal_entity: 'entidade legal',
    vacancy_type_lecturer: 'palestrante',
    vacancy_type_freelancer: 'freelancer',
    vacancy_type_autonomous: 'autônomo',
  };

  typeRank!: Observable<TypeData[]>;

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.typeRank = this.statisticsService
      .getTypeRank()
      .pipe(map((typeRank) => typeRank.slice(0, 5)));
  }
}
