export declare global {
  
  export interface WindowEventMap {
    "media-selected": CustomEvent<{ src: string, srcset: string, width: string } | null>,
    "thumb-selected": CustomEvent<{ src: string, id: string }>
  }
  
  export interface DocumentEventMap {
    //"user-login": CustomEvent<string>;
  }
  
  export type CategoryData = {
    id: number, name: string, slug: string,
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