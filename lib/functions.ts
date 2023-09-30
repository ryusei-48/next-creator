import fs, { constants } from 'fs';
import { mkdir } from 'fs/promises';

const APP_PATH = process.env.APP_ROOT_PATH;
const MEDIA_ROOT_PATH = `${ APP_PATH }/public/media`;

export async function getSavePath( filename: string ) {

  const year = getStrDatetime('y');
  const month = getStrDatetime('m');
  const day = getStrDatetime('d');
  const savePath = `${ MEDIA_ROOT_PATH }/${ year }/${ month }/${ day }`;
  const savePathRelative = `/media/${ year }/${ month }/${ day }`
  const prefix = randomString( 15 );

  process.umask(0);
  if ( !await pathExist( `${ MEDIA_ROOT_PATH }/${ year }` ) ) {
    await mkdir( `${ MEDIA_ROOT_PATH }/${ year }`, "0755" );
  }
  if ( !await pathExist( `${ MEDIA_ROOT_PATH }/${ year }/${ month }` ) ) {
    await mkdir( `${ MEDIA_ROOT_PATH }/${ year }/${ month }`, "0755" );
  }
  if ( !await pathExist( savePath ) ) {
    await mkdir( savePath, "0755" );
  }

  return {
    savePath, savePathRelative,
    filePath: `${ savePath }/${ prefix }_${ filename }`,
    filePathRelative: `${ savePathRelative }/${ prefix }_${ filename }`
  }
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

export function getStrDatetime( format?: string ) {

  const date = new Date();

  const y = date.getFullYear();
  const m = ('0' + (date.getMonth() + 1)).slice(-2);
  const d = ('0' + date.getDate()).slice(-2);
  const h = ('0' + date.getHours()).slice(-2);
  const mi = ('0' + date.getMinutes()).slice(-2);
  const s = ('0' + date.getSeconds()).slice(-2);

  if ( format ) {
    return format.replace('y', `${y}`).replace('m', `${m}`).replace('d', `${d}`)
      .replace('h', `${h}`).replace('mi', `${mi}`).replace('s', `${s}`);
  }

  return y + '-' + m + '-' + d + ' ' + h + ':' + mi + ':' + s;
}

export async function pathExist( path: string ) {

  return new Promise<boolean>((resolve) => {
    fs.access( path, constants.F_OK, (err) => {
      if ( !err ) {
        resolve( true );
      } else resolve( false );
    });
  });
}