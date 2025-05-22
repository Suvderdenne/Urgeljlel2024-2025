import type { ReactNode } from "react";
import "../globals.css";
export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="mn">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
