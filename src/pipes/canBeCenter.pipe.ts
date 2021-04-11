import { PipeTransform, Pipe } from '@angular/core';

@Pipe({name: 'canBeCenter'})
export class CanBeCenterPipe implements PipeTransform {    
    transform(value, args:string[]) : boolean {
        let result, canBeCenter;

        (value == '' || value == null) ? result = '...' : result = value;
        (result.length > 4) ? canBeCenter = false : canBeCenter = true;

        return canBeCenter;
    }
}