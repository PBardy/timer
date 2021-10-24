import { Component, OnInit } from '@angular/core';
import { ISettings, SettingsService } from 'src/app/services/settings.service';
import { TimeService } from 'src/app/services/time.service';
import { ITimeCard } from './time-card/time-card.component';

@Component({
  selector: 'app-time-cards',
  templateUrl: './time-cards.component.html',
  styleUrls: ['./time-cards.component.scss'],
})
export class TimeCardsComponent implements OnInit {
  private fps = 1;
  private fpsInterval = 1000 / 1;
  private lastTick = 0;
  private timerRef: number;
  private paused = false;
  private stopped = false;

  public timeCardValues: ITimeCard[] = [];

  constructor(private timeService: TimeService) {
    this.tick = this.tick.bind(this);
  }

  ngOnInit(): void {
    this.startTimer();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.timerRef);
  }

  private startTimer(): void {
    this.lastTick = 0;
    this.timerRef = requestAnimationFrame(this.tick);
  }

  private tick(timestamp: number): void {
    if (this.stopped) return;
    this.timerRef = requestAnimationFrame(this.tick);
    if (this.paused) return;
    if (timestamp - this.lastTick < this.fpsInterval) return;

    this.lastTick = timestamp;
    this.updateTimer();
  }

  private updateTimer(): void {
    this.timeCardValues = this.timeService.getTimeCardValues();
  }

  public setFps(fps: number): void {
    if (this.fps <= 0) return;
    this.fps = fps;
    this.fpsInterval = 1000 / fps;
  }

  public stop(): void {
    this.stopped = true;
  }

  public pause(): void {
    this.paused = true;
  }
}
