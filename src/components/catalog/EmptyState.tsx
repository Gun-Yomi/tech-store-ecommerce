import Link from "next/link";

type EmptyStateProps = {
  title: string;
  message: string;
  actionHref?: string;
  actionLabel?: string;
};

export function EmptyState({
  title,
  message,
  actionHref,
  actionLabel,
}: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-[#b7c891] bg-white p-8 text-center shadow-sm">
      <p className="text-sm font-black uppercase tracking-[0.18em] text-[#5f7d33]">
        No matches
      </p>
      <h2 className="mt-3 text-2xl font-black tracking-normal text-[#253326]">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#60705d]">
        {message}
      </p>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-[#6e8f3d] px-5 text-sm font-black text-white transition hover:bg-[#5f7d33]"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
