import { NextPageWithLayout } from '../common/types/page';
import MainLayout from '../common/components/layouts/layout/MainLayout';
import React from 'react';
import Head from 'next/head';
import NewOrder from './new-order/index.page';

interface HomeProps {}

const Home: NextPageWithLayout<HomeProps> = (props) => {
  return (
    <>
      <Head>
        <title>Renova - Cotizador</title>
        <meta name="description" key="desc" content="Cotizador de productos Renova" />
      </Head>
      <NewOrder />
    </>
  );
};

Home.getLayout = (page) => {
  return (
    <MainLayout {...page.props} title={false} goBack={false}>
      {page}
    </MainLayout>
  );
};

export default Home;
