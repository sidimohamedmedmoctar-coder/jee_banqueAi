import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideCharts, withDefaultRegisterables, BaseChartDirective } from 'ng2-charts';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Navbar } from './components/navbar/navbar';
import { Customers } from './components/customers/customers';
import { NewCustomer } from './components/new-customer/new-customer';
import { EditCustomer } from './components/edit-customer/edit-customer';
import { CustomerAccounts } from './components/customer-accounts/customer-accounts';
import { Accounts } from './components/accounts/accounts';
import { Login } from './components/login/login';
import { AdminTemplate } from './components/admin-template/admin-template';
import { AppHttpInterceptor } from './interceptors/app-http';
import { Chatbot } from './components/chatbot/chatbot';
import { Users } from './components/users/users';
import { ChangePassword } from './components/change-password/change-password';
import { Dashboard } from './components/dashboard/dashboard';

@NgModule({
  declarations: [
    App,
    Navbar,
    Customers,
    NewCustomer,
    EditCustomer,
    CustomerAccounts,
    Accounts,
    Login,
    AdminTemplate,
    Chatbot,
    Users,
    ChangePassword,
    Dashboard,
  ],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule, FormsModule, BaseChartDirective],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true },
    provideCharts(withDefaultRegisterables()),
  ],
  bootstrap: [App],
})
export class AppModule {}
