import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-error-msg',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-error-msg.component.html',
  styleUrl: './form-error-msg.component.scss',
})
export class FormErrorMsgComponent {
  @Input({ required: true }) form: any;
  @Input() required: string = 'Field is required';
  @Input() pattern: string = 'Please enter valid value';
}
