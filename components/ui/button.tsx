import type { ButtonHTMLAttributes } from "react";

type Variant = "dark" | "ghost" | "surface";

/** design.md의 버튼 3종. 스타일 정의는 globals.css의 .btn-* 클래스에 있다. */
export function Button({
  variant = "dark",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={`btn btn-${variant} ${className}`} {...props} />;
}
