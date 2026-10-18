import type { SVGProps } from "react";

type IconName =
  | "runs"
  | "comparison"
  | "publications"
  | "menu"
  | "arrow"
  | "external"
  | "chevron";

const paths: Record<IconName, React.ReactNode> = {
  runs: (
    <>
      <rect x="4" y="3" width="12" height="14" rx="2" />
      <path d="M7 7h6M7 10h6M7 13h3" />
    </>
  ),
  comparison: (
    <>
      <path d="M3 16h14M6 13V8M10 13V4M14 13V6" />
    </>
  ),
  publications: (
    <>
      <rect x="3" y="5" width="14" height="12" rx="2" />
      <path d="M6 2h8M8 9l4 2-4 2V9Z" />
    </>
  ),
  menu: <path d="M3 5h14M3 10h14M3 15h14" />,
  arrow: <path d="M4 10h12m-5-5 5 5-5 5" />,
  external: (
    <>
      <path d="M11 3h6v6M17 3l-8 8" />
      <path d="M8 4H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-3" />
    </>
  ),
  chevron: <path d="m5 8 5 5 5-5" />,
};

export function Icon({
  name,
  ...props
}: SVGProps<SVGSVGElement> & { name: IconName }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
