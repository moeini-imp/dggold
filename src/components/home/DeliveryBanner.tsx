export function DeliveryBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-4 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-6 rounded-[20px] bg-gradient-to-l from-teal-900 to-teal-800 px-6 py-8 md:px-12">
        <span className="text-lg font-extrabold text-gold-300 md:text-xl">
          تحویل فیزیکی طلا و سکه، در همان روز
        </span>
        <div className="relative h-[50px] w-[120px] shrink-0">
          <span className="absolute bottom-2.5 right-10 h-8.5 w-[70px] rounded-r-md bg-gold-300" />
          <span className="absolute bottom-2.5 right-0 h-6.5 w-10 rounded-l-md bg-gold-500" />
          <span className="absolute -bottom-0.5 right-3.5 h-4 w-4 rounded-full border-[3px] border-gold-300 bg-teal-950" />
          <span className="absolute -bottom-0.5 right-20 h-4 w-4 rounded-full border-[3px] border-gold-300 bg-teal-950" />
        </div>
      </div>
    </section>
  );
}
