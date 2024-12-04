import { Buffer } from 'buffer';

declare global {
  interface Window {
    global: any;
  }
}

window.global = window;
window.global.Buffer = Buffer;

export {};