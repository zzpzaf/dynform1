import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ItemsFormFieldsService } from '../items-form-fields.service';


@Component({
  selector: 'app-get-data',
  templateUrl: './get-data.component.html',
  styleUrls: ['./get-data.component.scss'],
})
export class GetDataComponent {

  fornCardTitle: string = 'My Demo Form';
  demoFormGroup!: FormGroup;
  input1Label: string = 'Item Id';
  input1Placeholder: string = 'Input Id here';
  input1ControlNane: string = 'itemId';
  submitButtomText: string = 'Get it';

  constructor(
    private formBuilder: FormBuilder,
    private itemFormFieldsService: ItemsFormFieldsService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.demoFormGroup.valueChanges.subscribe(val => {
      const id = this.demoFormGroup.get(this.input1ControlNane)?.value;
      if (id == undefined || id == null || id == '' || id <= 0) return;
      this.itemFormFieldsService.setItemId(id!);
    });
  }

  initializeForm(): void {
    const fbGroup = this.formBuilder.group({});
    fbGroup.addControl(this.input1ControlNane, new FormControl(''));
    this.demoFormGroup = fbGroup;
  }

  // onFormSubmit(event: Event): void {
  //   const id = this.demoFormGroup.get(this.input1ControlNane)?.value;
  //   if (id == undefined || id == null || id == '' || id <= 0) return;
  //   this.itemFormFieldsService.setItemId(id!);
  // }
  
}
