import style from './container.module.scss';

export default async function Container({ children, customStyle }: {
  children: React.ReactNode, customStyle?: React.CSSProperties
}) {

  return (
    <div className={ style.wrapper }>
      <div style={ customStyle } className={ `container ${ style.container_over }` }>
        { children }
      </div>
    </div>
  )
}