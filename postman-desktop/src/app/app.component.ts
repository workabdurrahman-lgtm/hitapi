import { Component, ViewChild } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { RequestBuilder } from './components/request-builder/request-builder.component';
import { ResponseViewer } from './components/response-viewer/response-viewer.component';
import { HistoryPanel, HistoryItem } from './components/history-panel/history-panel.component';
import { HttpResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    NgxJsonViewerModule,
    RequestBuilder,
    ResponseViewer,
    HistoryPanel
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  @ViewChild('requestBuilder') requestBuilder!: RequestBuilder;
  @ViewChild(HistoryPanel) historyPanel!: HistoryPanel;
  title = 'postman-desktop';
  currentResponse: HttpResponse<any> | null = null;

  onResponseReceived(response: HttpResponse<any>): void {
    this.currentResponse = response;
  }

  loadRequestFromHistory(item: HistoryItem): void {
    this.requestBuilder.requestForm.patchValue({
      method: item.method,
      url: item.url,
      body: item.body ? JSON.stringify(item.body, null, 2) : ''
    });

    const paramsArray = this.requestBuilder.params;
    paramsArray.clear();
    item.params.forEach(p => paramsArray.push(this.requestBuilder.fb.group(p)));

    const headersArray = this.requestBuilder.headers;
    headersArray.clear();
    item.headers.forEach(h => headersArray.push(this.requestBuilder.fb.group(h)));
  }
}