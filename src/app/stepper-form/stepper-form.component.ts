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

// chip e keboard event
import {MatChipInputEvent} from '@angular/material';
import {ENTER, COMMA} from '@angular/cdk/keycodes';

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

// actions for chips
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
// inserimento frutta nei chips

  fruits = [
  ];
   // Enter, comma
   separatorKeysCodes = [ENTER, COMMA];

   add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.fruits.push({ name: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(fruit: any): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }
//   districsControl: FormControl = new FormControl('', [Validators.required]);
//   regionsControl: FormControl = new FormControl('', [Validators.required]);
//  municipalityControl: FormControl = new FormControl('');



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

    this.residenceData = new FormGroup({
      districsControl: new FormControl({value: '' , disabled: true}, [Validators.required]),
      regionsControl: new FormControl('', [Validators.required]),
      municipalityControl: new FormControl({value: '' , disabled: true}, [Validators.required]),
      street: new FormControl('', Validators.required ),
      cap: new FormControl('', [Validators.required, Validators.pattern('[0-9]*') ])
    });

    this.contactsData = this.fb.group({
      email: [
        '',
        Validators.email,
        Customvalidators.checkDuplicateEmail(this.emailService)
      ],
      number: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      feedback: ['']
    });
  }

  ngOnInit() {
    this.italiaDateService.getRegion().subscribe(resp => {
      this.regions = resp;
      console.log(this.regions);
    });

    this.filteredMunicipality = this.residenceData.controls['regionsControl'].valueChanges.pipe(
      startWith(null),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(val => {
        return this.italiaDateService.filterMunicipality(val || '');
      })
    );

    this.filteredDistricts = this.residenceData.controls['municipalityControl'].valueChanges.pipe(
      switchMap(val => {
        return this.italiaDateService.filterDistrict(val || '');
      })
    );
  }

  resetDistricts() {
    this.residenceData.controls['districsControl'].reset();
    this.residenceData.controls['districsControl'].enable();
    this.residenceData.controls['municipalityControl'].enable();
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
