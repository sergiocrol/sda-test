export const TypographyH1 = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  return (
    <h1
      style={{
        backgroundImage: "linear-gradient(90deg,#0077ff,#00e7df)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        display: "inline-block",
        fontSize: "3.5rem",
        lineHeight: "3.5rem",
      }}
      className={`scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl ${className}`}
    >
      {text}
    </h1>
  );
};
