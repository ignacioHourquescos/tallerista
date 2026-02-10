import React from 'react';
import NewOrder from './new-order/index.page';
import MainLayout from '@/common/components/layout/MainLayout';

const Home: React.FC = () => {
  return (
    <MainLayout>
      <NewOrder />
    </MainLayout>
  );
};

export default Home;
