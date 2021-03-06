import { Directive, ElementRef, Host, OnInit } from '@angular/core';
import { Dropdown } from './dropdown.directive';

@Directive({selector: '[dropdownMenu]'})
export class DropdownMenu implements OnInit {
  
  constructor(@Host() public dropdown: Dropdown, public el: ElementRef) {}
  
  ngOnInit(): void {
    this.dropdown.dropDownMenu = this;
  }
}