import Provider from './provider';

const AdminLayout = ({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) => <Provider>{children}</Provider>;
export default AdminLayout;
