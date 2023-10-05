export declare global {
  
  export interface WindowEventMap {
    "media-selected": CustomEvent<{ src: string, srcset: string, width: string } | null>,
    "thumb-selected": CustomEvent<string>
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