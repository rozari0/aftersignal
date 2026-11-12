import type { SalvageComponent } from "@/data/types";
import { formatCount } from "@/lib/format";

const fmtKg = (kg: number) => (kg < 10 ? `${kg.toLocaleString("en-US", { maximumFractionDigits: 2 })} kg` : `${formatCount(kg)} kg`);

const BAR = ["bg-cyan", "bg-amber", "bg-lilac", "bg-rust", "bg-panel", "bg-silver", "bg-ink"];

export function ComponentTable({ components, totalMassKg }: { components: SalvageComponent[]; totalMassKg: number }) {
  return (
    <div className="space-y-3">
      {/* Mass breakdown: one segment per component, proportional to its share of the total. */}
      <div aria-hidden className="flex h-5 overflow-hidden border-2 border-rule bg-sunk shadow-nb-sm">
        {components.map((c, i) => (
          <span key={c.material} className={`${BAR[i % BAR.length]} border-r-2 border-rule last:border-r-0`} style={{ width: `${(c.massKg / totalMassKg) * 100}%` }} />
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse font-mono text-meta">
          <caption className="sr-only">Component breakdown by material, mass, condition and reuse</caption>
          <thead>
            <tr className="border-b-2 border-rule text-left text-micro uppercase tracking-wider text-text">
              <th scope="col" className="py-1.5 pr-3 font-normal">Material</th>
              <th scope="col" className="py-1.5 pr-3 text-right font-normal">Mass</th>
              <th scope="col" className="py-1.5 pr-3 font-normal">Condition</th>
              <th scope="col" className="py-1.5 font-normal">Reuse</th>
            </tr>
          </thead>
          <tbody>
            {components.map((c, i) => (
              <tr key={c.material} className="border-b border-rule/25 align-top">
                <th scope="row" className="py-1.5 pr-3 text-left font-normal text-text">
                  <span aria-hidden className={`mr-2 inline-block h-3 w-3 border-2 border-rule align-middle ${BAR[i % BAR.length]}`} />
                  {c.material}
                </th>
                <td className="whitespace-nowrap py-1.5 pr-3 text-right tabular-nums text-text">{fmtKg(c.massKg)}</td>
                <td className="py-1.5 pr-3 text-muted">{c.condition}</td>
                <td className="py-1.5 text-muted">{c.reuse}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-rule font-bold text-ink">
              <th scope="row" className="py-1.5 pr-3 text-left font-normal uppercase tracking-wider">Total</th>
              <td className="whitespace-nowrap py-1.5 pr-3 text-right tabular-nums"><span className="bg-cyan px-1">{fmtKg(totalMassKg)}</span></td>
              <td colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
