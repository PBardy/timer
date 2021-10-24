import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'float',
})
export class FloatPipe implements PipeTransform {
  constructor(private decimalPipe: DecimalPipe) {}

  public transform(value: number): string {
    if (value > 1e-3 || value === 0) return value.toString();

    return value > 1e10
      ? value.toPrecision(3)
      : (this.decimalPipe.transform(value, '1.2-2') as string);
  }
}
