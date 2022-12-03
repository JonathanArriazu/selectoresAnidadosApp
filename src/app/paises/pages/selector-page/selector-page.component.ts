import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { switchMap, tap } from 'rxjs/operators'

import { PaisesService } from '../../services/paises.service';
import { PaisSmall } from '../../interfaces/paises.interface';


@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html'
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required]
  });

  //Llenar selectores
  regiones: string[] = [];
  paises: PaisSmall[] = [];
  fronteras: string[] = [];

  constructor( private fb: FormBuilder, 
               private paisesService: PaisesService) { }

  //Cuando queremos traer data de algun servicio o informacion que se conecta a algun API, se hace en el ngOnInit           
  ngOnInit(): void {
    
    this.regiones = this.paisesService.regiones; //Indicamos que el regiones de la linea de arriba es igual al regiones que traigo desde services

    //CUANDO CAMBIE LA REGION:
    /* this.miFormulario.get('region')?.valueChanges
        .subscribe( region => {
          console.log(region); // obtengo el valor de la region cuando manipulo el select-option
          this.paisesService.getPaisesPorRegion( region ) // ahora hago la petición http definida en el servicio
            .subscribe( paises => {
              this.paises = paises; // guardo los paises que recibo como argumento
            })
        }) */
    
    //CUANDO CAMBIE LA REGION CODIGO MEJORADO:
    this.miFormulario.get('region')?.valueChanges
    //implementamos pipe, el cual me ayuda a transformar el valor que viene del get region valueChanges, tambien disparar
    //otras cosas al usar el SwitchMap, disparar efectos secundarios mediante el tap, mutar la informacion con el map, etc.
          .pipe(
            tap( () => {
              this.miFormulario.get('pais')?.reset('')
            } ),
            //el switchMap recibe el valor del observable, es decir, recibe a region y luego regresa un nuevo observable (nuestro segundo observable de: getPaisesPorRegion)
            switchMap( region => this.paisesService.getPaisesPorRegion( region ) )
            ) 
            .subscribe( paises => { //getPaisesPorRegion regresa el valor de paises
            this.paises = paises;
          })

    //CUANDO CAMBIE EL PAIS
    this.miFormulario.get('pais')?.valueChanges
            .pipe(
              tap( () => {
                this.fronteras = [];
                this.miFormulario.get('frontera')?.reset('')
              }),
              switchMap( codigo => this.paisesService.getPaisPorCodigo(codigo) )//el switchMap obtiene el valor del observable anterio, es decir, obtiene el codigo el cual envia 
            )
            .subscribe( pais => { //pais es lo que me regresa getPaisPorCodigo
              this.fronteras = pais?.borders || []  //Ya que pais puede venir con info o null, entonces si viene null, que entregue un string vacio.
          })

  }

  guardar() {
    console.log(this.miFormulario.value)
  }

}
