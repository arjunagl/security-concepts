import { Component, OnInit } from '@angular/core';
import { Auth } from './auth.service';

@Component({
  selector: 'app-login',
  providers: [Auth],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private auth: Auth) { }

  ngOnInit() {
  }

  redirectToRegister() {
    alert('Should redirect to a different page');
    window.location.href = 'http://localhost:4201';
  }

}
