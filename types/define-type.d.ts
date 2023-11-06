export declare global {

  export type AcceptLocales = 'ja' | 'en';
  
  export interface WindowEventMap {
    "media-selected": CustomEvent<{ src: string, srcset: string, width: string } | null>,
    "thumb-selected": CustomEvent<{ src: string, id: string }>
  }
  
  export interface DocumentEventMap {
    //"user-login": CustomEvent<string>;
  }
  
  export type CategoryData = {
    id: number, name: {[key: string]: string}, slug: string,
    rank: number, parent: number, icon: string | null,
    icon_mime: string | null, register_date: string,
    update_date: string
  }
  
  export type CategoryNode = ({
    children: CategoryNode
  } & CategoryData)[]

  export type CatEditDetails = {
    name: string, slug: string, id: string,
    rank: string, parent: string, icon: string
  } | null

  export namespace Category {

    type CategoryRelatedPost = {
      id: number;
      name: {[key: string]: string},
      slug: string;
      CategoryPost: {
        post: {
          id: number,
          body: {[key: string]: string},
          title: {[key: string]: string},
          description: {[key: string]: string} | null,
          status: string, permalink: string,
          register_date: string,
          update_date: string,
          media: {
              id: number,
              url: { paths: {[key: string]: string} },
          } | null,
          user: {
            nameid: string
          }
        };
      }[];
    } | null
  }

  export namespace Post {

    type Category = {
      category: {
        id: number,
        name: {[key: string]: string},
        slug: string,
        icon_mime: string | null
      },
    }[];

    type GetPost = {
      id: number,
      body: {[key: string]: string},
      title: {[key: string]: string},
      description: {[key: string]: string} | null,
      status: string, permalink: string | null,
      register_date: string,
      update_date: string,
      media: {
        id: number,
        url: { paths: {[key: string]: string} },
      } | null,
      CategoryPost: Category,
      user: {
        nameid: string
      }
    }
  }
}

export declare module "next-auth" {
  interface User {
    id?: string;
  }

  interface Session {
    user?: User;
  }
}

export declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}