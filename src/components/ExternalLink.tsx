import type { FC, PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  className?: string;
  href: string;
  ariaLabel?: string;
}>;

const ExternalLink: FC<Props> = ({ href, className, ariaLabel, children }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
};

export default ExternalLink;
