import { useState, useEffect } from 'react';

export function useLocalStorage(key: string) {
  const [value, setValue] = useState<string | null>( null );

  useEffect(() => {
    const res = window.localStorage.getItem(key);
    if (!res) {
      setValue("local storage is empty");
    }
    setValue(res);
  }, []);

  const setLocalStorage = (newValue: string) => {
    window.localStorage.setItem(key, newValue);
    setValue(newValue);
  };

  return { value, setLocalStorage };
}

export function randomString(len: number = 10): string {

  let str: string = "0123456789abcdefghijklmnopqrstuvwxyz";
  str += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let strLen: number = str.length;
  let result: string = '';

  for (let i = 0; i < len; i++) {
    result += str[Math.floor(Math.random() * strLen)];
  }

  return result;
}

export function sleep( sec: number ) {

  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, sec);
  })
}

export function getStrDatetime( format?: string, dateString?: string ) {

  const date = dateString ? new Date( dateString ) : new Date();

  const y = date.getFullYear();
  const m = ('0' + (date.getMonth() + 1)).slice(-2);
  const d = ('0' + date.getDate()).slice(-2);
  const h = ('0' + date.getHours()).slice(-2);
  const mi = ('0' + date.getMinutes()).slice(-2);
  const s = ('0' + date.getSeconds()).slice(-2);

  if ( format ) {
    return format.replace('y', `${y}`).replace('mt', `${m}`).replace('d', `${d}`)
      .replace('h', `${h}`).replace('mi', `${mi}`).replace('s', `${s}`);
  }

  return y + '-' + m + '-' + d + ' ' + h + ':' + mi + ':' + s;
}

export function utcToLocalDate( date: string, format: string ) {

  const utcDate = new Date( date );
  const localDate = new Date( utcDate.getTime() - utcDate.getTimezoneOffset() * 60 * 1000 );

  return getStrDatetime( format, localDate.toISOString() );
}

export function matchMedia( device?: "desktop" ): boolean {

  switch ( device ) {
    case "desktop":
      if ( window.matchMedia(`(min-width: 1100px)`).matches ) return true
      else return false;
    default:
      if ( window.matchMedia(`(min-width: 1100px)`).matches ) return true
      else return false;
  }
}