import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

@Component({
  selector: 'app-response-viewer',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    NgxJsonViewerModule
  ],
  templateUrl: './response-viewer.html',
  styleUrls: ['./response-viewer.scss']
})
export class ResponseViewer implements OnChanges {
  @Input() response: HttpResponse<any> | null = null;
  headerKeys: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['response'] && this.response) {
      this.headerKeys = this.response.headers.keys();
    }
  }

  get statusClass(): string {
    if (!this.response) {
      return '';
    }
    if (this.response.status >= 200 && this.response.status < 300) {
      return 'status-success';
    }
    if (this.response.status >= 400 && this.response.status < 600) {
      return 'status-error';
    }
    return '';
  }
}