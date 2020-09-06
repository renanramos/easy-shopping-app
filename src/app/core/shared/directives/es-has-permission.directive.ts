import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { SecurityUserService } from '../../service/auth/security-user.service';

@Directive({
  selector: '[esHasPermission]'
})
export class EsHasPermissionDirective implements OnInit {

  permission: string;

  @Input() set esHasPermission(permission: string) {
    this.permission = permission;
  }

  constructor(private elementRef: ElementRef,
    private securityUserService: SecurityUserService) {
   }

  ngOnInit() {
    const permissions: string[] = this.permission.split(',');
    const userRole = this.securityUserService.userLoggedRole;
    
    let hasPermission = permissions.some(permission => permission.trim() == userRole);
    
    if (!hasPermission) {
      this.elementRef.nativeElement.style.display = 'none';
    }
  }
}
