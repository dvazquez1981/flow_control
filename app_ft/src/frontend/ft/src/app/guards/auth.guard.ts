import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root' // Esto lo registra automáticamente en DI
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');

    if (token) {
      return true; // Permite entrar a la ruta
    } else {
      this.router.navigate(['/login']); // Redirige al login
      return false;
    }
  }
}
