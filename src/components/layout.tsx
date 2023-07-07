import { ReactElement } from "react";

export default function Layout({ children }: { children: ReactElement }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}
