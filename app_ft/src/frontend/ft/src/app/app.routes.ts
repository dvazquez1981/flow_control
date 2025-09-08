import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'listado-dispositivos',
    pathMatch: 'full'   
  },
  
  {
    path: 'listado-dispositivos',
    loadComponent: () => import('./listado-dispositivos/listado-dispositivos.page').then(m => m.ListadoDispositivosPage),
    canActivate: [AuthGuard] 
  },
  {
    path: 'dispositivo/:dispositivoId',
    loadComponent: () => import('./dispositivo/dispositivo.page').then(m => m.DispositivoPage),
    // Protege la ruta
      canActivate: [AuthGuard] 
  },
  {
    path: 'medicion/dispositivo/:dispositivoId',
    loadComponent: () => import('./medicion/medicion.page').then(m => m.MedicionPage),
    // Protege la ruta
      canActivate: [AuthGuard] 
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
];


