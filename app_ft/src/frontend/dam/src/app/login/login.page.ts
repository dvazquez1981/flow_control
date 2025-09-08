import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../services/login.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class LoginPage {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: LoginService) {}

  async onLogin() {
    try {
      const result = await this.authService.login(this.username, this.password);
      console.log('Login correcto:', result);
      // acá podés guardar token en storage o navegar
    } catch (err) {
      console.error('Error en login', err);
      this.errorMessage = 'Usuario o contraseña incorrectos';
    }
  }
}
