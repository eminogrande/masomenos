import { Buffer } from 'buffer';
import * as process from 'process';

declare global {
  interface Window {
    Buffer: typeof Buffer;
    process: typeof process;
  }
}

window.Buffer = Buffer;
window.process = process as any;

export {};