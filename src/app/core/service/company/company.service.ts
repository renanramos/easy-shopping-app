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
    return this.post(`${this.url}`, company);
  }

  getCompanies(companyId?: number, pageNumber?: number, filterByName?: string, noLimitSize?: boolean): Observable<Company | Company[]> {

    let filterString = '';

    if (pageNumber) {
      filterString = `?pageNumber=${pageNumber}`;
    }

    if (noLimitSize) {
      filterString = '';
      filterString += `?pageSize=-1`;
    }

    if (filterByName) {
      filterString += filterString ? `&name=${filterByName}` : `?name=${filterByName}`;
    }

    return this.get(`${this.url}${companyId ? companyId : filterString}`);
  }

  getCompanyByTokenId(tokenId: string): Observable<Company | Company[]> {
    return this.get(`${this.url}/${tokenId}`);
  }

  updateCompany(company: Company, tokenId: string): Observable<Company> {
    return this.patch(`${this.url}/${tokenId}`, company);
  }

  removeCompany(companyId: number): Observable<any> {
    return this.delete(`${this.url}/${companyId}`);
  }
}
