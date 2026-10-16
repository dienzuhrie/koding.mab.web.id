import { ViewTransition } from "react";

export default function RootTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ViewTransition>{children}</ViewTransition>;
}
