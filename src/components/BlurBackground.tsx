import ImageWithPlaceholder from "@/components/ImageWithPlaceholder";
import type { FC } from "react";

type Props = {
  src?: string;
  alt?: string;
  blur?: boolean;
  overlay?: boolean;
  overlayClassName?: string;
};

const BlurBackground: FC<Props> = ({
  src = "/images/home-banner6.webp",
  alt = "background",
  blur = true,
  overlay = false,
  overlayClassName = "bg-gray-400/50",
}) => {
  const imgClassName = blur
    ? "object-cover object-center blur-lg backdrop-blur"
    : "object-cover object-center";

  return (
    <>
      <ImageWithPlaceholder
        className="fixed inset-0 -z-2 h-dvh w-full"
        imgClassName={imgClassName}
        src={src}
        alt={alt}
      />
      {overlay && <div className={`fixed inset-0 -z-1 ${overlayClassName}`} />}
    </>
  );
};

export default BlurBackground;
