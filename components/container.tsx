import style from './container.module.scss';

export default async function Container({ children, customStyle, type='div', styleInit }: {
  children: React.ReactNode, customStyle?: React.CSSProperties,
  type: 'div' | 'article' | 'ul', styleInit?: true
}) {

  return (
    <div className={ style.wrapper }>
      {
        type === 'div' ?
        <div style={ customStyle } className={ `container ${ styleInit && style.container_over }` }>
          { children }
        </div> :
        (
          type === 'article' ?
          <article style={ customStyle } className={ `container ${ styleInit && style.container_over }` }>
            { children }
          </article> :
          <ul style={ customStyle } className={ `container ${ styleInit && style.container_over }` }>
            { children }
          </ul>
        )
      }
    </div>
  )
}