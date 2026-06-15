import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Login }           from './components/login/login';
import { AdminTemplate }   from './components/admin-template/admin-template';
import { Customers }       from './components/customers/customers';
import { NewCustomer }     from './components/new-customer/new-customer';
import { EditCustomer }    from './components/edit-customer/edit-customer';
import { CustomerAccounts }from './components/customer-accounts/customer-accounts';
import { Accounts }        from './components/accounts/accounts';
import { Users }           from './components/users/users';
import { ChangePassword }  from './components/change-password/change-password';
import { Dashboard }       from './components/dashboard/dashboard';
import { AuthenticationGuard } from './guards/authentication';
import { AdminGuard } from './guards/admin';

const routes: Routes = [
  { path: 'login', component: Login },
  {
    path: 'admin',
    component: AdminTemplate,
    canActivate: [AuthenticationGuard],
    children: [
      { path: 'dashboard',             component: Dashboard       },
      { path: 'customers',             component: Customers       },
      { path: 'new-customer',          component: NewCustomer,      canActivate: [AdminGuard] },
      { path: 'edit-customer/:id',     component: EditCustomer,     canActivate: [AdminGuard] },
      { path: 'customer-accounts/:id', component: CustomerAccounts },
      { path: 'accounts',              component: Accounts        },
      { path: 'users',                 component: Users,            canActivate: [AdminGuard] },
      { path: 'change-password',       component: ChangePassword  },
      { path: '',                      redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
