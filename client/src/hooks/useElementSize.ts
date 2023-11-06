import { MutableRefObject, useLayoutEffect, useRef, useState } from "react";
import useResizeObserver from "@react-hook/resize-observer";

interface Size {
  width: number;
  height: number;
}

export default function useElementSize<
  T extends HTMLElement = HTMLDivElement
>(): [MutableRefObject<T | null>, Size] {
  const target = useRef<T | null>(null);
  const [size, setSize] = useState<Size>({
    width: 0,
    height: 0,
  });

  const setRoundedSize = ({ width, height }: Size) => {
    setSize({ width: Math.round(width), height: Math.round(height) });
  };

  useLayoutEffect(() => {
    target.current && setRoundedSize(target.current.getBoundingClientRect());
  }, [target]);

  useResizeObserver(target, (entry) => {
    const { inlineSize: width, blockSize: height } = entry.contentBoxSize[0];
    setRoundedSize({ width, height });
  });

  return [target, size];
}
