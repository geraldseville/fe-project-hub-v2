import clsx from 'clsx';

interface DisplayJSONProps {
  className?: string;
  data: unknown;
}

function syntaxHighlight(json: unknown) {
  const text = JSON.stringify(json, null, 2);

  return text.replace(
    /("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(?=\s*:)?|\b(true|false|null)\b|-?\d+(\.\d+)?([eE][+-]?\d+)?)/g,
    (match) => {
      let color = 'text-white';

      if (match.startsWith('"')) {
        color = match.endsWith(':')
          ? 'text-sky-400' // keys
          : 'text-orange-300'; // strings
      } else if (/true|false/.test(match)) {
        color = 'text-purple-400';
      } else if (/null/.test(match)) {
        color = 'text-gray-400';
      } else {
        color = 'text-green-400'; // numbers
      }

      return `<span class="${color}">${match}</span>`;
    },
  );
}

export default function DisplayJSON({ className, data }: DisplayJSONProps) {
  return (
    <div className="overflow-auto h-100">
      <pre
        className={clsx(
          'font-mono',
          'text-sm leading-6',
          'overflow-auto',
          'rounded-lg',
          'p-4',
          'bg-[#1e1e1e]',
          className,
        )}
        dangerouslySetInnerHTML={{
          __html: syntaxHighlight(data),
        }}
      />
    </div>
  );
}
