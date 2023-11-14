import style from './category-list.module.scss';
import Container from './container';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Image from 'next/image';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export default async function CategoryList({ lang }: { lang: AcceptLocales }) {

  const categories = await prisma.category.findMany({
    orderBy: { name: 'desc' }, select: {
      id: true, name: true, slug: true, icon_mime: true
    }
  }) as unknown as {
    id: number, name: {[key in AcceptLocales]: string},
    icon_mime: string | null, slug: string
  }[];

  return (
    <Container type='article' customStyle={{
      paddingTop: '20px', paddingBottom: '20px',
      paddingLeft: '15px', paddingRight: '15px'
    }}>
      <h2 className={ style.heading2 }>Category List</h2>
      <ul className={ style.category_list }>
        {
          categories.map((cat) => {
            return (
              <li key={ cat.id } className={ style.category }>
                <Link className={ style.link_wrap } href={`/category/${ cat.slug }`}>
                  <span className={ style.icon }>
                    {
                      cat.icon_mime ?
                      <span className={ style.image_wrap }>
                        <Image src={`/api/media-stream/icon?id=${ cat.id }`}
                          loading="lazy" width={`50`} height={`50`} alt={`${ cat.name[ lang ] } - アイコン`}
                        />
                      </span> :
                      <FontAwesomeIcon icon={ faHashtag }></FontAwesomeIcon>
                    }
                  </span>
                  <span className={ style.name }>
                    { cat.name[ lang ] }
                  </span>
                </Link>
              </li>
            )
          })
        }
      </ul>
    </Container>
  )
}