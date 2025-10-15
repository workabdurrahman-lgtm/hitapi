import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { HttpService } from '../../services/http.service';
import { HistoryPanel } from '../history-panel/history-panel.component';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-request-builder',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule
  ],
  templateUrl: './request-builder.html',
  styleUrls: ['./request-builder.scss']
})
export class RequestBuilder implements OnInit {
  @Input() historyPanel!: HistoryPanel;
  @Output() responseReceived = new EventEmitter<HttpResponse<any>>();
  requestForm!: FormGroup;
  methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

  constructor(public fb: FormBuilder, private httpService: HttpService) {}

  ngOnInit(): void {
    this.requestForm = this.fb.group({
      method: ['GET', Validators.required],
      url: ['', Validators.required],
      params: this.fb.array([]),
      headers: this.fb.array([]),
      body: ['']
    });
  }

  get params(): FormArray {
    return this.requestForm.get('params') as FormArray;
  }

  get headers(): FormArray {
    return this.requestForm.get('headers') as FormArray;
  }

  addParam(): void {
    this.params.push(this.fb.group({ key: [''], value: [''] }));
  }

  removeParam(index: number): void {
    this.params.removeAt(index);
  }

  addHeader(): void {
    this.headers.push(this.fb.group({ key: [''], value: [''] }));
  }

  removeHeader(index: number): void {
    this.headers.removeAt(index);
  }

  sendRequest(): void {
    if (this.requestForm.valid) {
      const { method, url, params, headers, body } = this.requestForm.value;
      const requestOptions = {
        params: this.arrayToObject(params),
        headers: this.arrayToObject(headers),
        body: body ? JSON.parse(body) : null
      };

      this.historyPanel.addRequest({ method, url, params, headers, body: body ? JSON.parse(body) : null });
      this.httpService.makeRequest(method, url, requestOptions)
        .subscribe((response: HttpResponse<any>) => {
          this.responseReceived.emit(response);
        });
    }
  }

  private arrayToObject(arr: { key: string, value: string }[]): { [key: string]: string } {
    return arr.reduce((acc, item) => {
      if (item.key) {
        acc[item.key] = item.value;
      }
      return acc;
    }, {} as { [key: string]: string });
  }
}