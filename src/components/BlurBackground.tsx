import ImageWithPlaceholder from "@/components/ImageWithPlaceholder";
import { isMobile } from "@/utils/env";
import { cn } from "@/utils/styles";
import type { FC } from "react";

type Props = {
  className?: string;
  imgClassName?: string;
  overlayClassName?: string;
  src?: string;
  alt?: string;
  overlay?: boolean;
};

const BlurBackground: FC<Props> = ({
  className,
  imgClassName = "",
  overlayClassName = "bg-gray-400/50",
  src = isMobile() ? "/images/home-banner7.webp" : "/images/home-banner9.webp",
  alt = "background",
  overlay = false,
}) => {
  return (
    <div className={className}>
      <ImageWithPlaceholder
        className="fixed inset-0 -z-2 h-dvh w-full"
        imgClassName={cn("object-cover object-center", imgClassName)}
        src={src}
        alt={alt}
      />
      {overlay && (
        <div className={cn("fixed inset-0 -z-1", overlayClassName)} />
      )}
    </div>
  );
};

export default BlurBackground;
