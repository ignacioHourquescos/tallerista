import styled from 'styled-components';

interface HeaderProps {
  $cartIsVisible?: boolean;
}

export const Styled = {
  Header: styled.header<HeaderProps>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    height: 500px;
    box-sizing: border-box;
    background-color: #f5f5f5;
    border-bottom: 1px solid black;
    position: sticky;
    top: 0;
    z-index: 1000;
  `,
  LeftSection: styled.div`
    display: flex;
    align-items: center;
    flex: 0 0 auto;
  `,
  LogoContainer: styled.div`
    display: flex;
    align-items: center;
    height: 100%;
  `,
  Logo: styled.img<HeaderProps>`
    height: 40px;
    width: auto;
    object-fit: contain;
  `,
  CenterSection: styled.div`
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: center;
    gap: 16px;
  `,
  RightSection: styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 0 0 auto;
  `,
};

