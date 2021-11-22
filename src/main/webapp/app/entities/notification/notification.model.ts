export interface INotification {
  id?: number;
  fanLevel?: string | null;
  priority?: string | null;
  header?: string | null;
  body?: string | null;
}

export class Notification implements INotification {
  constructor(
    public id?: number,
    public fanLevel?: string | null,
    public priority?: string | null,
    public header?: string | null,
    public body?: string | null
  ) {}
}

export function getNotificationIdentifier(notification: INotification): number | undefined {
  return notification.id;
}
