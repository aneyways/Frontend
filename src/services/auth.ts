import type { TokenPayload } from '../types/auth.types';

const TOKEN_KEY = 'accessToken';

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));

    const idRaw =
      decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ??
      decoded.id ??
      decoded.nameid ??
      decoded.sub ??
      0;

    const userNameRaw =
      decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ??
      decoded.userName ??
      decoded.unique_name ??
      decoded.name ??
      '';

    const roleRaw =
      decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ??
      decoded.role ??
      'User';

    const roleNumber = roleRaw === 'Admin' ? 2 : roleRaw === 'User' ? 1 : Number(roleRaw) || 1;

    return {
      id: Number(idRaw),
      userName: String(userNameRaw),
      email: decoded.email ?? '',
      role: roleNumber,
      exp: decoded.exp ?? 0,
    };
  } catch {
    return null;
  }
}

export function getCurrentUser(): TokenPayload | null {
  const token = getToken();
  if (!token) return null;
  return decodeToken(token);
}

export function isAdmin(): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  return user.role === 2 || (user.role as unknown as string) === 'Admin';
}

export function isTokenExpired(): boolean {
  const user = getCurrentUser();
  if (!user) return true;
  return Date.now() / 1000 > user.exp;
}