import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
// form module
import {ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule} from '@angular/forms';
// flexbox
import {FlexLayoutModule} from '@angular/flex-layout';

// Angular Material Components
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, ErrorStateMatcher, ShowOnDirtyErrorStateMatcher} from '@angular/material/core';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
// Components
import { StepperFormComponent } from './stepper-form/stepper-form.component';
import { AppComponent } from './app.component';

// service
import { ItaliaDateService } from './service/italia-date.service';
import { EmailService } from './service/email.service';


// validators
import { Customvalidators } from './service/emailValidator';


@NgModule({
  declarations: [
    AppComponent,
    StepperFormComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FlexLayoutModule,
    MatStepperModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule

  ],
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'it-IT'}, ItaliaDateService,  EmailService, Customvalidators,
  {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher}],
  bootstrap: [AppComponent]
})
export class AppModule { }
