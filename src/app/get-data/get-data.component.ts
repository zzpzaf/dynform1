import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DataService } from '../data.service';
import { IItem } from '../dataObjects/iitem';
import { ChangeService } from '../change.service';
import { Subscription } from 'rxjs';
import { ICategory } from '../dataObjects/icatecory';

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

  private itemChangeSubscription!: Subscription;
  private categoriesUpdatedSubscription!: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private itemsDataServise: DataService,
    private itemFormFieldService: ChangeService
  ) {}

  ngOnInit(): void {
    this.updateCategories();
    this.initializeForm();
  }

  initializeForm(): void {
    const fbGroup = this.formBuilder.group({});
    fbGroup.addControl(this.input1ControlNane, new FormControl(''));
    this.demoFormGroup = fbGroup;
  }

  onFormSubmit(event: Event): void {
    const id = this.demoFormGroup.get(this.input1ControlNane)?.value;
    if (id == undefined || id == null || id == '' || id <= 0) {
      return;
    } else {
      this.updateItem(id);
    }

    // Avoid re-subscribing again and again
    // So, if a subscription is already active, unsubscribe it
    this.unSubscribe();

  }

  updateItem(id: number) {
    this.itemsDataServise.getItems().subscribe((items: IItem[]) => {
      const item = items.find((item: IItem) => item['itemId'] === id);
      this.itemFormFieldService.setItem(item!);
      console.log('>===>> get-data - updateItem() - item', item);
    });
  }

  updateCategories() {
    this.itemsDataServise
      .getCategories()
      .subscribe((categories: ICategory[]) => {
        this.itemFormFieldService.setCategories(categories);
      });
  }

  ngOnDestroy() {
    this.unSubscribe();
  }

  unSubscribe() {
    if (!!this.itemChangeSubscription)
      this.itemChangeSubscription.unsubscribe();
    if (!!this.categoriesUpdatedSubscription)
      this.categoriesUpdatedSubscription.unsubscribe();
  }
}
