import { PipeTransform, Pipe } from '@angular/core';

@Pipe({name: 'replaceEmpty'})
export class ReplaceEmptyPipe implements PipeTransform {    
    transform(value, args:string[]) : string {
        let result;

        (value == '' || value == null) ? result = '...' : result = value;

        return result;
    }
}