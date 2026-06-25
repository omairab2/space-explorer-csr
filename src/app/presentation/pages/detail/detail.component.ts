import { DatePipe, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DomSanitizer, Meta, SafeResourceUrl, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, of, startWith, switchMap, tap } from 'rxjs';

import { Apod } from '../../../core/models/apod.model';
import { NasaApodService } from '../../../infrastructure/services/nasa-apod.service';
import { DetailSkeletonComponent } from '../../components/skeleton/detail-skeleton.component';

const DATE_PARAM = 'date';
const VIDEO_MEDIA_TYPE = 'video';
const META_DESCRIPTION_MAX_LENGTH = 160;

type DetailStatus = 'loading' | 'success' | 'error';

type DetailState =
  | { status: 'loading' }
  | { status: 'success'; apod: Apod }
  | { status: 'error' };

@Component({
  selector: 'app-detail',
  imports: [DatePipe, DetailSkeletonComponent],
  templateUrl: './detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly nasaApodService = inject(NasaApodService);
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly sanitizer = inject(DomSanitizer);

  private readonly date$ = this.route.paramMap.pipe(
    map((params) => params.get(DATE_PARAM) ?? ''),
  );

  protected readonly date = toSignal(this.date$, { initialValue: '' });

  private readonly state = toSignal(
    this.date$.pipe(
      switchMap((date) =>
        date
          ? this.nasaApodService.getApodByDate(date).pipe(
              tap((apod) => this.applyMetaTags(apod)),
              map((apod): DetailState => ({ status: 'success', apod })),
              startWith<DetailState>({ status: 'loading' }),
              catchError(() => of<DetailState>({ status: 'error' })),
            )
          : of<DetailState>({ status: 'loading' }),
      ),
    ),
    { initialValue: { status: 'loading' } satisfies DetailState },
  );

  protected readonly status = computed<DetailStatus>(() => this.state().status);

  protected readonly apod = computed<Apod | null>(() => {
    const current = this.state();
    return current.status === 'success' ? current.apod : null;
  });

  protected readonly isVideo = computed(() => this.apod()?.media_type === VIDEO_MEDIA_TYPE);

  protected readonly videoUrl = computed<SafeResourceUrl | null>(() => {
    const apod = this.apod();
    return apod && apod.media_type === VIDEO_MEDIA_TYPE
      ? this.sanitizer.bypassSecurityTrustResourceUrl(apod.url)
      : null;
  });

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/']);
    }
  }

  private applyMetaTags(apod: Apod): void {
    this.title.setTitle(apod.title);
    this.meta.updateTag({
      name: 'description',
      content: apod.explanation.slice(0, META_DESCRIPTION_MAX_LENGTH),
    });
  }
}
