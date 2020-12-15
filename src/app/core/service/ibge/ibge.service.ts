import { HttpClient } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { Observable } from "rxjs";
import { Cidade } from "../../models/ibge/cidade.model";
import { UF } from "../../models/ibge/uf.model";
import { IbgeConstants } from "../../shared/constants/ibge-constants";


@Injectable()
export class IBGESerice {

  private httpClient: HttpClient;
  private url: string = IbgeConstants.URL_SEVICOS_DADOS_IBGE;

  constructor(injector: Injector) {
    this.httpClient = injector.get(HttpClient);
  }

  getEstados() : Observable<UF | UF[]> {
    return this.httpClient.get<UF | UF[]>(`${this.url}`);
  }

  getCidades(ufId: number) : Observable<Cidade | Cidade[]> {
    return this.httpClient.get<Cidade | Cidade[]>(`${this.url}/${ufId}/municipios`);
  }
}