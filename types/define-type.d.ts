export declare global {
  
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

  export namespace Post {

    type GetPost = {
      id: number,
      body: {[key: string]: string},
      title: {[key: string]: string},
      description: {[key: string]: string} | null,
      status: string,
      register_date: string,
      update_date: string,
      media: {
          id: number,
          url: { paths: {[key: string]: string} },
      } | null,
      CategoryPost: {
          category: {
              id: number,
              name: {[key: string]: string},
          },
      }[],
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