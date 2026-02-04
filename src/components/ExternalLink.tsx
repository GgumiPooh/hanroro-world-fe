import type { FC, PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  className?: string;
  href: string;
  ariaLabel?: string;
}>;

const ExternalLink: FC<Props> = ({ className, href, ariaLabel, children }) => {
  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
};

export default ExternalLink;
