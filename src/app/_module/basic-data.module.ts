import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// basic data
import { CountriesComponent } from '../custom/activites/basic-data/countries/countries.component';
import { CurrenciesComponent } from '../custom/activites/basic-data/currencies/currencies.component';
import { EmpCategoryComponent } from '../custom/activites/basic-data/emp-category/emp-category.component';
import { OtherCategoriesComponent } from '../custom/activites/basic-data/other-categories/other-categories.component';
import { PaymentMethodComponent } from '../custom/activites/basic-data/payment-method/payment-method.component';
import { PaymentTermsComponent } from '../custom/activites/basic-data/payment-terms/payment-terms.component';

// ant
import { AntModule } from './ant.module';
// mat
import { MatModule } from './mat.module';
// pipes
import { PipesModule } from './pipes.module';
// shared modules and pieps
import { SharedModule } from './shared.module';
// reusable modules
import { ReusableModule } from './reusable.module';


@NgModule({
  declarations: [
    PaymentTermsComponent,
    PaymentMethodComponent,
    EmpCategoryComponent,
    OtherCategoriesComponent,
    CountriesComponent,
    CurrenciesComponent,    
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // ant module
    AntModule,
    // mat
    MatModule,
    // pipes
    PipesModule,
    // shared
    SharedModule, 
    // reusable
    ReusableModule,    
  ],
  exports: [
    PaymentTermsComponent,
    PaymentMethodComponent,
    EmpCategoryComponent,
    OtherCategoriesComponent,
    CountriesComponent,
    CurrenciesComponent,    
  ]
})
export class BasicDataModule { }
