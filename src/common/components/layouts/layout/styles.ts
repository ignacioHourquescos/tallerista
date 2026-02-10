import styled from 'styled-components';

export const Layout = {
  Inner: styled.div`
    display: flex;
    flex-direction: column;
    padding: 0;

    @media (min-width: 768px) {
      padding: 0rem;
    }
  `,
};

export const StyledMenu = {
  Inner: styled.div`
    display: flex;
    color: white;
    padding: 1.25rem;
  `,
  Header: styled.div`
    padding: 1.25rem;
  `,
  Item: {
    Icon: styled.span`
      padding-left: 1rem;
      padding-right: 1rem;
    `,
    Title: styled.span`
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    `,
  },
  Order: styled.div`
    position: fixed;
    top: 0;
    right: 0;

    border-bottom-left-radius: 9999px;
    cursor: pointer;
  `,
  Triangle: styled.div`
    position: fixed;
    top: -2rem;
    right: -3rem;
    transform: scale(1.25) rotate(35deg);
    width: 10rem;
    height: 5rem;
  `,
  TotalItems: styled.div`
    position: fixed;
    top: 0.25rem;
    right: 1.5rem;
    font-weight: bold;
  `,
};

export const Content = {
  Inner: styled.div`
    display: flex;
    flex-direction: column;
    padding: 0;

    @media (min-width: 768px) {
      padding: 0;
    }
  `,
  Title: styled.div`
    display: flex;
    width: 100%;
    font-size: 1.25rem;
    font-weight: bold;
    padding: 0.25rem;
    padding-left: 1.25rem;
    @media (max-width: 768px) {
      padding: 0rem;
    }
  `,
  Container: styled.div`
    z-index: 20;
    padding: 0;

    @media (min-width: 768px) {
      padding: 0;
    }
  `,
};

export const StyledDrawer = {
  Header: styled.div`
    background-color: #ffa500;
    cursor: pointer;
  `,
};

export const StyledDrawerMobile = {
  Header: styled.div`
    background-color: #ffa500;
    cursor: pointer;
  `,
};
