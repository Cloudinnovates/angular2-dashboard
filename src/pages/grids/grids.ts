import { Component, ViewEncapsulation } from 'angular2/core';

@Component({
  selector: 'grids',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'pages/grids/grids.template.html',
  styles: [`
  .grid {
    position: relative;
    display: block;
    margin-bottom: 0.625rem;
    background-color: #fff;
    border: 1px solid #e5e5e5;
  }
  .grid .grid-block {
    padding: 16px 0;
  }
  .center {
    text-align: center;
  }
  .grid .grid-block h6 {
    margin: 10px 0;
    font-size: 14px;
    font-weight: 400;
  }
  `]
})
export class GridsView {}