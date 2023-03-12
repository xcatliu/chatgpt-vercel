import { getCookie, removeCookies, setCookie } from 'cookies-next';

import { sleep } from './sleep';

export function isLogin() {
  return getCookie('OPENAI_API_KEY');
}

export function login() {
  return new Promise<boolean>(async (resolve) => {
    if (!isLogin()) {
      const OPENAI_API_KEY = window.prompt('OPENAI_API_KEY:');
      await sleep(16);
      if (OPENAI_API_KEY) {
        setCookie('OPENAI_API_KEY', OPENAI_API_KEY);
        return resolve(true);
      }
      return resolve(false);
    }
    return resolve(true);
  });
}

export function logout() {
  return new Promise<boolean>(async (resolve) => {
    const logoutConfirmed = window.confirm(
      `当前 OPENAI_API_KEY 是 ****${(getCookie('OPENAI_API_KEY') as string).slice(-4)}\n是否要登出以重新输入？`,
    );
    await sleep(16);
    if (logoutConfirmed) {
      removeCookies('OPENAI_API_KEY');
      return resolve(true);
    }
    return resolve(false);
  });
}
