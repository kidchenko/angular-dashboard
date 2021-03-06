import { EventEmitter,  Output, Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-forms-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent implements OnInit {

  @Input() name: string;
  @Input() icon: string;
  @Input() placeholder: string;
  @Input() value: any;
  @Output() onChange: EventEmitter<any> = new EventEmitter();
  constructor() { }

  onInputChange (e) {
    this.onChange.emit(e.target.value);
  }
  ngOnInit() {
  }

}
