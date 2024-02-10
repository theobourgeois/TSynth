import { useEffect, useState } from "react";
import { Dimensions } from "./typings-utils";

export function useContainerDimensions<T extends HTMLElement>(ref: React.RefObject<T>) {
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
    left: 0,
    top: 0,
  });

  useEffect(() => {
    const handleSetDimensions = () => {
      const graphDimensions = ref.current?.getBoundingClientRect();
      setDimensions({
        width: graphDimensions?.width ?? 0,
        height: graphDimensions?.height ?? 0,
        left: graphDimensions?.left ?? 0,
        top: graphDimensions?.top ?? 0,
      });
    };
    handleSetDimensions();
    window.addEventListener("resize", handleSetDimensions);
    return () => {
      window.removeEventListener("resize", handleSetDimensions);
    };
  }, [ref]);

  return dimensions;
}