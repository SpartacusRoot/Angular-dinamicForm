import { Component, OnInit } from '@angular/core';
import {
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormsModule,
  AbstractControl
} from '@angular/forms';

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
// import { Customvalidators } from '../service/emailValidator';
import { HttpClient, HttpClientModule } from '@angular/common/http';


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
  // mat select filtered Districs and Municipality
  filteredDistricts: any;
  filteredMunicipality: any;
  // date picker minDate and maxDate and start date
  minDate = new Date(1920, 0, 1);
  maxDate = new Date(2020, 0, 1);
  startDate = new Date(1990, 0, 1);
  defaultDate = new FormControl(new Date(2017, 0, 1));

  email: AbstractControl;

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
    this.personalData = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      gender: new FormControl(this.genders, Validators.required),
      date: new FormControl(new Date(2017, 0, 1))
    });

    this.residenceData = new FormGroup({
      districsControl: new FormControl('', [Validators.required]),
      regionsControl: new FormControl('', [Validators.required]),
      municipalityControl: new FormControl(''),
      street: new FormControl(''),
      cap: new FormControl('')
    });
  }

  ngOnInit() {
    this.contactsData = this.fb.group({
      email: ['', Validators.required, this.validate.bind(this)]
    });

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

  // get email() {
  //   return this.contactsData.get('email');
  // }



  validate(control: AbstractControl) {

    return this.http
      .get<any>('https://jsonplaceholder.typicode.com/users')
      .pipe(
        map(
          res => res.filter(resp => resp.email === control.value),
          map(result => {
            return result ? null : { emailTaken: true };
          })
        ),

      );
  }
}
