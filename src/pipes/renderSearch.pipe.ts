import { PipeTransform, Pipe } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({name: 'renderSearch'})
export class RenderSearchPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {}
    
    transform(value, args:string[]) {
        return this.sanitizer.bypassSecurityTrustHtml(value);
    }
}