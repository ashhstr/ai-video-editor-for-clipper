export type Block = {
  id: string;
  startFrame: number;
  endFrame: number;
  t1?: { text: string; at: number; align?: 'left' | 'right' }[];
  key: { text: string; at: number; hero?: boolean; y?: number; dot?: boolean };
  t3?: { text: string; at: number }[];
  fx?: ('strike' | 'pointer' | 'behindSubject')[];
};

export type CardItem = {
  id: string;
  startFrame: number;
  endFrame: number;
  icon: 'warning' | 'cross';
  text: string;
  y: number; // proportional height, e.g. 0.56 or 0.66
};

export type PointerProps = {
  at: number;
  dur?: number; // duration in frames (default 15 frames / 0.5s)
  startX?: number;
  startY?: number;
  dx?: number;
  dy?: number;
  rotDeg?: number;
};
