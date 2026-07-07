/** Reusable "توضیحات محصول" box. */
export function ProductDescription({
  description,
  className = "",
}: {
  description?: string;
  className?: string;
}) {
  if (!description) return null;
  return (
    <div className={`rounded-card bg-surface p-4 shadow-card ${className}`}>
      <h2 className="mb-2 font-bold text-ink">توضیحات محصول:</h2>
      <p className="text-sm leading-loose text-ink/80">{description}</p>
    </div>
  );
}
