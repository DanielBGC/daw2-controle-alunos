import { Routes } from '@angular/router'; 

// COMPONENTES
import { HomeComponent      } from "./views/home/home.component"
import { TurmaComponent     } from './components/turma/turma.component';
import { AlunoComponent     } from './components/aluno/aluno-read/aluno.component';

import { LoginComponent         } from './views/authentication/login/login.component';
import { RegisterComponent      } from './views/authentication/register/register.component';
import { BackgroundComponent    } from './views/background/blank.component'
import { NotfoundComponent      } from './views/authentication/404/not-found.component';

let isAuthenticated = localStorage.getItem("isAuthenticated");

console.log(isAuthenticated)

export const routes: Routes = [
  // { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '', redirectTo: isAuthenticated ? '/home' : '/login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: '',
    component: BackgroundComponent,
    children: [
      {
        path: "home",
        component: HomeComponent 
      }, 
      {
        path: "turmas",
        component: TurmaComponent
      },
      {
        path: "alunos",
        component: AlunoComponent
      }
    ]
  },
  {
    path: '404',
    component: NotfoundComponent
  },
  {
    path: '**',
    redirectTo: '/404'
  }
]