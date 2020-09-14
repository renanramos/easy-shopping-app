import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { defer, NEVER } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { finalize, share } from 'rxjs/operators';
import { LoaderComponent } from '../components/loader/loader.component';

@Injectable({
  providedIn: 'root'
})
export class GlobalLoaderService {

  private overlayRef: OverlayRef = undefined;
  isLoading = new Subject<boolean>();

  constructor(private overlay: Overlay) { }

  public readonly loading$ = defer(() => {
    this.showLoadingComponent();
    return NEVER.pipe(
      finalize(() => {
        this.hideLoadingComponent();
      })
    );
  }).pipe(share());


  showLoadingComponent() {
    Promise.resolve(null).then(() => {
      this.overlayRef = this.overlay.create({
        positionStrategy: this.overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically(),
        hasBackdrop: true,
      });
      this.overlayRef.attach(new ComponentPortal(LoaderComponent))
    })
  }

  hideLoadingComponent() {
    this.overlayRef &&
     this.overlayRef.detach();
    this.overlayRef = undefined;
  }
}
