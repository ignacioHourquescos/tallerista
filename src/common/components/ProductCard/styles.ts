import styled from 'styled-components';

export const Styled = {
  Card: styled.div`
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
    transition: box-shadow 0.15s ease;
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;

    &:hover {
      box-shadow: 0 4px 10px rgba(15, 23, 42, 0.12);
    }

    @media (max-width: 768px) {
      width: 100%;
      max-width: 100%;
    }
  `,
  Header: styled.div`
    padding: 12px 12px 8px 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  `,
  Title: styled.h3`
    font-size: 1.2em;
    font-weight: bold;
    color: #1a1a1a;
    margin: 0;
    line-height: 1.2;
  `,
  Subtitle: styled.p`
    font-size: 0.8em;
    color: #666;
    margin: 0;
    line-height: 1.2;
    display: block;
  `,
  MiddleContent: styled.div`
    width: 100%;
    flex: 1;
  `,
  Footer: styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    background-color: rgb(255, 255, 255);
    border-radius: 8px;
    padding: 12px;
    gap: 12px;
    margin-top: 0px;
    margin-bottom: 0px;
  `,
  // Estilos compartidos para el bottom section
  BottomSection: styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    background-color: rgb(255, 255, 255);
    border-radius: 8px;
    padding: 0;
    gap: 12px;
    margin-top: 6px;
    margin-bottom: 6px;
  `,
  PriceSection: styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    flex-shrink: 0;
    padding: 0;
  `,
  PriceContainer: styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 8px;
    width: 100%;
    justify-content: space-between;
  `,
  PresentationButton: styled.div<{ $selected?: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    gap: 2px;
    padding-top: 4px;
    padding-bottom: 4px;
    border: 2px solid ${props => props.$selected ? '#FF8C00' : '#e0e0e0'};
    border-radius: 8px;
    background-color: ${props => props.$selected ? '#f5f5f5' : '#ffffff'};
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      border-color: ${props => props.$selected ? '#1a1a1a' : '#999'};
      background-color: ${props => props.$selected ? '#f5f5f5' : '#fafafa'};
    }
  `,
  PresentationLabel: styled.span<{ $selected?: boolean }>`
    font-size: 0.85em;
    font-weight: ${props => props.$selected ? '600' : '500'};
    color: ${props => props.$selected ? '#1a1a1a' : '#666'};
    flex-shrink: 0;
    text-align: center;
    text-transform: capitalize;
  `,
  PresentationValue: styled.span`
    font-size: 0.9em;
    font-weight: 600;
    color: #1a1a1a;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
  `,
  QuantityAndButtonContainer: styled.div`
    display: flex;
    flex-direction: column;
    gap: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 0;
  `,
  FirstRow: styled.div`
    display: flex;
    flex-direction: row;
    align-items: stretch;
    width: 100%;
    gap: 0;
    min-height: 48px;
  `,
  QuantityContainer: styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 2px;
    flex-shrink: 0;
    margin-right: 0;
    background-color: rgb(16, 1, 1);
    border-right: 2px solid white;
    border-radius: 12px 0 0 12px;
    padding: 4px 8px;
    height: 100%;
    width: 50%;
  `,
  QuantityInput: styled.div`
    display: flex;
    align-items: center;
    background-color: transparent;
    border-radius: 4px;
    padding: 1px 2px;
    width: 100%;
    justify-content: center;
  `,
  AddButton: styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    flex: 1;
    padding: 12px 18px;
    background-color: rgb(33, 33, 33);
    color: white;
    border: none;
    border-radius: 0 12px 12px 0;
    font-size: 1em;
    font-weight: 500;
    height: 100%;
    cursor: pointer;
    transition: background-color 0.2s;
    line-height: 1.4;

    &:hover:not(:disabled) {
      background-color: #5a5a5a;
    }

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
      opacity: 0.6;
    }
  `,
};

// Estilos para el NumberInput (compartidos)
export const blue = {
  100: '#daecff',
  200: '#b6daff',
  300: '#66b2ff',
  400: '#3399ff',
  500: '#007fff',
  600: '#0072e5',
  700: '#0059b2',
  800: '#004c99',
  900: '#003a75',
};

export const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

export const StyledInputRoot = styled('div')`
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 400;
  color: ${grey[300]};
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  background-color:rgba(255, 255, 255, 0.13);
  border-radius: 10px;

  padding: 4px;
  width: 100%;
 
`;

export const StyledInput = styled('input')`
  font-size: 0.875rem;
  font-family: inherit;
  font-weight: 400;
  line-height: 1.375;
  color: white;
  background: transparent;
  border: none;
  box-shadow: none;
  border-radius: 0px;
  margin: 0px;
  padding: 4px 4px;
  outline: 0;
  min-width: 0;
  width: 2rem;
  text-align: center;

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${blue[200]};
  }

  &:focus-visible {
    outline: 0;
  }
`;

export const StyledButton = styled('button')`
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  line-height: 1.5;
  border: none;
  border-radius: 50%;

  color: orange;
  width: 100%;
  height: 28px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 120ms;
  cursor: pointer;
  padding: 0;
  margin: 0 2px;

  &:hover {
    background: ${grey[300]};
    color: ${grey[900]};
  }

  &:active {
    background: ${grey[400]};
  }

  &:focus-visible {
    outline: 0;
  }

  &.increment {
    order: 1;
  }
`;

