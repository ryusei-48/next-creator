import style from './loading.module.scss';
import loadingSVG from './loading.svg';
import Image from 'next/image';

export default function Loading() {

  return (
    <div className={ style["loading-wrapper"] }>
      <div className={ style["loading-container"] }>
        <div className={ style["loading-text"] }>
          <span>L</span>
          <span>O</span>
          <span>A</span>
          <span>D</span>
          <span>I</span>
          <span>N</span>
          <span>G</span>
        </div>
      </div>
      <div className={ style["socials"] }>
        <a className={ style["social-link"] } href="https://twitter.com/ryusei__46" target="_top">
          <Image src={ loadingSVG } alt='ローディング表示用SVG画像' />
        </a>
      </div>
    </div>
  )
}