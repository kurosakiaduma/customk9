/**
 * Cookie utility functions
 */

/**
 * Sets a cookie with the given name, value, and options
 * @param name Cookie name
 * @param value Cookie value
 * @param days Number of days until the cookie expires
 * @param path Cookie path (default: '/')
 * @param domain Cookie domain (default: current domain)
 * @param secure Whether the cookie should only be sent over HTTPS (default: false)
 */
export function setCookie(
  name: string,
  value: string,
  days: number = 7,
  path: string = '/',
  domain?: string,
  secure: boolean = false
): void {
  if (typeof document === 'undefined') return;

  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }

  let cookieString = 
    encodeURIComponent(name) + '=' + encodeURIComponent(value) + 
    expires + '; path=' + path;

  if (domain) {
    cookieString += '; domain=' + domain;
  }

  if (secure) {
    cookieString += '; secure';
  }

  // Set the cookie
  document.cookie = cookieString;
}

/**
 * Gets a cookie value by name
 * @param name Cookie name
 * @returns Cookie value or null if not found
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const nameEQ = encodeURIComponent(name) + '=';
  const cookies = document.cookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
    }
  }
  return null;
}

/**
 * Deletes a cookie by name
 * @param name Cookie name
 * @param path Cookie path (default: '/')
 * @param domain Cookie domain (default: current domain)
 */
export function deleteCookie(
  name: string,
  path: string = '/',
  domain?: string
): void {
  if (typeof document === 'undefined') return;
  
  // Set the cookie with an expiration date in the past
  document.cookie = 
    encodeURIComponent(name) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' +
    '; path=' + path +
    (domain ? '; domain=' + domain : '');
}

/**
 * Checks if cookies are enabled
 * @returns boolean indicating if cookies are enabled
 */
export function areCookiesEnabled(): boolean {
  if (typeof navigator === 'undefined') return false;
  
  // Try to set a test cookie
  const testKey = 'testCookie' + Math.random().toString(36).substring(2);
  try {
    setCookie(testKey, 'test');
    const cookieFound = getCookie(testKey) === 'test';
    deleteCookie(testKey);
    return cookieFound;
  } catch (e) {
    return false;
  }
}
