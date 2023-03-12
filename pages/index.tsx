import { KeyIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { getCookie } from 'cookies-next';
import { NextPageContext } from 'next';
import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';

import { login, logout } from '@/utils/login';
import { sleep } from '@/utils/sleep';

export interface HomeProps {
  OPENAI_API_KEY?: string;
}

export default function Home({ OPENAI_API_KEY }: HomeProps) {
  const [logged, setLogged] = useState(!!(OPENAI_API_KEY ?? getCookie('OPENAI_API_KEY')));

  useEffect(() => {
    (async () => {
      const loginResult = await login();
      setLogged(loginResult);
    })();
  }, []);

  const onKeyIconClick = useCallback(async () => {
    if (!logged) {
      const loginResult = await login();
      setLogged(loginResult);
    } else {
      const logoutResult = await logout();
      setLogged(!logoutResult);
      if (logoutResult) {
        await sleep(100);
        const loginResult = await login();
        setLogged(loginResult);
      }
    }
  }, [logged]);

  return (
    <>
      <Head>
        <title>ChatGPT</title>
        <meta name="description" content="A Personal ChatGPT Client" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/chatgpt-mask-icon.svg" />
      </Head>
      <main>
        <header className="border-b border-gray-100 text-center">
          <h1 className="text-lg leading-10">ChatGPT</h1>
        </header>
        <KeyIcon
          className={classNames('absolute top-0 right-0 w-10 h-10 p-2.5', {
            'text-green-600': logged,
            'text-red-400': !logged,
          })}
          onClick={onKeyIconClick}
        />
      </main>
    </>
  );
}

// This gets called on every request
export async function getServerSideProps(ctx: NextPageContext) {
  const OPENAI_API_KEY = getCookie('OPENAI_API_KEY', ctx);

  return {
    props: OPENAI_API_KEY ? { OPENAI_API_KEY } : {},
  };
}
