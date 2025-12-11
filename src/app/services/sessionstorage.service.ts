import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionstorageService {
  setItem(key: string, data: any): void {
    try {
      const serializedData = JSON.stringify(data);
      console.log('serialized Data:', serializedData);
      sessionStorage.setItem(key, serializedData);
    } catch (e) {
      console.error('Session storage error:', e);
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const serializedData = sessionStorage.getItem(key);
      if (serializedData == null) return null;
      return JSON.parse(serializedData) as T;
    } catch (e) {
      console.error('getItem error:', e);
      return null;
    }
  }

  removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  clearAllItems(): void {
    sessionStorage.clear();
  }
}
