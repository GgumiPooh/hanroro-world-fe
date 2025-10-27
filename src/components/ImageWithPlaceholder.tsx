"use client";

import Skeleton from "@/components/Skeleton";
import { cn } from "@/utils/styles";
import {
  type ComponentProps,
  type FC,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { useIsomorphicLayoutEffect } from "react-use";

enum ImageStatus {
  LOADING = "loading",
  LOADED = "loaded",
  FAILED = "failed",
}

type Props = {
  className?: string;
  imgClassName?: string;
  fallbackOnError?: boolean;
  fallbackSrc?: string;
  renderPlaceholder?: () => ReactNode;
  onStatusChange?: (status: ImageStatus) => void;
} & Omit<ComponentProps<"img">, "onLoadStart" | "onLoad" | "onError">;

const ImageWithPlaceholder: FC<Props> = ({
  className,
  imgClassName,
  src: _src,
  alt,
  fallbackOnError = true,
  fallbackSrc,
  renderPlaceholder = () => <Skeleton className="size-full" />,
  onStatusChange,
  ...props
}) => {
  const imgRef = useRef<HTMLImageElement>(null);

  const [src, setSrc] = useState(_src);
  const [status, setStatus] = useState<ImageStatus>(ImageStatus.LOADING);

  useIsomorphicLayoutEffect(() => {
    setSrc(_src);
    setStatus(ImageStatus.LOADING);
    onStatusChange?.(ImageStatus.LOADING);
  }, [_src]);

  useEffect(() => {
    if (!imgRef.current?.complete) {
      return;
    }

    // NOTE: HTMLImageElement.complete can be true when the src value is falsy or the image failed to load, so we need to double-check.
    if (!isValidImage(imgRef.current)) {
      handleError();
      return;
    }

    handleLoad();
  }, [src, fallbackSrc]);

  return (
    <div className={cn("relative", className)}>
      {status === ImageStatus.LOADING && (
        <div className="absolute inset-0">{renderPlaceholder?.()}</div>
      )}

      <img
        {...props}
        className={cn(
          "size-full transition-opacity duration-500 ease-out",
          status !== ImageStatus.LOADED && "opacity-0",
          imgClassName,
        )}
        ref={imgRef}
        key={src?.toString()}
        src={src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );

  function handleLoad() {
    setStatus(ImageStatus.LOADED);
    onStatusChange?.(ImageStatus.LOADED);
  }

  function handleError() {
    if (fallbackOnError && fallbackSrc && src !== fallbackSrc) {
      setSrc(fallbackSrc);
      setStatus(ImageStatus.LOADING);
      onStatusChange?.(ImageStatus.LOADING);
      return;
    }

    setStatus(ImageStatus.FAILED);
    onStatusChange?.(ImageStatus.FAILED);
  }
};

function isValidImage(img: HTMLImageElement) {
  return img.naturalWidth > 0 && img.naturalHeight > 0;
}

export default ImageWithPlaceholder;
