import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ISettings, SettingsService } from './services/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public settings: ISettings;

  constructor(
    private route: ActivatedRoute,
    private settingsService: SettingsService,
    private overlayContainer: OverlayContainer
  ) {
    this.overlayContainer.getContainerElement().classList.add('dark-theme');
  }

  ngOnInit(): void {
    this.initRoute();
    this.listenToSettingsChanges();
  }

  private get controls(): any {
    return this.settingsService.settings.controls;
  }

  private initRoute(): void {
    this.route.queryParams.subscribe((params: any) => {
      if (!(params.date || params.message)) return;

      const units = params.units.split(',');
      const settings = { ...this.settings };
      settings.date = new Date(params.date.split('-').reverse().join('-'));
      settings.message = params.message;

      Object.values(settings.units).forEach((group: any) => {
        Object.keys(group).forEach((key: string) => {
          group[key] = units.includes(key);
        });
      });

      this.settingsService.settings.patchValue(settings);
    });
  }

  private listenToSettingsChanges(): void {
    this.settingsService.settingsUpdateEvent.subscribe(
      (settings: ISettings) => {
        this.settings = settings;
      }
    );
  }
}
