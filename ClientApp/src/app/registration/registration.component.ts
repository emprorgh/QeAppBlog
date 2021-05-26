import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  public studentRegistrationForm: FormGroup;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
  }

}
