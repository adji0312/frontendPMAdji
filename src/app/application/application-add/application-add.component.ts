import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { data } from 'jquery';
import { Subscription, switchMap, timer } from 'rxjs';
import { ApplicationDatabase } from 'src/app/list-filter-app/app-database/app-database';
import { AppDatabaseService } from 'src/app/list-filter-app/app-database/app-database.service';
import { ApplicationOperatingSystem } from 'src/app/list-filter-app/app-opr-sys/app-opr-sys';
import { AppOprSysService } from 'src/app/list-filter-app/app-opr-sys/app-opr-sys.service';
import { ApplicationProgrammingLanguage } from 'src/app/list-filter-app/app-prog-lang/app-prog-lang';
import { AppProgLangService } from 'src/app/list-filter-app/app-prog-lang/app-prog-lang.service';
import { AppServerService } from 'src/app/list-filter-app/app-server/app-server.service';
import { LoginAuthService } from 'src/app/login-auth.service';
import Swal from 'sweetalert2';
import { Application } from '../application';
import { ApplicationService } from '../application.service';

@Component({
  selector: 'app-application-add',
  templateUrl: './application-add.component.html',
  styleUrls: ['./application-add.component.css']
})
export class ApplicationAddComponent implements OnInit {

  public loginuser: any = {};
  addApplication: Application = new Application;
  addApplicationForm!: FormGroup;
  formArray: any;
  public applications!: Application[];

  progLangs!: ApplicationProgrammingLanguage[];
  oprSys!: ApplicationOperatingSystem[];
  databases!: ApplicationDatabase[];
  serversApp!: ApplicationService[];

  realTimeDataSubscription$!: Subscription;

  constructor(
    private applicationService: ApplicationService,
    private formBuilder: FormBuilder,
    private authService: LoginAuthService,
    private router: Router,
    private appDatabaseService: AppDatabaseService,
    private progLangService: AppProgLangService,
    private oprSysService: AppOprSysService,
    private databaseService: AppDatabaseService,
    private serversAppService: AppServerService
  ) {
    this.authService.isLoggedIn();
    this.loginuser = JSON.parse(localStorage.getItem('currentUser') as string);
    this.addApplicationForm = this.formBuilder.group({
      application_name: [''],
      application_short_dsc: [''],
      application_device: [''],
      application_type: [''],
      application_programming_language: [''],
      application_database: [''],
      application_server: [''],
      application_operating_system: [''],
      server: [''],
    });
  }

  ngOnInit(): void {
    this.getProgLangs();
    this.getOprSys();
    this.getDabases();
    this.getServersApp();
  }

  // addApp(){
  //   this.addApplicationForm.patchValue({
  //     application_name: this.appAdd.application_name,
  //     application_short_dsc: this.appAdd.application_shord_dsc,
  //     application_device: this.appAdd.application_device,
  //     application_type: this.appAdd.application_type,
  //     application_programming_language: this.appAdd.application_programming_language,
  //     application_database: this.appAdd.application_database,
  //     application_server: this.appAdd.application_server,
  //     application_operating_system: this.appAdd.application_operating_sytems,
  //     server: this.appAdd.server
  //   });
  // }

  onAddApplication(){
    
    // var addProg: string[] = [];

    // for(let app_prog_lang of this.prog_langs.controls){
    //   addProg.push(app_prog_lang.value.application_programming_language);
    // }
    if(this.addApplicationForm.invalid){
      return;
    }

    this.applicationService.addApplication(this.addApplicationForm.value, this.loginuser.token).subscribe(
      (response: Application) => {
        this.getApplications();
        Swal.fire({
          position: 'center',
            icon: 'success',
            title: 'Berhasil menambah Application',
            showConfirmButton: true,
            timer: 1500
        })
      },
      (error: HttpErrorResponse) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Gagal menambah Applications',
          showConfirmButton: true,
          timer: 1500
        })
      });
  }

  private getApplications(){
    this.realTimeDataSubscription$ = timer(0, 1000)
      .pipe(switchMap(_ => this.applicationService.getAllApplications(this.loginuser.token)))
      .subscribe(data => {
        this.applications = data;
    });
  }

  get prog_langs(){
    return this.addApplicationForm.controls["prog_lang"] as FormArray;
  }

  private getProgLangs(){
    this.progLangService.getAllProgLang(this.loginuser.token).subscribe(data => {
      this.progLangs = data;
    })
  }

  private getOprSys(){
    this.oprSysService.getAllOprSys(this.loginuser.token).subscribe(
      data => {
        this.oprSys = data;
      }
    )
  }

  private getServersApp(){
    this.serversAppService.getAllAppServer(this.loginuser.token).subscribe(
      data => {
        this.serversApp = data;
      }
    )  
  }
  
  private getDabases(){
    this.databaseService.getAllDatabase(this.loginuser.token).subscribe(
      data => {
        this.databases = data;
      }
    )
  }

  public closeApplicationAdd(){
    this.router.navigate(['application']);
  }

  addProgLang(){
    this.prog_langs.push(
      this.formBuilder.group({
        progLang: new FormControl (null, [Validators.required]),
      })
    );
  }

  removeProgLang(idx: number){
    this.prog_langs.removeAt(idx);
  }
}
