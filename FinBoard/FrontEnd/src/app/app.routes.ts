import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent} from './pages/dashboard/dashboard.component';
import { OrdersManagementComponent} from './pages/orders-management/orders-management.component';
import { MessageCenterComponent} from './pages/message-center/message-center.component';
import { LogoutComponent } from './components/logout/logout.component';
import { PortfolioReportComponent} from './pages/portfolio-report/portfolio-report.component';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // reindirizza "" → "login"
  { path: 'login', component: LoginComponent },         // pagina login
  { path: 'logout', component: LogoutComponent },
  { 
    path: 'dashboard', component: DashboardComponent, // Questo contiene sidebar + router-outlet
    children: [
      { path: '', redirectTo: 'ordermanagment', pathMatch: 'full' },
      { path: 'ordermanagment', component: OrdersManagementComponent },
      { path: 'messagecenter', component: MessageCenterComponent },
      { path: 'portfolio', component: PortfolioReportComponent }
      //{ path: 'analytics', component: AnalyticsComponent },
      //{ path: 'settings', component: SettingsComponent }
    ]
  }
];
