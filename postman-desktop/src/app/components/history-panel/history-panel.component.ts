import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { StorageService } from '../../services/storage.service';

export interface HistoryItem {
  method: string;
  url: string;
  params: { key: string, value: string }[];
  headers: { key:string, value: string }[];
  body: any;
}

@Component({
  selector: 'app-history-panel',
  standalone: true,
  imports: [CommonModule, MatListModule],
  templateUrl: './history-panel.html',
  styleUrls: ['./history-panel.scss']
})
export class HistoryPanel implements OnInit {
  @Output() requestLoaded = new EventEmitter<HistoryItem>();
  history: HistoryItem[] = [];

  constructor(private storageService: StorageService) {}

  async ngOnInit(): Promise<void> {
    this.history = await this.storageService.get('history') || [];
  }

  loadRequest(item: HistoryItem): void {
    this.requestLoaded.emit(item);
  }

  async addRequest(item: HistoryItem): Promise<void> {
    this.history.unshift(item);
    if (this.history.length > 50) {
      this.history.pop();
    }
    await this.storageService.set('history', this.history);
  }
}