import { Component, OnInit } from '@angular/core';
import {
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormsModule,
  AbstractControl,
  FormGroupDirective,
  NgForm
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ItaliaDateService } from '../service/italia-date.service';
import { EmailService } from '../service/email.service';
import { Regioni, Districs } from '../models/italia.model';
// rxjs
import {
  map,
  startWith,
  switchMap,
  filter,
  debounceTime
} from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { Observable } from 'rxjs/Observable';

import { HttpClient, HttpClientModule } from '@angular/common/http';


// validators
import { Customvalidators } from '../service/emailValidator';


// test
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-stepper-form',
  templateUrl: './stepper-form.component.html',
  styleUrls: ['./stepper-form.component.css']
})
export class StepperFormComponent implements OnInit {
  regions: Regioni;
  districs: Districs;

  // id of districs in material select
  selectedId: string;
  selectedProv: string;
  selectedMun: string;
  // FormGroup Model
  personalData: FormGroup;
  residenceData: FormGroup;
  contactsData: FormGroup;
  // genders for radio button
  genders = ['Uomo', 'Donna'];
  // value form radio button
  myradio: string[] = [];
  // mat select filtered Districs and Municipality
  filteredDistricts: any;
  filteredMunicipality: any;
  // date picker minDate and maxDate and start date
  minDate = new Date(1920, 0, 1);
  maxDate = new Date(2020, 0, 1);
  startDate = new Date(1990, 0, 1);
  defaultDate = new FormControl(new Date(2017, 0, 1));

  email: AbstractControl;
  matcher = new MyErrorStateMatcher();
  // formControl districs select

  districsControl: FormControl = new FormControl('', [Validators.required]);
  regionsControl: FormControl = new FormControl('', [Validators.required]);
 municipalityControl: FormControl = new FormControl('');

  constructor(
    private fb: FormBuilder,
    private italiaDateService: ItaliaDateService,
    private emailService: EmailService,
    private http: HttpClient
  ) {



    this.personalData = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      date: [ // new Date(2017, 0, 1),
       '', Validators.required]
    });

    // this.residenceData = new FormGroup({
    //   districsControl: new FormControl('', [Validators.required]),
    //   regionsControl: new FormControl('', [Validators.required]),
    //   municipalityControl: new FormControl(''),
    //   street: new FormControl(''),
    //   cap: new FormControl('')
    // });

    this.contactsData = this.fb.group({
      email: [
        '',
        Validators.email,
        Customvalidators.checkDuplicateEmail(this.emailService)
      ],
      number: ['', [Validators.required, Validators.pattern('[0-9]*')]]
    });
  }

  ngOnInit() {
    this.italiaDateService.getRegion().subscribe(resp => {
      this.regions = resp;
      console.log(this.regions);
    });

    this.filteredMunicipality = this.regionsControl.valueChanges.pipe(
      startWith(null),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(val => {
        return this.italiaDateService.filterMunicipality(val || '');
      })
    );

    this.filteredDistricts = this.municipalityControl.valueChanges.pipe(
      switchMap(val => {
        return this.italiaDateService.filterDistrict(val || '');
      })
    );
  }

  resetDistricts() {
    this.districsControl.reset();
  }

  onSubmit(value: string) {
    console.log('you submitted value', value);
  }

  // ora uso un service esterno
  // validate(control: AbstractControl) {

  //   return this.http
  //     .get<any>('https://jsonplaceholder.typicode.com/users')
  //     .pipe(
  //       map(
  //         res => res.filter(resp => resp.email === control.value),
  //         map(result => {
  //           return result ? null : { emailTaken: true };
  //         })
  //       ),

  //     );
  // }
}
