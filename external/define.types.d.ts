export declare global {
  export interface HTMLUseElement extends HTMLElement {
    href: string, x: number, y: Number, width: number, height: number
  }

  export interface HTMLElementTagNameMap {
    'use': HTMLUseElement
  }
}