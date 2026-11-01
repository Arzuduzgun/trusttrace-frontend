//Kural tablosu. Sütunlar: kural, tür, eylem, durum ve bir Aç/Kapat butonu.
import { Button } from '@/components/ui/button';
import { toggleRuleAction } from '@/endpoints/moderation/actions';
import type { ModerationRule, RuleAction } from '@/endpoints/moderation/types';
import { cn } from '@/lib/utils';

const ACTION_LABELS: Record<RuleAction, { text: string; className: string }> = {
  BLOCK: { text: 'Engelle', className: 'bg-red-100 text-red-800' },
  FLAG: { text: 'İşaretle', className: 'bg-amber-100 text-amber-900' },
};

export function RulesTable({ rules }: { rules: ModerationRule[] }) {
  if (rules.length === 0) {
    return <p className="text-sm text-muted-foreground">Henüz kural yok.</p>;
  }
  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead className="bg-muted text-left">
          <tr>
            <th className="p-2">Kural</th>
            <th className="p-2">Tür</th>
            <th className="p-2">Eylem</th>
            <th className="p-2">Durum</th>
            <th className="p-2" />
          </tr>
        </thead>
        <tbody>
          {rules.map((rule) => {
            const action = ACTION_LABELS[rule.action];
            return (
              <tr key={rule.id} className={cn('border-t', !rule.isActive && 'opacity-50')}>
                <td className="p-2 font-medium">{rule.pattern}</td>
                <td className="p-2">{rule.matchType === 'WORD' ? 'Kelime' : 'Cümle'}</td>
                <td className="p-2">
                  <span className={cn('rounded px-1.5 py-0.5 text-xs', action.className)}>{action.text}</span>
                </td>
                <td className="p-2">{rule.isActive ? 'Aktif' : 'Kapalı'}</td>
                <td className="p-2">
                  <form action={toggleRuleAction.bind(null, rule.id, !rule.isActive)}>
                    <Button type="submit" size="sm" variant="outline">
                      {rule.isActive ? 'Kapat' : 'Aç'}
                    </Button>
                  </form>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}