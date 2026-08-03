export default function StatTile({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string | number;
  suffix?: string;
}) {
  return (
    <div className="rounded-2xl bg-surface p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1.5 font-serif text-[28px] font-semibold leading-none tabular-nums text-accent">
        {value}
        {suffix && (
          <span className="ml-1 font-sans text-sm font-normal text-muted">
            {suffix}
          </span>
        )}
      </p>
    </div>
  );
}
