import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar'
import { ToastrService } from 'ngx-toastr';
import { ApiUrl } from 'src/app/constants';

@Injectable({
  providedIn: 'root'
})

export class TurmaService {
  constructor(
    private snackBar  : MatSnackBar
  ) { }

  showMessage(msg: string, isError: boolean = false): void {
    this.snackBar.open(msg, "", {
      duration: 2500,
      horizontalPosition: "right",
      verticalPosition: "top",
      panelClass: isError  ? ["msg-error"] : ["msg-success"]
    })
  }

  async getTurmas() {
    const token = localStorage.getItem('token');

    const fetchOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-access-token': token != null ? token : null
      }
    }
  
    const responseRaw = await fetch(ApiUrl + "/turma", fetchOptions)

    if(responseRaw.status == 204) {
      return({turmas: [], info: 'Ainda não existem turmas cadastradas'})
    } else {
      const response = await responseRaw.json()
      return ({turmas: response});
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
  
    const responseRaw = await fetch(ApiUrl + "/turma/" + id, fetchOptions)

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
  
    const responseRaw = await fetch(ApiUrl + "/turma", fetchOptions)

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
  
    const responseRaw = await fetch(ApiUrl + "/turma", fetchOptions)

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
  
    const responseRaw = await fetch(ApiUrl + "/turma", fetchOptions)

    const response = await responseRaw.json()
    return response;

  }
}
