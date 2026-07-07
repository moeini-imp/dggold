type Step = "cart" | "checkout" | "done";

const steps: { key: Step; label: string }[] = [
  { key: "cart", label: "سبد خرید" },
  { key: "checkout", label: "تسویه حساب" },
  { key: "done", label: "تکمیل خرید" },
];

/** Three-step progress header for the cart → checkout flow. */
export function CheckoutSteps({ active }: { active: Step }) {
  const activeIndex = steps.findIndex((s) => s.key === active);

  return (
    <ol className="mx-auto flex max-w-xl items-center justify-between">
      {steps.map((s, i) => {
        const done = i < activeIndex;
        const current = i === activeIndex;
        return (
          <li key={s.key} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <span
                className={`grid h-9 w-9 place-items-center rounded-full text-sm font-bold transition ${
                  current
                    ? "bg-teal-600 text-surface"
                    : done
                      ? "bg-teal-100 text-teal-700"
                      : "bg-canvas text-muted"
                }`}
              >
                {i + 1}
              </span>
              <span
                className={`whitespace-nowrap text-xs ${
                  current ? "font-bold text-teal-700" : "text-muted"
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 ? (
              <span
                className={`mx-2 h-0.5 flex-1 rounded ${
                  done ? "bg-teal-300" : "bg-line"
                }`}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
