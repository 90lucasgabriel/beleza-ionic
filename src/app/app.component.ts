import { Component, ViewChild } from '@angular/core';
import { Events, Nav, Platform, ModalController, MenuController }           from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { LocalStorage }            from '../common/services/local-storage';
import { UserService }             from '../pages/user/user.service';

import { AccountListPage }         from '../pages/account/account-list/account-list';
import { BranchListPage }          from '../pages/branch/branch-list/branch-list';
import { HomeClientPage }          from '../pages/home/home-client/home-client';
import { JobListPage }             from '../pages/job/job-list/job-list';
import { OrderCreatePage }         from '../pages/order/order-create/order-create';
import { UserLoginPage }           from '../pages/user/user-login/user-login';


@Component({
  templateUrl: 'app.html',
  providers: [UserService]

})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage            : any    = HomeClientPage;
  pages               : Array<{title: string, component: any, params: Object}>;
  public userPicture  : string = 'http://knowledge-commons.com/static/assets/images/avatar.png';
  public userEmail    : string = 'Entre com sua conta';
  public userName     : string = '';

  constructor(
    public  events        : Events,
    public  platform      : Platform,
    private modalCtrl     : ModalController,
    private menuCtrl      : MenuController,
    private $localStorage : LocalStorage,
    private $user         : UserService) {
    this.initializeApp();

    //Cria o evento que verifica se o usuário está logado
    this.events.subscribe('user:login', (value) =>{
      this.verifyLogin(value);
    });
  }


  public initializeApp() {
    
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      StatusBar.styleDefault();
      StatusBar.overlaysWebView(true);
      StatusBar.backgroundColorByHexString('#a01b1b');
      //StatusBar.backgroundColorByHexString('#bc1c1c');
      setTimeout(function() {

      Splashscreen.hide();
      }, 100);
      StatusBar.show();
    });

    this.verifyLogin();
  }

  

  private verifyLogin(value?: boolean): void{

    if(this.$user.isLogged() || value){
      this.pages = [
        { title: 'Salões de Beleza',  component: HomeClientPage, params: {tab: 0}},
        { title: 'Favoritos',         component: HomeClientPage, params: {tab: 1}},
        { title: 'Sair',              component: null,           params: null},
      ];

      this.$user.getByToken().then(
        userData => {
          this.userEmail   = userData.email;
          this.userName    = userData.first_name + ' ' + userData.last_name==null?'':userData.last_name;
          
          if(this.userPicture != null){
            this.userPicture = userData.picture;
          }
          else{
            this.userPicture = 'http://knowledge-commons.com/static/assets/images/avatar.png';
          }
        }
      );
    }
    else{
      this.pages = [
        { title: 'Salões de Beleza',  component: HomeClientPage, params: {tab: 0}},
        { title: 'Favoritos',         component: HomeClientPage, params: {tab: 1}}
      ]; 

      this.userEmail   = 'Entre com sua conta';
      this.userName    = '';
      this.userPicture = 'http://knowledge-commons.com/static/assets/images/avatar.png';
    }
  }









  //NAV ------------------------------------------------------
  public openPage(page): void {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if(page.title=='Sair'){
      this.$user.logout();
    }
    else{
      if(page.params!=null){
        this.nav.setRoot(page.component, {params: page.params});
      }
    }
  }

  public goAccount(): void{
    if(this.$user.isLogged()){
      this.menuCtrl.close();
      this.nav.push(AccountListPage);
    }
    else{
      this.openLogin();
    }
  }

  public openLogin(): void{
    this.menuCtrl.close();
    let modal = this.modalCtrl.create(UserLoginPage);
    modal.present(); 
  }



}
