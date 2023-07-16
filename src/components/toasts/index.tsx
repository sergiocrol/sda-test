export const showGenericToast = (
  toast: any,
  title: string,
  subtitle: string
) => {
  toast({
    variant: "destructive",
    title: <span className="text-lg">{title}</span>,
    description: <span className="text-base">{subtitle}</span>,
  });
};

export const showApiErrorToast = (toast: any) => {
  toast({
    variant: "destructive",
    title: <span className="text-lg">Free account limit exceeded</span>,
    description: (
      <span className="text-base">
        Gift me one API key! 🥺 <br />
        <a
          className="underline"
          href="https://stablediffusionapi.com/register"
          target="_blank"
        >
          Create a free account
        </a>{" "}
        and{" "}
        <a className="underline" href="mailto: sergio.crol@gmail.com">
          share the key with me
        </a>
        .
      </span>
    ),
  });
};
