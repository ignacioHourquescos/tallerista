import { NextPageWithLayout } from '../../common/types/page';
import MainLayout from '../../common/components/layouts/layout/MainLayout';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Order from './components/order/Order';
import { Styled } from './styles';
import {
  getArticles,
  getArticlesByListCode,
} from '@/application/services/articles';
import {
  availableBrands,
  brands,
  codeToNameMapping,
} from '@/application/models/brands';
import { OrderDetail } from '@/application/models/order';
import { Spin } from 'antd';

interface HomeProps {}

const title = 'Nuevo Pedido';

const NewOrder: NextPageWithLayout<HomeProps> = (props) => {
  const [availableArticles, setAvailabeArticles] = useState([]);

  useEffect(() => {
    const getArticlesHandler = async () => {
      try {
        // Usar lista 2 por defecto para clientes potenciales
        const listCode = '2';
        
        const response = await getArticlesByListCode(listCode);
        const filteredResponse = response
          .filter(
            (article: OrderDetail) =>
              article.agru && availableBrands.includes(article.agru)
          )
          .map((article: OrderDetail) => ({
            ...article,
            name: codeToNameMapping[+article.agru] || 'Unknown Name',
            logo: brands[article.agru].logo || 'Unknown Logo',
          }));

        setAvailabeArticles(filteredResponse);
      } catch (error) {
        console.error('Error al obtener artículos:', error);
        // Intentar usar getArticles como fallback
        try {
          const fallbackResponse = await getArticles();
          const filteredResponse = fallbackResponse
            .filter(
              (article: OrderDetail) =>
                article.agru && availableBrands.includes(article.agru)
            )
            .map((article: OrderDetail) => ({
              ...article,
              name: codeToNameMapping[+article.agru] || 'Unknown Name',
              logo: brands[article.agru].logo || 'Unknown Logo',
            }));
          setAvailabeArticles(filteredResponse);
        } catch (fallbackError) {
          console.error('Error al obtener artículos con método alternativo:', fallbackError);
        }
      }
    };
    getArticlesHandler();
  }, []);

  return (
    <Styled.Inner>
      {availableArticles?.length > 0 ? (
        <Order availableArticles={availableArticles} />
      ) : (
        <Styled.SpinContainer>
          {' '}
          <Spin />
        </Styled.SpinContainer>
      )}
    </Styled.Inner>
  );
};

export default NewOrder;
