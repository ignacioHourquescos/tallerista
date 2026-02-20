import React, { ReactNode } from 'react';
import { Styled } from './styles';

export interface ProductCardProps {
  /** Título principal de la tarjeta */
  title: string;
  /** Subtítulo o descripción */
  subtitle?: string;
  /** Contenido del medio (imagen, carrusel, etc.) */
  middleContent: ReactNode;
  /** Contenido del footer (precios, botones, etc.) */
  footerContent: ReactNode;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  subtitle,
  middleContent,
  footerContent,
}) => {
  return (
    <Styled.Card>
      <Styled.Header>
        <Styled.Title>{title}</Styled.Title>
        {subtitle && <Styled.Subtitle>{subtitle}</Styled.Subtitle>}
      </Styled.Header>
      <Styled.MiddleContent>
        {middleContent}
      </Styled.MiddleContent>
      <Styled.Footer>
        {footerContent}
      </Styled.Footer>
    </Styled.Card>
  );
};

export default ProductCard;

