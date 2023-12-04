import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {OtpComponent} from "./otp/otp.component";

const routes: Routes = [
  {path: 'otp', component: OtpComponent},
  {path: 'home', component: HomeComponent},
  {path: '**', redirectTo: 'otp', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
