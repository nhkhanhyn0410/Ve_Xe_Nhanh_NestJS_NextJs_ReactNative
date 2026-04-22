interface OperatorPlaceholderPageProps {
  title: string;
  description: string;
  routeHint: string;
}

export default function OperatorPlaceholderPage({
  title,
  description,
  routeHint,
}: OperatorPlaceholderPageProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="inline-flex rounded-full bg-[#eff6ff] px-3 py-1 text-xs font-medium text-[#2b7ead]">
        Operator Module
      </div>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">{description}</p>
      <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
        Route hiện tại: <span className="font-medium text-slate-700">{routeHint}</span>
      </div>
    </section>
  );
}
