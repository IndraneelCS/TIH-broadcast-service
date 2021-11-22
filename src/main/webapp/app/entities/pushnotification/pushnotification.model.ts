import * as dayjs from 'dayjs';

export interface IPushnotification {
  id?: number;
  fanLevel?: string | null;
  priority?: string | null;
  messageHeader?: string | null;
  message?: string | null;
  timestamp?: dayjs.Dayjs | null;
}

export class Pushnotification implements IPushnotification {
  constructor(
    public id?: number,
    public fanLevel?: string | null,
    public priority?: string | null,
    public messageHeader?: string | null,
    public message?: string | null,
    public timestamp?: dayjs.Dayjs | null
  ) {}
}

export function getPushnotificationIdentifier(pushnotification: IPushnotification): number | undefined {
  return pushnotification.id;
}
