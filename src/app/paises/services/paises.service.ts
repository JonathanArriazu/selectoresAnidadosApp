import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PaisSmall, Pais } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private baseUrl: string = 'https://restcountries.com/v3.1'

  //Coloco private para que no se pueda modificar por accidente
  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  //Utilizo un getter para poder compartir las regiones
  get regiones(): string[] { 
    return [...this._regiones] //Pero no trabajo sobre ellas directamente, sino que con una copia de ellas
  }

  constructor( private http: HttpClient ) { }

  getPaisesPorRegion( region: string) : Observable<PaisSmall[]>{

    const url: string = `${this.baseUrl}/region/${region}?fields=cca3,name`
    return this.http.get<PaisSmall[]>( url )
  }

  getPaisPorCodigo ( codigo: string ): Observable<Pais | null> {

    if (!codigo) {
      return of(null)
    }

    const url = `${this.baseUrl}/alpha/${codigo}`
    return this.http.get<Pais>(url)

  }
}
