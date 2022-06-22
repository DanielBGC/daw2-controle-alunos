import { AppComponent } from './app.component';
import { routes } from './app-routing.module';


// MÓDULOS ANGULAR
import { CommonModule } from '@angular/common';
import { HttpClientModule } from "@angular/common/http";
import localePt from '@angular/common/locales/pt'
import { FormsModule } from "@angular/forms"
import { registerLocaleData } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; 


// COMPONENTES ANGULAR MATERIAL 
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort'
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule} from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule} from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker'
import { ToastrModule } from 'ngx-toastr';

// import { MatMomentDateModule } from "@angular/material-moment-adapter"

// COMPONENTES DE TERCEIROS
import { NgSelectModule } from '@ng-select/ng-select'  ;
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// DIRETIVAS
import { RedDirective } from './directives/red.directive';

// COMPONENTES
import { HeaderComponent      } from './components/template/header/header.component';
import { FooterComponent      } from './components/template/footer/footer.component';
import { NavComponent         } from './components/template/nav/nav.component'
import { TurmaComponent       } from './components/turma/turma.component';
import { AlunoComponent       } from './components/aluno/aluno-read/aluno.component';
import { ComboboxComponent    } from './components/combobox/combobox.component';

// VIEWS
import { LoginComponent } from './views/authentication/login/login.component';
import { RegisterComponent } from './views/authentication/register/register.component';
import { HomeComponent } from './views/home/home.component';
import { BackgroundComponent } from './views/background/blank.component'


registerLocaleData(localePt);


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    NavComponent,
    HomeComponent,
    RedDirective,
    TurmaComponent,
    AlunoComponent,
    ComboboxComponent,
    LoginComponent,
    RegisterComponent,
    BackgroundComponent
  ],
  imports: [
    // AppRoutingModule,
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),

    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    NgSelectModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    NgxMaterialTimepickerModule,
    NgbModule,
    ToastrModule.forRoot(),
  ],
  providers: [{
    provide: LOCALE_ID,
    useValue: 'pt-BR'
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
