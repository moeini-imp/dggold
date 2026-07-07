/** Payment / credit partners strip (text-based until logos are provided). */
const partners = [
  "دیجی‌پی",
  "لندو",
  "قسطا",
  "اسنپ‌پی",
  "تارا",
  "دارا",
  "پی‌پینگ",
  "ازکی‌وام",
];

export function TrustStrip() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-card bg-surface px-5 py-4 shadow-card">
        <span className="text-sm font-bold text-teal-700">
          درگاه‌های اعتباری
        </span>
        <div className="no-scrollbar flex flex-1 items-center gap-3 overflow-x-auto">
          {partners.map((p) => (
            <span
              key={p}
              className="shrink-0 rounded-lg border border-line bg-canvas px-3 py-1.5 text-xs text-muted"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
