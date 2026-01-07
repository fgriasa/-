
export interface ColorInfo {
  name: string;
  hex: string;
}

export interface DetailedColor extends ColorInfo {
  rgb: string;
  hsl: string;
}

export interface AIPalette {
  theme: string;
  colors: ColorInfo[];
}

export enum ToastType {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  INFO = 'INFO'
}

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}
