interface BrandMarkProps {
  className?: string;
}

export function BrandMark({ className = 'h-8 w-8' }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M7 37V11L16.5 23L24 11V37"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M28 11H34.5C38.1 11 40.5 13.2 40.5 16.3C40.5 19 38.8 20.7 36.7 21.5C39.7 22.1 42 24.4 42 28.2C42 33.5 38.1 37 32.7 37H28V11Z"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M29 22H35.5" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
      <circle cx="8" cy="8" r="2" fill="currentColor" />
      <circle cx="40" cy="40" r="2" fill="currentColor" />
    </svg>
  );
}
