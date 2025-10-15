import { Injectable } from '@angular/core';

// Declare the electronAPI to be available in the window object
declare global {
  interface Window {
    electronAPI: {
      getStorage: () => Promise<any>;
      setStorage: (data: any) => Promise<{ success: boolean; error?: string }>;
    };
  }
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  async get(key: string): Promise<any> {
    const data = await window.electronAPI.getStorage();
    return data[key];
  }

  async set(key: string, value: any): Promise<void> {
    const data = await window.electronAPI.getStorage();
    data[key] = value;
    await window.electronAPI.setStorage(data);
  }
}