import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  public settings = new FormGroup({
    date: new FormControl(new Date(2008, 2, 24)),
    message: new FormControl('The Last Time Spurs Won A Trophy'),
    units: new FormGroup({
      large: new FormGroup({
        decades: new FormControl(false),
        centuries: new FormControl(false),
      }),
      medium: new FormGroup({
        years: new FormControl(true),
        months: new FormControl(true),
        fortnights: new FormControl(false),
        weeks: new FormControl(false),
        days: new FormControl(true),
        hours: new FormControl(true),
        minutes: new FormControl(true),
        seconds: new FormControl(true),
      }),
      small: new FormGroup({
        deciseconds: new FormControl(false),
        centiseconds: new FormControl(false),
        milliseconds: new FormControl(false),
        microseconds: new FormControl(false),
        nanoseconds: new FormControl(false),
        picoseconds: new FormControl(false),
        femtoseconds: new FormControl(false),
        attoseconds: new FormControl(false),
        zeptoseconds: new FormControl(false),
        yoctoseconds: new FormControl(false),
      }),
    }),
  });

  private settingsSubject = new ReplaySubject<ISettings>(1);
  public settingsUpdateEvent: Observable<ISettings>;

  constructor() {
    this.load();

    this.settingsUpdateEvent = this.settingsSubject.asObservable();
    this.settingsSubject.next(this.settings.value);
    this.settings.valueChanges.subscribe(() => {
      this.settingsSubject.next(this.settings.value);
    });
  }

  public save(): void {
    localStorage.setItem('settings', JSON.stringify(this.settings.value));
  }

  public load(): void {
    const settingsString = localStorage.getItem('settings');
    if (settingsString) {
      const settings = JSON.parse(settingsString) as ISettings;
      const date = settings.date as unknown as string;
      this.settings.patchValue(settings);
      this.settings.controls.date.patchValue(new Date(date));
    }
  }
}

export interface ISettings {
  date: Date;
  message: string;
  units: {
    small: {};
    medium: {
      seconds: boolean;
      minutes: boolean;
      hours: boolean;
      days: boolean;
      weeks: boolean;
      fortnights: boolean;
      months: boolean;
      years: boolean;
    };
    large: {};
  };
}
