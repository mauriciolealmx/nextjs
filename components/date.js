import { format } from 'date-fns';

export default function Date({ lastChangedAtInMS }) {
  const formattedDate = format(lastChangedAtInMS, 'LLLL d, yyyy');
  return <time dateTime={formattedDate}>{formattedDate}</time>;
}
