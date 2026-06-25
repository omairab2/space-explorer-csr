import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { retry, timeout } from 'rxjs/operators';

import { Apod } from '../../core/models/apod.model';
import { environment } from '../../../environments/environment';

const NASA_APOD_URL = 'https://api.nasa.gov/planetary/apod';
// NASA's APOD endpoint is intermittently slow/503; bound each request and retry transient failures.
const HTTP_TIMEOUT_MS = 5000;
const HTTP_RETRY_COUNT = 2;
const HTTP_RETRY_DELAY_MS = 500;

@Injectable({ providedIn: 'root' })
export class NasaApodService {
  private readonly http = inject(HttpClient);

  /**
   * Fetches `count` random APOD entries.
   * `thumbs=true` makes NASA populate `thumbnail_url` for video entries, so the UI
   * can fall back to it when `media_type === 'video'`.
   */
  getApodList(count: number): Observable<Apod[]> {
    return this.http.get<Apod[]>(this.buildUrl({ count: String(count) })).pipe(
      timeout({ each: HTTP_TIMEOUT_MS }),
      retry({ count: HTTP_RETRY_COUNT, delay: HTTP_RETRY_DELAY_MS }),
    );
  }

  /** Fetches the single APOD entry for a specific `date` (format: YYYY-MM-DD). */
  getApodByDate(date: string): Observable<Apod> {
    return this.http.get<Apod>(this.buildUrl({ date })).pipe(
      timeout({ each: HTTP_TIMEOUT_MS }),
      retry({ count: HTTP_RETRY_COUNT, delay: HTTP_RETRY_DELAY_MS }),
    );
  }

  // CSR app: the browser calls NASA directly with the key from environment (no SSR proxy).
  private buildUrl(query: Record<string, string>): string {
    const params = new URLSearchParams({
      ...query,
      api_key: environment.nasaApiKey,
      thumbs: 'true',
    });
    return `${NASA_APOD_URL}?${params.toString()}`;
  }
}
