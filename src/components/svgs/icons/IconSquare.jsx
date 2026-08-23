export default function IconSquare({ className = '' }) {
  return (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="path-01"
        d="M12 12H0V0H12V12ZM1 11H11V1H1V11Z"
        fill="currentColor"
      />
    </svg>
  );
}
