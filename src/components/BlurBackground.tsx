import ImageWithPlaceholder from "@/components/ImageWithPlaceholder";
import { cn } from "@/utils/styles";
import type { FC } from "react";

type Props = {
  src?: string;
  alt?: string;
  imgClassName?: string;
  overlay?: boolean;
  overlayClassName?: string;
};

const BlurBackground: FC<Props> = ({
  src = "/images/home-banner6.webp",
  alt = "background",
  imgClassName = "",
  overlay = false,
  overlayClassName = "bg-gray-400/50",
}) => {
  return (
    <>
      <ImageWithPlaceholder
        className="fixed inset-0 -z-2 h-dvh w-full"
        imgClassName={cn("object-cover object-center", imgClassName)}
        src={src}
        alt={alt}
      />
      {overlay && <div className={`fixed inset-0 -z-1 ${overlayClassName}`} />}
    </>
  );
};

export default BlurBackground;
