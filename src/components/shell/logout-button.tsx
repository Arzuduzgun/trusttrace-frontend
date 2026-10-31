import { Button } from '@/components/ui/button';
import { logoutAction } from '@/endpoints/auth/actions';

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button type="submit" variant="outline" size="sm">
        Çıkış
      </Button>
    </form>
  );
}