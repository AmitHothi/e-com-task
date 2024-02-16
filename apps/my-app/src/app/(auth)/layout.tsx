import { cn } from '@/utils';

const Provider = ({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) => (
  <div className={cn('grid grid-cols-1')}>
    <div className="col-span-1">{children}</div>
  </div>
);
export default Provider;
