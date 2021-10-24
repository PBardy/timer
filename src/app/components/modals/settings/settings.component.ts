import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SnackbarConfig } from 'src/app/config';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  public search = '';
  public searchSubject = new Subject<string>();

  constructor(
    private clipboard: Clipboard,
    private snackbar: MatSnackBar,
    public settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.initSearch();
  }

  ngOnDestroy(): void {
    this.searchSubject.unsubscribe();
  }

  private initSearch(): void {
    this.searchSubject
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((model: string) => {
        this.search = model;
      });
  }

  public onSearch(searchTerm: string): void {
    this.searchSubject.next(searchTerm);
  }

  public inFilter(s: string): boolean {
    const a = s.toLowerCase();
    const b = this.search.toLowerCase();
    return a.includes(b) || b.includes(a);
  }

  public get settings(): FormGroup {
    return this.settingsService.settings;
  }

  public get units(): FormGroup {
    return this.settings.controls.units as FormGroup;
  }

  public get largeUnits(): FormGroup {
    return this.units.controls.large as FormGroup;
  }

  public get mediumUnits(): FormGroup {
    return this.units.controls.medium as FormGroup;
  }

  public get smallUnits(): FormGroup {
    return this.units.controls.small as FormGroup;
  }

  public saveSettings(): void {
    this.settingsService.save();
    this.snackbar.open('Settings Saved', 'Close', SnackbarConfig);
  }

  public shareTimer(): void {
    // Get units with true values
    const qs = Object.values(this.units.value)
      .map((u: any) => Object.entries(u).filter(([k, v]) => (v ? k : false)))
      .flat()
      .map(([k, _]) => k);

    // Format date for query params
    const date = this.settings.controls.date.value
      .toLocaleDateString()
      .replaceAll('/', '-');

    // Build query params as string
    const params = new URLSearchParams();
    params.set('date', date);
    params.set('message', this.settings.controls.message.value);
    params.set('units', '');
    params.set('units', qs.join(','));

    // Get URL and copy to clipboard
    this.clipboard.copy(window.location.href + '?' + params.toString());
    this.snackbar.open('URL Copied to Clipboard', 'Close', SnackbarConfig);
  }
}
