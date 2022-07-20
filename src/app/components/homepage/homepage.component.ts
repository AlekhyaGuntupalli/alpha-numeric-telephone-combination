import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TelephoneService } from 'src/app/sevices/telephone.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  generatedNumbers: string[];
  totalCount = 0;
  phoneForm: FormGroup;
  currentPage = 0;
  totalPages = 0;
  isGenerated= false;

  constructor(private fb: FormBuilder,
              private telephoneService: TelephoneService) {
    this.createForm();
  }

  ngOnInit() {
    this.generatedNumbers = [];
    this.onChanges();
  }
  
  createForm() {
    this.phoneForm = this.fb.group( {
        phoneNum: [null, Validators.pattern]
    });
  }

  onGenerate() {
    if (!this.phoneForm.get('phoneNum').errors && !this.phoneForm.pristine) {
      this.currentPage = 1;
      this.generatedNumbers = this.telephoneService.getPage(this.phoneForm.get('phoneNum').value, 10, this.currentPage );
      this.isGenerated = true;
      this.totalPages = Math.ceil(this.totalCount / 10);
    }
  }

  onNextPage(page: number) {
    this.currentPage = page;
    this.generatedNumbers = this.telephoneService.getPage(this.phoneForm.get('phoneNum').value, 10, page );
  }

  get phoneNum() {
    return this.phoneForm.get('phoneNum');
  }
  onChanges(): void {
    this.phoneForm.get('phoneNum').valueChanges.subscribe((val) => {
        this.totalCount = (!this.phoneForm.get('phoneNum').errors
                           && this.phoneForm.get('phoneNum').value !== ''
                           && !this.phoneForm.pristine) ? this.telephoneService.getCount(this.phoneForm.get('phoneNum').value) : 0;
        this.totalPages = Math.ceil(this.totalCount / 10);
        this.generatedNumbers = [];
        this.isGenerated = false;
    });
  }

}
