import { Directive, ElementRef, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { SecurityUserService } from '../../service/auth/security-user.service';

@Directive({
  selector: '[esHasPermission]'
})
export class EsHasPermissionDirective implements OnInit {

  permission: string;
  
  constructor(private tempEmentRef: TemplateRef<any>,
    private securityUserService: SecurityUserService,
    private viewContainer: ViewContainerRef) {
   }

  @Input() set esHasPermission(permissions: string | string[]) {

    let userLoggedPermission = false;
    if (Array.isArray(permissions)) {
      const hasPermission = (permission) => {
        return this.securityUserService.userLoggedRole === permission;
      }

      userLoggedPermission = permissions.some(hasPermission);
    } else {
      userLoggedPermission = this.securityUserService.userLoggedRole === permissions;
    }

    if (userLoggedPermission) {
      this.viewContainer.createEmbeddedView(this.tempEmentRef);
    } else {
      this.viewContainer.clear();
    }
  }

  ngOnInit() { }
}
