'use client';

import React from 'react';
import ViewProduct from '@/lib/viewProduct/page';

const UserView = ({ params }: { params: { id: string } }) => (
  <div>
    <ViewProduct id={params.id} />
  </div>
);

export default UserView;
