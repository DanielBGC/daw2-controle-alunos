import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar'
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Aluno } from '../components/aluno/aluno.model';
import { ApiUrl } from 'src/app/constants';

@Injectable({
  providedIn: 'root'
})

export class AlunoService {
  constructor(
    private snackBar  : MatSnackBar,
    private http      : HttpClient,
    private toastr    : ToastrService,
    ) { }

  showMessage(msg: string, isError: boolean = false): void {
    this.snackBar.open(msg, "", {
      duration: 2500,
      horizontalPosition: "right",
      verticalPosition: "top",
      panelClass: isError  ? ["msg-error"] : ["msg-success"]
    })
  }

  /* USANDO ASYNC/AWAIT FETCH */

  async buscarAlunos() {
    const token = localStorage.getItem('token');

    const fetchOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': token != null ? token : null
      }
    }
  
    const responseRaw = await fetch(ApiUrl + "/aluno", fetchOptions)

    if(responseRaw.status == 204) {
      return({alunos: [], info: 'Ainda não existem alunos cadastrados'})
    } else {
      const response = await responseRaw.json()
      return ({alunos: response});
    }

  }

  async findById(id) {
    const token = localStorage.getItem('token');

    const fetchOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': token != null ? token : null
      }
    }
  
    const responseRaw = await fetch(ApiUrl + "/aluno/" + id, fetchOptions)

    const response = await responseRaw.json()
    return response;
  }

  async create(obj) {
    const token = localStorage.getItem('token');

    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': token != null ? token : null
      },
      body: JSON.stringify(obj)
    }
  
    const responseRaw = await fetch(ApiUrl + "/aluno", fetchOptions)

    const response = await responseRaw.json()
    return response;

  }

  async update(obj) {
    const token = localStorage.getItem('token');

    const fetchOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': token != null ? token : null
      },
      body: JSON.stringify(obj)
    }
  
    const responseRaw = await fetch(ApiUrl + "/aluno", fetchOptions)

    const response = await responseRaw.json()
    return response;

  }

  async deleteById(id) {
    const token = localStorage.getItem('token');

    const fetchOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': token != null ? token : null
      },
      body: JSON.stringify({id: id})
    }
  
    const responseRaw = await fetch(ApiUrl + "/aluno", fetchOptions)

    const response = await responseRaw.json()
    return response;

  }

  async getHistoricosByAlunoId(id) {
    const token = localStorage.getItem('token');

    const fetchOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': token != null ? token : null
      }
    }
  
    const responseRaw = await fetch(ApiUrl + "/historico/aluno/" + id, fetchOptions)

    if(responseRaw.status == 204) {
      return({historicos: [], info: 'Ainda não existem históricos cadastrados'})
    } else {
      const response = await responseRaw.json()
      return ({historicos: response});
    }
  }











  /* USANDO HTTP */


  handleError(error: any): Observable<any> {
    console.log(error)
    this.showMessage("Erro", true);
    return EMPTY
  }

  read(): Observable<Aluno[]> {
    return this.http.get<Aluno[]>(ApiUrl + '/alunos').pipe(
      map(obj => obj),
      catchError(error => this.handleError(error))
    )
  }

  readById(id: number): Observable<Aluno> {
    const url = ApiUrl + '/alunos/' + id
    return this.http.get<Aluno>(url).pipe(
      map(obj => obj),
      catchError(error => this.handleError(error))
    )
  }

  delete(id: number): Observable<Aluno> {
    const url = ApiUrl + '/alunos/' + id
    return this.http.delete<Aluno>(url).pipe(
      map(obj => obj),
      catchError(error => this.handleError(error))
    )
  }



  /* USANDO PROMISES */

  async get(url: any) {
    var response;
    await this.getRequest(url).then(res => {
        response = res;
    });

    return response;
  }

  async deleteObject(url: any, objectToDeactivate: Aluno) {
    return new Promise(async (resolve, reject) => {
        let body: any = {
            "nome": objectToDeactivate.nome,
            "id": objectToDeactivate.id
        };

        await this.deleteRequest(url, body).then(res => {
            resolve(res);
        });
    });
  }

  async insertObject(url: any, objectToInsert: Aluno) {
      return new Promise(async (resolve, reject) => {
          await this.postRequest(url, objectToInsert).then(res => {
              resolve(res);
          });
      });
  }

  async updateObject(url: any, objectToUpdate: Aluno) {
      return new Promise(async (resolve, reject) => {
          await this.putRequest(url, objectToUpdate).then(res => {
              resolve(res);
          });
      });
  }

  public async getRequest(url: any) {
    return new Promise((resolve, reject) => {
        this.http.get(url).subscribe(res => {
            resolve(res);
        }, err => {
            resolve(err)
        })
    })
  } 

  async postRequest(url: any, body: any) {
    return new Promise((resolve, reject) => {
        this.http.post(url, body).subscribe(res => {
            resolve(res);
        }, err => {
            resolve(err)
        })
    })
  }

  async putRequest(url: any, body: any) {
      return new Promise((resolve, reject) => {
          this.http.put(url, body).subscribe(res => {
              resolve(res);
          }, err => {
              resolve(err)
          })
      })
  }

  public async deleteRequest(url: any, body: any) {
    return new Promise((resolve, reject) => {
        this.http.request('delete', url, { body: body}).subscribe(res => {
            resolve(res);
        }, err => {
            resolve(err)
        })
    })
  }
}
