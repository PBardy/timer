import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-time-card',
  templateUrl: './time-card.component.html',
  styleUrls: ['./time-card.component.scss'],
})
export class TimeCardComponent implements OnInit {
  @Input() public value: ITimeCard;
  constructor() {}

  ngOnInit(): void {}
}

export interface ITimeCard {
  unit: string;
  value: number;
}
