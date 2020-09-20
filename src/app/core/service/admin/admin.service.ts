import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Admin } from '../../models/admin/admin.model';
import { ApiService } from '../api.service';

@Injectable()
export class AdminService extends ApiService<Admin> {

  private url: string = '/admin';

  getAdmins(): Observable<Admin | Admin[]> {
    return this.get(this.url);
  }

  saveAdmin(administrator: Admin): Observable<Admin> {
    return this.post(`${this.url}/register`, administrator);
  }

  updateAdmin(administrator: Admin): Observable<Admin> {
    return this.patch(`${this.url}/${administrator['id']}`, administrator);
  }

  removeAdmin(administratorId: number): Observable<Admin> {
    return this.delete(`${this.url}/${administratorId}`);
  }
}