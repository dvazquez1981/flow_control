import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class LoginService {

  uri = 'http://localhost:8000/usuario'

  constructor(private _http: HttpClient, private _router: Router) { }

  async login (username: string, password: string) {
    
    console.log(username)
    console.log(password)
    
    let response = await firstValueFrom(this._http.post<any>(      this.uri + '/login', {name: username, password: password}))
      if (response && response.status === 1) 
        {
        localStorage.setItem('token', response.token);
      
        this._router.navigate(['/listado-dispositivos']);
        return true;
      } 
      else 
      {
       console.error('Error en login:', response?.message);
       return false;
      }


  }

  logout () {
    localStorage.removeItem('token')
  }

  public get logIn (): boolean {
    return (localStorage.getItem('token') !== null)
  }
}