import clsx from 'clsx';

interface TeamRoleUIProps {
  role: string | null;
}

export default function TeamRoleUI({ role }: TeamRoleUIProps) {
  return (
    <div
      className={clsx(
        'font-medium',
        'text-[#C0C1FF] text-[11px] leading-none',
        'relative',
        'w-fit',
        'py-1 px-2',
        'rounded-md',
        'bg-[#1E293B]/50',
        'border border-[#334155]',
      )}
    >
      {role ? role : <i>Unset</i>}
    </div>
  );
}
