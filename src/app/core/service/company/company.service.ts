import { Injectable, Inject, Injector } from '@angular/core';
import { ApiService } from '../api.service';
import { Company } from '../../models/registration/company.model';
import { Observable } from 'rxjs';

@Injectable()
export class CompanyService extends ApiService<Company>{

  private url: string = '/companies';

  constructor(inject: Injector) {
    super(inject);
  }

  saveCompany(company: Company): Observable<Company> {
    return this.post(`${this.url}/register`, company);
  }

  getCompanies(companyId?: number, noLimitSize?: boolean): Observable<Company | Company[]> {

    let filterString = '';

    if (noLimitSize) {
      filterString += `?pageSize=-1`;
    }

    return this.get(`${this.url}${companyId ? companyId : filterString}`);
  }

  updateCompany(company: Company): Observable<Company> {
    return this.patch(`${this.url}/${company['id']}`, company);
  }

  removeCompany(companyId: number): Observable<any> {
    return this.delete(`${this.url}/${companyId}`);
  }
}
