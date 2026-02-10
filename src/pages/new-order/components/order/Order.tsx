import React from 'react';
import { Styled } from './styles';
import FilterKitsList from './filter-kits/FilterKitsList';
import LubricantsList from './lubricants/LubricantsList';
import { useView } from '@/context/ViewContext';

export interface IOrder {
  availableArticles?: any;
}

const Order: React.FC<IOrder> = ({ availableArticles }) => {
  const showIVA = true; // Siempre mostrar precios finales
  const { activeView } = useView();

  return (
    <Styled.Inner>
      <Styled.SearchControl>
        {activeView === 'kits' ? (
          <FilterKitsList
            availableArticles={availableArticles}
            showIVA={showIVA}
          />
        ) : (
          <LubricantsList />
        )}
      </Styled.SearchControl>
    </Styled.Inner>
  );
};

export default Order;
