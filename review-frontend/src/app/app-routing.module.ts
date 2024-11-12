import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentListComponent } from './student-list/student-list.component';
import { StudentCreateComponent } from './student-create/student-create.component';
import { StudentUpdateComponent } from './student-update/student-update.component';
import { StudentLoginComponent } from './student-login/student-login.component';
import { AuthGuard } from './auth.guard';


const routes: Routes = [
  {path:"student-list",component:StudentListComponent,canActivate:[AuthGuard]},
  {path:"",redirectTo:"student-login",pathMatch:"full"},
  {path:"student-create",component:StudentCreateComponent,canActivate:[AuthGuard]},
  {path:"student-update/:userId/:department/:course",component:StudentUpdateComponent,canActivate:[AuthGuard] },
  {path:"student-login",component:StudentLoginComponent},
  {path:"**",redirectTo:"student-login"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
