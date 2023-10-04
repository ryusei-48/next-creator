import style from './footer.module.scss';

export default function Footer() {

  return (
    <>
      <span className={ style.spacer }></span>
      <footer className={ style.footer }>
        <small>Copy right © { process.env.NEXT_PUBLIC_SITE_TITLE } All rights reserved.</small>
      </footer>
    </>
  )
}