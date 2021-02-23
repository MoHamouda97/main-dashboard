import { PipeTransform, Pipe } from '@angular/core';
import * as lang from './../settings/lang';

@Pipe({name: 'translateAr'})
export class TranslateArPipe implements PipeTransform {    
    transform(value, args:string[]) : any {
        const dictionary: any = JSON.parse(lang.lang);
        const wordToBeTranslated: any = Object.keys(value);
        let translation: any;
        let word;

        if (typeof(value) == 'object') {
            translation = [];

            for ( let i = 0; i <= wordToBeTranslated.length; i ++) {
                 word = dictionary.filter(dic => dic.FieldName == wordToBeTranslated[i]); 
                 
                (word.length == 0) ? translation.push(wordToBeTranslated[i]) : translation.push(word[0].ArabicCap);     
            } 
            
            translation.pop();
        }        

        if (typeof(value) == 'string') {
            word = dictionary.filter(dic => dic.FieldName == value);
            (word.length == 0) ? translation = value : translation = word[0].ArabicCap;
        }

        return translation;
    }
}