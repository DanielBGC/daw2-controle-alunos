import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../../services/login.service'
import { ApiUrl } from 'src/app/constants';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  objRegister = {
    nome : '',
    email: '',
    senha: ''
  }

  private isAuthenticated: boolean = false;

  constructor(
    private router: Router,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
  }

  async register() {
    let resposta;

    await this.loginService.register(this.objRegister)
      .then(function (res: any) {
        resposta = res;
        console.log(resposta)
    })

    this.isAuthenticated = resposta.auth;
    
    if(this.isAuthenticated == true) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("token", resposta.token);
      this.loginService.showMessage(resposta.info, false)
      this.router.navigate(["/home"])
    } else {
      this.loginService.showMessage(resposta.info, true)
      console.log(resposta.info)
    }
  }

  
  async goToLoginPage() {
    this.router.navigate(["/login"])
  }

}
