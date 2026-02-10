import React, { useContext } from 'react';
import { Styled } from './styles';
import { CartContext } from '@/context/CartContext';
import { ShoppingCart } from '@mui/icons-material';
import { Badge, IconButton } from '@mui/material';

export interface IHeader {}

const Header: React.FC<IHeader> = () => {
  const { cartItems, setCartIsVisible } = useContext(CartContext);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleCartClick = () => {
    setCartIsVisible(true);
  };

  return (
    <Styled.Header>
      <Styled.RightSection>
        <IconButton
          onClick={handleCartClick}
          sx={{
            color: '#1976d2',
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.08)',
            },
          }}
        >
          <Badge badgeContent={totalItems} color="error">
            <ShoppingCart />
          </Badge>
        </IconButton>
      </Styled.RightSection>
    </Styled.Header>
  );
};

export default Header;

