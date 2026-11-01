//Yasaklı kelimeler sayfası. Kuralları çeker
import { listRules } from '@/endpoints/moderation/queries';
import { RuleForm } from '@/features/moderation/rule-form';
import { RulesTable } from '@/features/moderation/rules-table';

export default async function AdminRulesPage() {
  const rules = await listRules();
  return (
    <div className="space-y-4 p-6">
      <h1 className="text-xl font-semibold">Yasaklı kelimeler</h1>
      <RuleForm />
      <p className="text-xs text-muted-foreground">
        Kurallar küçük harfe çevrilerek kaydedilir. Tarama; büyük harf, rakamla yazım (s4l4k) ve
        harf harf ayırma (a.p.t.a.l) gibi atlatma denemelerini de yakalar. 4 harf ve üzeri kurallar
        ekli kelimeleri de kapsar (aptal → aptalsın).
      </p>
      <RulesTable rules={rules} />
    </div>
  );
}