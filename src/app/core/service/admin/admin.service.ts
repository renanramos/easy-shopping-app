import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Admin } from '../../models/admin/admin.model';
import { ApiService } from '../api.service';

@Injectable()
export class AdminService extends ApiService<Admin> {

  private url: string = '/addresses';

  getAdmins(): Observable<Admin | Admin[]> {
    return this.get(this.url);
  }
}