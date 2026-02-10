import React from 'react';
import { Styled } from './styles';
import FilterKitsList from './filter-kits/FilterKitsList';

export interface IOrder {
  availableArticles?: any;
}

const Order: React.FC<IOrder> = ({ availableArticles }) => {
  const showIVA = true; // Siempre mostrar precios finales

  return (
    <Styled.Inner>
      <Styled.SearchControl>
        <FilterKitsList
          availableArticles={availableArticles}
          showIVA={showIVA}
        />
      </Styled.SearchControl>
    </Styled.Inner>
  );
};

export default Order;
