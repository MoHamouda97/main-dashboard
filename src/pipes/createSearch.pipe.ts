import { PipeTransform, Pipe } from '@angular/core';

@Pipe({name: 'createSearch'})
export class CreateSearchPipe implements PipeTransform {
    transform(value, args:string[]) {
        const keys = Object.keys(value);
        let searchItems: any[] = [];

        for (let i = 0; i <= keys.length; i++) {
            searchItems.push(keys[i]);
        }

        searchItems.pop();

        return searchItems;
    }
}