// import { inject } from '@angular/core';
// import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
// import { SecureLocalStorageService } from '../services/secure-local-storage.service';
// import { StorageKey } from '../constent/storage-key';
// import { AuthenticationService } from '../services/authentication.service';

// export const authRollwiseGuard: CanActivateFn = (route, state) => {
  
//   const router = inject(Router)
//   const authDetails = inject(SecureLocalStorageService);
//   const authService =  inject(AuthenticationService)

//   const token = JSON.parse(authDetails.decryptAndGet(StorageKey.JWT_TOKEN))
//   const userDetail = JSON.parse(authDetails.decryptAndGet(StorageKey.USER))


//   if(!token || userDetail || userDetail?.role.length === 0){
   
//     const roles = userDetail?.role;
//     const allowedRole = ['ADMIN','VENDER','MANAGER','EMPLOYEE','COOK','SUPER']
   
//      // Check if any of the userRoles exist in allowedRoles
//     const hasAccess = roles.some((role: string) => allowedRole.includes(role));

//     if (hasAccess) {
//       // router.navigate(['/login']);
//       // router.navigate(['vendorTable'])

//       return true;
//     } else {
//       // router.navigate(['/order_field']);
//       return false;
//     }
//   }

//   return false;
// };

// export const authRollwiseChildGuard: CanActivateChildFn = (childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
//   return authRollwiseGuard(childRoute, state); // Reuse parent guard logic
// };

import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { SecureLocalStorageService } from '../services/secure-local-storage.service';
import { StorageKey } from '../constent/storage-key';
import { AuthenticationService } from '../services/authentication.service';

export const authRollwiseGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const authDetails = inject(SecureLocalStorageService);
  const authService = inject(AuthenticationService);

  const token = JSON.parse(authDetails.decryptAndGet(StorageKey.JWT_TOKEN) || 'null');
  const userDetail = JSON.parse(authDetails.decryptAndGet(StorageKey.USER) || 'null');

  if (!token || !userDetail || !userDetail.role || userDetail.role.length === 0) {
    return false;
  }

  // Get required roles from route data
  const requiredRoles: string[] = route.data['roles'] || [];
  const userRoles: string[] = userDetail.role.map((role: string) => role.toUpperCase());

  // Check if user has at least one required role
  const hasAccess = requiredRoles.some((role) => userRoles.includes(role.toUpperCase()));

  if (!hasAccess) {
    console.warn(`Access denied for roles: ${userRoles}. Redirecting...`);
    router.navigate(['/unauthorized']); // Redirect if no access
    return false;
  }

  return hasAccess;
};

export const authRollwiseChildGuard: CanActivateChildFn = (childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return authRollwiseGuard(childRoute, state); // Reuse parent guard logic
};
