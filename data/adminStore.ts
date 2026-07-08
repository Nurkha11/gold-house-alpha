let adminAuthenticated = false;

export const ADMIN_PIN = '0707';

export function verifyAdminPin(pin: string) {
  adminAuthenticated = pin === ADMIN_PIN;
  return adminAuthenticated;
}

export function isAdminAuthenticated() {
  return adminAuthenticated;
}

export function logoutAdmin() {
  adminAuthenticated = false;
}
