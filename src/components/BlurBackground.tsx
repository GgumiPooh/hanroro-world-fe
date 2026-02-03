import ImageWithPlaceholder from "@/components/ImageWithPlaceholder";
import { cn } from "@/utils/styles";
import type { FC } from "react";

type Props = {
  className?: string;
  src?: string;
  alt?: string;
  imgClassName?: string;
  overlay?: boolean;
  overlayClassName?: string;
};

const BlurBackground: FC<Props> = ({
  className,
  src = "/images/home-banner6.webp",
  alt = "background",
  imgClassName = "",
  overlay = false,
  overlayClassName = "bg-gray-400/50",
}) => {
  return (
    <div className={className}>
      <ImageWithPlaceholder
        className="fixed inset-0 -z-2 h-dvh w-full"
        imgClassName={cn("object-cover object-center", imgClassName)}
        src={src}
        alt={alt}
      />
      {overlay && <div className={`fixed inset-0 -z-1 ${overlayClassName}`} />}
    </div>
  );
};

export default BlurBackground;
