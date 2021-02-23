import { PipeTransform, Pipe } from '@angular/core';

@Pipe({name: 'render'})
export class RenderPipe implements PipeTransform {    
    transform(value, args:string[]) : any {
        return Object.keys(value);
    }
}