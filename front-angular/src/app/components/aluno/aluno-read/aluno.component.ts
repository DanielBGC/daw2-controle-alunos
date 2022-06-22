import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ComboboxServices } from 'src/app/services/combobox.service';
import { UtilsServices } from '../../../services/utils.service';
import { AlunoService } from '../../../services/aluno.service';
import { Aluno } from '../aluno.model';
import { ApiUrl } from 'src/app/constants';
import { HeaderService } from '../../template/header/header.service';
import { TurmaService } from 'src/app/services/turma.service';


@Component({
  selector: 'app-aluno',
  templateUrl: './aluno.component.html',
  styleUrls: ['./aluno.component.css']
})

export class AlunoComponent implements AfterViewInit, OnInit {
  @ViewChild(MatSort) sort: MatSort;

  public  objFormFilter   : FormGroup;
  public  objFormRegister : FormGroup;
  public  objFormAulas    : FormArray;

  //VARIÁVEIS
  contentView = 1;

  displayedColumns = ['id', 'nome', 'turma', 'action']

  alunos: Aluno[];
  selectAlunos = [];
  selectedValue: string;

  dataSource = new MatTableDataSource();

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  aluno: Aluno = {
    nome: '',
    turma: ''
  }

  alunoView = {
    nome: ''
  }

  alunoDelete: Aluno = {
    nome: '',
    turma: '',
    data_nascimento: ''
  }

  alunoUpdate: Aluno = {
    nome: '',
    turma: '',
    data_nascimento: ''
  }

  turmasCadastradas = [];

  constructor(
    private headerService   : HeaderService,
    private modalService    : NgbModal, 
    private toastr          : ToastrService,
    private alunoService    : AlunoService,
    private turmaService    : TurmaService,
    private formBuilder     : FormBuilder,
    private utilServices    : UtilsServices,
    public  comboboxServices: ComboboxServices
  ) { 
    this.headerService.headerData = {
      title: "Alunos",
      icon: "face",
      routeUrl: "/alunos"
    }

    this.objFormFilter = this.formBuilder.group({ 
        nome : ['']
      , turma: ['']
    })

    this.objFormRegister = this.formBuilder.group({
        id              : ['']
      , nome            : ['', Validators.required]
      , turma           : ['', Validators.required]
      , data_nascimento : ['', Validators.required]
    })

    this.objFormAulas = this.formBuilder.array([
      this.getFormAula()
    ])
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
 
    let res = await this.alunoService.buscarAlunos();
    console.log(res)

    this.alunos = res.alunos;
    this.selectAlunos = res.alunos;

    this.dataSource = new MatTableDataSource(this.selectAlunos);
    this.dataSource.sort = this.sort;
  }

  // async findDataTable() {
  //   let arrAlunos = []

  //   await this.alunoService.get(ApiUrl + "/alunos")
  //     .then(function (res: any) {
  //       res.forEach((element: Aluno) => {
  //         arrAlunos.push(element)
  //       });
  //   })

  //   this.alunos = arrAlunos;

  //   this.selectAlunos = arrAlunos;

  //   this.dataSource = new MatTableDataSource(this.selectAlunos);
  //   this.dataSource.sort = this.sort;
  // }

  filtrarAlunos() {
    let filterNome = this.objFormFilter.value['nome'] != null ? this.objFormFilter.value['nome'].toLowerCase() : '';
    let filterTurma = this.objFormFilter.value['turma'] != null ? this.objFormFilter.value['turma'] : '';

    this.selectAlunos = this.alunos.filter(aluno => aluno.nome.toLowerCase().includes(filterNome))
    this.selectAlunos = this.selectAlunos.filter(aluno => aluno.turma.includes(filterTurma))

    this.dataSource = new MatTableDataSource(this.selectAlunos);
    this.dataSource.sort = this.sort;
  }

  limparFiltros() {
    this.objFormFilter.reset()
  }

  historicosAluno = []
  alunoHistorico: any
  async openModal(targetModal, aluno) {
    try {
      this.alunoHistorico = aluno.nome;
      const res = await this.alunoService.getHistoricosByAlunoId(aluno.id);

      this.historicosAluno = res.historicos;

      for (const historico of this.historicosAluno) {
        historico.createdAt = this.utilServices.formataDataBR(new Date(historico.createdAt))
        historico.localizacao_arquivo = (historico.path_dir && historico.nome_arquivo) ? historico.path_dir + historico.nome_arquivo : null
      }
  
      this.modalService.open(targetModal, {
        centered: true,
        backdrop: 'static',
        size: 'lg'
      });
    }
    catch(err) {
      console.log(err);
      this.alunoService.showMessage("Erro ao buscar histórico do aluno", true)
    }
  }

  goHome(): void {
    this.contentView = 1;
    this.objFormRegister.reset();
  }

  close() {
    this.modalService.dismissAll();
  }

  getFormAula() {
    return this.formBuilder.group({
        dia             : ['', Validators.required]
      , horarioInicio   : ['', Validators.required]
      , horarioFim      : ['', Validators.required]
    })
  }

  addFormAula() {
    this.objFormAulas.push(this.getFormAula())
  }

  removeFormAula(i) {
    this.objFormAulas.removeAt(i)
  }

  changeSelect(e) {
    console.log(e)
  }

  openCreate(): void {
    this.contentView = 2;
  }

  async saveCreate() {
    if(this.objFormRegister.value['nome'] == "" ||
      this.objFormRegister.value['turma'] == "" ||
      this.objFormRegister.value['data_nascimento'] == "") 
    {
        this.alunoService.showMessage("Preencha todos os campos obrigatórios!", true)
    }
    else {
      try {
        
        this.objFormRegister.value['data_nascimento'] = this.utilServices.formataDataBR(this.objFormRegister.value['data_nascimento'])
        
        let objEnvio = {
          nome: this.objFormRegister.value['nome'],
          turma: this.objFormRegister.value['turma'],
          data_nascimento: this.objFormRegister.value['data_nascimento']
        }
        
        console.log(objEnvio)
        const res = await this.alunoService.create(objEnvio);
        console.log(res)
        
        if(res.info) {
          this.alunoService.showMessage(res.info, false)
        }  
        
        this.goHome();
        this.findDataTable();
      } 
      catch(err) {
        console.log(err)
        this.alunoService.showMessage("Erro ao cadastrar aluno! Por favor, tente novamente.", true)
      }

    }
  }

  async openUpdate(obj) {
    try {
      this.contentView = 3;

      let id = obj.id;
  
      const res = await this.alunoService.findById(id)
  
      this.alunoUpdate = res;
      this.alunoUpdate.data_nascimento = this.utilServices.formataDataEN(this.alunoUpdate.data_nascimento);
    } 
    catch(err) {
      this.alunoService.showMessage('Erro ao buscar aluno', true);
    }
  }

  async saveUpdate() {
    if(this.alunoUpdate.nome == "" ||
      this.alunoUpdate.turma == "" ||
      this.alunoUpdate.data_nascimento == "") 
    {
        this.alunoService.showMessage("Preencha todos os campos obrigatórios!", true)
    }
    else {
      try {
        this.alunoUpdate.data_nascimento = this.utilServices.formataDataBR(this.alunoUpdate.data_nascimento)

        const res = await this.alunoService.update(this.alunoUpdate);
        console.log(res)

        if(res.info) {
          this.alunoService.showMessage(res.info, false)
        }  

        this.goHome();
        this.findDataTable();
      }
      catch(err) {
        console.log(err)
        this.alunoService.showMessage("Erro ao atualizar aluno! Por favor, tente novamente.")
      }
    }
  }

  async openDelete(obj) {
    try {
      this.contentView = 4;

      let id = obj.id;
  
      const res = await this.alunoService.findById(id)
  
      console.log(res)
  
      this.alunoDelete = res;
      this.alunoDelete.data_nascimento = this.utilServices.formataDataEN(this.alunoDelete.data_nascimento);
    } 
    catch(err) {
      this.alunoService.showMessage('Erro ao buscar aluno', true);
    }
  }

  async saveDelete() {
    try {

      let id = this.alunoDelete.id;

      const res = await this.alunoService.deleteById(id);
      console.log(res)

      if(res.info) {
        this.alunoService.showMessage(res.info, false)
      }  

      this.goHome();
      this.findDataTable();
    } 
    catch(err) {
      this.alunoService.showMessage('Erro ao excluir aluno', true);
    }
  }
}
