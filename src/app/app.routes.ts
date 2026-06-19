import { Routes } from '@angular/router';
import { WelcomeComponent } from './features/home/welcome';
import { ProductComponent } from './features/product/product';
import { Login } from './features/auth/components/login/login';
import { UserComponent } from './features/users/user/user';
import { ProductPaginationComponent } from './features/product/product-pagination/product-pagination';
import { loginGuard } from './features/auth/guards/login.guard';
import { MapComponent } from './features/maps/components/map/map';

export const routes: Routes = [
  // Rutas protegidas por el guardia de seguridad
  { path: 'home', component: WelcomeComponent, canActivate: [loginGuard] },
  { path: 'products', component: ProductComponent, canActivate: [loginGuard] },
  { path: 'users', component: UserComponent, canActivate: [loginGuard] },
  { path: 'product-pagination', component: ProductPaginationComponent, canActivate: [loginGuard] },
  { path: 'maps', component: MapComponent, canActivate: [loginGuard] },

  // Ruta pública de acceso
  { path: 'login', component: Login },

  // Redirección por defecto
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // { path: '**', component: PageNotFound } // Mantener comentado si no existe el archivo
];

