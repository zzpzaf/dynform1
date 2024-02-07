import { Injectable } from '@angular/core';
import { IItem } from './dataObjects/iitem';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { ICategory } from './dataObjects/icatecory';
import { ItemsFormFields } from './dataObjects/itemFormFields';
import { IFormField, IFormOptions } from './dataObjects/IFormField';

@Injectable({
  providedIn: 'root'
})
export class ChangeService {

  private itemIdChange$$ = new Subject<IItem>();
  private categories$$ = new Subject<ICategory[]>();
  private formFields: IFormField[] = ItemsFormFields;
  // private formFields$$ = new Subject<IFormField[]>();
  private formFields$$ = new BehaviorSubject<IFormField[]>(this.formFields);
  private categories: ICategory[] = [];





  constructor() { }

  public setItem(item: IItem) {
  //  console.log( '>===>> ChangeService - ' + 'setItemId - '+  'Setting message value in ChangeService: ' + "%j", message ); 
  //  console.log( '>===>> ChangeService - ' + 'setItemId - '+  'Setting message value in ChangeService: ' + JSON.stringify(message) ); 
  this.updateFormFieldsInitialValues(item);
  this.itemIdChange$$.next(item);
  }

  public getItem(): Observable<IItem> {
    // console.log( '>===>> ChangeService - ' + 'getItemId - '+  'Getting message value from ChangeService.');
    return this.itemIdChange$$.asObservable();

  }



  public setCategories(categories: ICategory[]) {
    // console.log( '>===>> ChangeService - ' + 'setCategories - '+  'Setting message value in ChangeService: ' + JSON.stringify(message) );
    this.categories = categories;
    this.updateOptions('itemCategories');
    this.categories$$.next(categories);
  }

  public getCategories(): Observable<ICategory[]> {
    // console.log( '>===>> ChangeService - ' + 'getCategories - '+  'Getting message value from ChangeService.');
    return this.categories$$.asObservable();
  } 

  // public setFormFields(formFields: IFormField[]) {
  //   this.formFields = formFields;
  //   this.formFields$$.next(formFields);
  // }

  public getFormFields(): Observable<IFormField[]> {
    return this.formFields$$.asObservable();
  }



  

  private updateOptions(cotrolName: string) {
    let options: IFormOptions[] = [];
    this.categories.forEach((category: ICategory) => {
      options.push({optionKey: category.categoryId, optionValue: category.categoryName});
    });
    this.formFields.find((field) => field.controlName === cotrolName && field.controlType === 'select')!.options = options;
    this.formFields$$.next(this.formFields);
  }



  private updateFormFieldsInitialValues(item: IItem): void {

    this.formFields.forEach((field) => {
      const dataField = field.dataField;
      if (dataField !== undefined && item.hasOwnProperty(dataField)) {
        
        if (field.options) {
            let initValKeys: any[] = [];
            if (field.controlType === 'select' && field.controlName === 'itemCategories') {
                item.categoryNames.forEach((category: string) => {
                field.options!.forEach((option: IFormOptions) => {
                    if (option.optionValue === category) {
                        option.isOptionSelected = true;
                        initValKeys.push(option.optionKey);
                    }
                  });
                });
            } else if (field.inputType === 'radio') {
                // console.log('>===>> updateFormFieldsInitialValues() - Item Id: ', item.itemId, 'Item Status: ', item.itemStatusId );
                field.options!.forEach((option: IFormOptions) => {
                    if (option.optionKey === item.itemStatusId) {
                        option.isOptionSelected = true;
                    } else {
                        option.isOptionSelected = false;
                    }
                    // console.log('>===>> updateFormFieldsInitialValues() - option.optionKey: ', option.optionKey, 'option.optionValue: ', option.optionValue, 'option.isOptionSelected: ', option.isOptionSelected);    
                });
            }
            field.initialValue = initValKeys;     
            // console.log('>===>> updateFormFieldsInitialValues() - field.initialValue', field.initialValue);
        
        } else {
            field.initialValue = item[dataField];
            if (field.inputType === 'checkbox') {
              // field.initialValue = true;
              console.log('>===>> updateFormFieldsInitialValues() - field.initialValue', field.initialValue);
            }
        }

      }
    });
    this.formFields$$.next(this.formFields);
  }






}
