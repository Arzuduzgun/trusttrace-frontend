//“Temsilciyle özel görüş başlat” butonu.
import { Button } from '@/components/ui/button';
import { startDirectRoomAction } from '@/endpoints/rooms/actions';

export function StartDirectButton() {
  return (
    <form action={startDirectRoomAction}>
      <Button type="submit" size="sm">
        Temsilciyle özel görüş başlat
      </Button>
    </form>
  );
}