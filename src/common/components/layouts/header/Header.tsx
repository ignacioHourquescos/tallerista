import React from 'react';
import { Styled } from './styles';

interface HeaderProps {
  cartIsVisible?: boolean;
}

const Header: React.FC<HeaderProps> = ({ cartIsVisible }) => {
  return (
    <Styled.Header $cartIsVisible={cartIsVisible}>
      <Styled.LeftSection>
        <Styled.LogoContainer>
          <Styled.Logo src="/logo.png" alt="Renova" $cartIsVisible={cartIsVisible} />
        </Styled.LogoContainer>
      </Styled.LeftSection>
      <Styled.CenterSection>
        {/* Contenido central del header */}
      </Styled.CenterSection>
      <Styled.RightSection>
        {/* Contenido derecho del header */}
      </Styled.RightSection>
    </Styled.Header>
  );
};

export default Header;

