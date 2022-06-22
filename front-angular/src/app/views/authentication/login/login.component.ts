import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../../services/login.service'
import { ApiUrl } from 'src/app/constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  objLogin = {
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

  async login() {
    let resposta;

    await this.loginService.login2(this.objLogin)
      .then(function (res: any) {
        resposta = res;
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

  async goToRegisterPage() {
    this.router.navigate(["/register"])
  }

}
