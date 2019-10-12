import { Pipe, PipeTransform } from '@angular/core';
import { multiLanguageTranslator } from './multi-language-translator.service';

@Pipe({ name: 'translator', pure: false })
export class multiLanguageTranslatorPipe implements PipeTransform {
  constructor(private translator: multiLanguageTranslator) { }
  transform(value: any) {
    if (!value) return;
    return this.translator.get(value);
  }
}