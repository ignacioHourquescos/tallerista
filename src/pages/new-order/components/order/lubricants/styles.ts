import styled from 'styled-components';
import { Styled as ProductCardStyled } from '@/common/components/ProductCard';

export const Styled = {
  Container: styled.div`
    padding: 32px;
    margin: 0;
    position: relative;
    z-index: 1;
    @media (max-width: 768px) {
      padding: 16px;
      width: 100%;
      box-sizing: border-box;
    }
  `,
  LubricantsGrid: styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    width: 100%;
    @media (max-width: 1400px) {
      grid-template-columns: repeat(3, 1fr);
    }
    @media (max-width: 1024px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 16px;
      width: 100%;
      box-sizing: border-box;
    }
  `,
  // Re-exportar estilos del ProductCard para usar en el footer
  PriceSection: ProductCardStyled.PriceSection,
  PriceValue: styled.div`
    font-size: 1.2em;
    font-weight: bold;
    color: #1a1a1a;
    text-align: center;
    line-height: 1.2;
  `,
  QuantityAndButtonContainer: ProductCardStyled.QuantityAndButtonContainer,
  FirstRow: ProductCardStyled.FirstRow,
  QuantityContainer: ProductCardStyled.QuantityContainer,
  QuantityInput: ProductCardStyled.QuantityInput,
  AddButton: ProductCardStyled.AddButton,
};

