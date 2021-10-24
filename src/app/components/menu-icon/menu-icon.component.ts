import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SettingsComponent } from '../modals/settings/settings.component';

@Component({
  selector: 'app-menu-icon',
  templateUrl: './menu-icon.component.html',
  styleUrls: ['./menu-icon.component.scss'],
})
export class MenuIconComponent implements OnInit {
  public settingsOpen = false;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  public showSettings(): void {
    this.settingsOpen = true;
    this.dialog
      .open(SettingsComponent)
      .afterClosed()
      .subscribe(() => {
        this.settingsOpen = false;
      });
  }

  public closeSettings(): void {
    this.settingsOpen = false;
    this.dialog.closeAll();
  }

  public toggleSettings(): void {
    this.settingsOpen ? this.closeSettings() : this.showSettings();
  }
}
