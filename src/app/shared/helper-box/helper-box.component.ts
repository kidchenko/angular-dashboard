import { Component, OnInit, Input, ChangeDetectorRef, OnDestroy, OnChanges, EventEmitter, Output } from '@angular/core';
import { IDevice, IPin, ILocation, IWidget, AppState, IWidgetForm } from '../../shared/Definitions';
import { CommunicateService } from '../../communicate.service';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-helper-box',
  templateUrl: './helper-box.component.html',
  styleUrls: ['./helper-box.component.scss']
})
export class HelperBoxComponent implements OnInit, OnDestroy, OnChanges {

  @Input() public device: IDevice;
  @Input() public pin: IPin;
  @Output() onFocusLost: EventEmitter<any> = new EventEmitter();

  public locations: Array<ILocation>;

  public form: IWidgetForm = {
    name: '',
    location: ''
  };
  constructor (public chRef: ChangeDetectorRef, private store: Store<AppState>, private communications: CommunicateService) {
    // Initialize private variables
  }

  ngOnInit() {
    this.store.select('locations').subscribe(collection => {
      this.locations = (collection as Array<ILocation>);
    });
  }

  ngOnDestroy () {
    this.chRef.detach();
  }

  findLocationByName (name: string): ILocation {
    return this.locations.find(x => x.name === name);
  }

  async ngOnChanges(changes: any) {
    const widget = (await this.communications.findWidget(this.device, this.pin) as IWidget);
    if (!widget) {
      return this.resetForm();
    }
    this.form.name = widget.name;
    if (widget.location) {
      this.form.location = widget.location.name;
    }
  }

  createWidgetObject(): IWidget {
    return {
      device: this.device,
      pin: this.pin,
      name: this.form.name,
      location: this.findLocationByName(this.form.location)
    };
  }

  submitForm () {
    if (!this.device || !this.pin) {
      return void 0;
    }
    const args = this.createWidgetObject();
    this.communications.createWidgets(args);
  }


  describeDevice( device: IDevice) {
    return `This device has ${this.countInputPins(device)} inputs, and ${this.countOutputPins(device)} outputs.`;
  }

  countInputPins (device: IDevice) {
    return device.pins.filter(pin => pin.type === 'input').length;
  }

  countOutputPins (device: IDevice) {
    return device.pins.filter(pin => pin.type === 'output').length;
  }

  unfocus () {
    this.onFocusLost.emit();
  }

  resetForm () {
    this.form.name = '';
    this.form.location = '';
  }

  onPlaceChange (value) {
    this.form.location = value;
  }

  onWidgetNameInputChange (value) {
    this.form.name = value;
  }


}
