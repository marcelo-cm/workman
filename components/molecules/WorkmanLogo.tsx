const WorkmanLogo = ({
  variant = "EMBLEM",
  href,
  className,
}: {
  variant?: "EMBLEM" | "WORDMARK" | "COMBO";
  href?: string;
  className?: string;
}) => {
  return (
    <a href={href} className={className}>
      {variant === "EMBLEM" ? (
        <img
          src="/workman-emblem.svg"
          alt="Workman Emblem"
          className="w-full"
        />
      ) : variant === "WORDMARK" ? (
        <img
          src="/workman-wordmark.svg"
          alt="Workman Wordmark"
          className="w-full"
        />
      ) : variant === "COMBO" ? (
        <img src="/workman-combo.svg" alt="Workman Combo" className="w-full" />
      ) : null}
    </a>
  );
};

export default WorkmanLogo;
