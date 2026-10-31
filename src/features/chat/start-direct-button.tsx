//“Temsilciyle özel görüş başlat” butonu. Basınca 1-1 oda açılır ve konuşma ekranına gidilir.
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