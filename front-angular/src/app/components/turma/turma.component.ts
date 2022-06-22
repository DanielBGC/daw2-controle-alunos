import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ComboboxServices } from 'src/app/services/combobox.service';
import { UtilsServices } from '../../services/utils.service';
import { HeaderService } from '../template/header/header.service';
import { TurmaService } from 'src/app/services/turma.service';


@Component({
  selector: 'app-turma',
  templateUrl: './turma.component.html',
  styleUrls: ['./turma.component.css']
})
export class TurmaComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;

  public  objFormFilter   : FormGroup;
  public  objFormRegister : FormGroup;
  public  objFormAulas    : FormArray;

  //VARIÁVEIS
  contentView = 1;

  displayedColumns = ['id', 'nome', 'turma', 'action']

  selectTurmas = [];
  selectedValue: string;

  dataSource = new MatTableDataSource();

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  turmas = []

  turmaUpdate = {
    nome: ''
  }

  turmaDelete = {
    id: '',
    nome: '',
    createdAt: new Date()
  }

  turmasCadastradas = [];

  constructor(
    private headerService   : HeaderService,
    private modalService    : NgbModal, 
    private turmaService    : TurmaService,
    private formBuilder     : FormBuilder,
    private utilServices    : UtilsServices,
    public  comboboxServices: ComboboxServices
  ) { 
    this.headerService.headerData = {
      title: "Turmas",
      icon: "meeting_room",
      routeUrl: "/turmas"
    }

    this.objFormFilter = this.formBuilder.group({ 
        nome : ['']
      , turma: ['']
    })

    this.objFormRegister = this.formBuilder.group({
      nome            : ['', Validators.required]
    })
  }

  async ngOnInit() {
    this.findDataTable();
    this.getTurmasCadastradas();
  }

  async getTurmasCadastradas() {
 
    let res = await this.turmaService.getTurmas();
    
    this.turmasCadastradas = res.turmas.map(turma => {
      return {id: turma.id, text: turma.nome}
    })
  }
  

  async findDataTable() {
 
    let res = await this.turmaService.getTurmas();
    console.log(res)

    this.turmas = res.turmas;
    this.selectTurmas = res.turmas;

    for (const turma of this.selectTurmas) {
      turma.createdAt = this.utilServices.formataDataBR(new Date(turma.createdAt))
    }

    this.dataSource = new MatTableDataSource(this.selectTurmas);
    this.dataSource.sort = this.sort;
  }

  filtrar() {
    let filterNome = this.objFormFilter.value['nome'] != null ? this.objFormFilter.value['nome'].toLowerCase() : '';

    this.selectTurmas = this.turmas.filter(turma => turma.nome.toLowerCase().includes(filterNome))

    this.dataSource = new MatTableDataSource(this.selectTurmas);
    this.dataSource.sort = this.sort;
  }

  limparFiltros() {
    this.objFormFilter.reset()
  }

  openModal(targetModal) {
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
    });
  }

  goHome(): void {
    this.contentView = 1;
    this.objFormRegister.reset();
  }

  close() {
    this.modalService.dismissAll();
  }

  openCreate(): void {
    this.contentView = 2;
  }

  async saveCreate() {
    if(this.objFormRegister.value['nome'] == "")  {
        this.turmaService.showMessage("Preencha todos os campos obrigatórios!", true)
    }
    else {
      try {

        const res = await this.turmaService.create(this.objFormRegister.value);
        console.log(res)
        
        if(res.info) {
          this.turmaService.showMessage(res.info, false)
        }  
        
        this.goHome();
        this.findDataTable();
      } 
      catch(err) {
        console.log(err)
        this.turmaService.showMessage("Erro ao cadastrar turma! Por favor, tente novamente.", true)
      }

    }
  }

  async openUpdate(obj) {
    try {
      this.contentView = 3;

      let id = obj.id;
  
      const res = await this.turmaService.findById(id)
  
      this.turmaUpdate = res;
    } 
    catch(err) {
      this.turmaService.showMessage('Erro ao buscar aluno', true);
    }
  }

  async saveUpdate() {
    if(this.turmaUpdate.nome == "") {
        this.turmaService.showMessage("Preencha todos os campos obrigatórios!", true)
    }
    else {
      try {
        const res = await this.turmaService.update(this.turmaUpdate);
        console.log(res)

        if(res.info) {
          this.turmaService.showMessage(res.info, false)
        }  

        this.goHome();
        this.findDataTable();
      }
      catch(err) {
        console.log(err)
        this.turmaService.showMessage("Erro ao atualizar aluno! Por favor, tente novamente.")
      }
    }
  }

  async openDelete(obj) {
    try {
      this.contentView = 4;

      let id = obj.id;
  
      const res = await this.turmaService.findById(id)
  
      console.log(res)
  
      this.turmaDelete = res;
      this.turmaDelete.createdAt = new Date(this.turmaDelete.createdAt)

    } 
    catch(err) {
      this.turmaService.showMessage('Erro ao buscar turma', true);
      console.error(err)
    }
  }

  async saveDelete() {
    try {

      let id = this.turmaDelete.id;

      const res = await this.turmaService.deleteById(id);
      console.log(res)

      if(res.info) {
        this.turmaService.showMessage(res.info, false)
      }  

      this.goHome();
      this.findDataTable();
    } 
    catch(err) {
      this.turmaService.showMessage('Erro ao excluir aluno', true);
    }
  }
}
