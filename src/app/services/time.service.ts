import { Injectable } from '@angular/core';
import { ITimeCard } from '../components/time-cards/time-card/time-card.component';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root',
})
export class TimeService {
  static multipliers: ConversionTable = {
    yoctoseconds: 1.0e-21,
    zeptoseconds: 1.0e-18,
    attoseconds: 1.0e-15,
    femtoseconds: 1.0e-12,
    picoseconds: 1.0e-9,
    nanoseconds: 1.0e-6,
    microseconds: 1.0e-3,
    milliseconds: 1,
    centiseconds: 10,
    deciseconds: 100,
    seconds: 1000,
    minutes: 60000,
    hours: 3.6e6,
    days: 8.64e7,
    weeks: 6.048e8,
    fortnights: 6.048e8 * 2,
    months: 2.628e9,
    years: 3.154e10,
    decade: 3.154e11,
    centuries: 3.154e12,
  };

  constructor(private settingsService: SettingsService) {}

  public getTimeCardValues(): ITimeCard[] {
    const { date, units } = this.settingsService.settings.value;

    let values: ITimeCard[] = [];
    let milliseconds = Math.abs(Date.now() - date.getTime());

    Object.values(units).forEach((scale: any) =>
      Object.entries(scale).forEach((entry: any) => {
        const [key, value] = entry;
        if (!value) return;

        // value is to be calculated
        const multiplier = TimeService.multipliers[key];
        const rounded = Math.floor(milliseconds / multiplier);

        milliseconds -= rounded * multiplier;
        values.push({ unit: key, value: rounded });
      })
    );

    return values;
  }
}

export type ConversionTable = {
  [key: string]: number;
};
