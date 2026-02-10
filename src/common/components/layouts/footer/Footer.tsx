import React, { useContext, useEffect } from 'react';
import { Styled } from './styles';

export interface IFooter extends React.ComponentPropsWithoutRef<'footer'> {}

const Footer: React.FC<IFooter> = ({}) => {
  return (
    <>
      <Styled.Inner></Styled.Inner>
    </>
  );
};

export default Footer;
