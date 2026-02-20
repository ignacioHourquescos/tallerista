import styled from 'styled-components';

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
  KitsGrid: styled.div`
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
  KitCard: styled.div`
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
  KitImageContainer: styled.div`
    width: 100%;
    height: 180px;
    background-color: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    margin-bottom: 0;
  `,
  KitImage: styled.img`
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 12px;
    background-color: white;
  `,
  CarouselImage: styled.img`
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 12px;
    background-color: white;
  `,
  FilterCodeBadge: styled.div`
    position: absolute;
    bottom: 8px;
    right: 8px;
    background-color: rgba(255, 255, 255, 0.95);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.75em;
    font-weight: 600;
    color: #000000;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 5;
  `,
  CarouselControls: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background-color: #f3f4f6;
    padding: 4px 12px;
    border-radius: 0;
    width: 100%;
    margin-top: 8px;
  `,
  CarouselButton: styled.button`
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.8em;
    font-weight: 900;
    color: #1976d2;
    padding: 4px 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
    line-height: 1;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    
    &:hover {
      color: #1565c0;
    }
    
    &:active {
      transform: scale(0.95);
    }
  `,
  CarouselCheckboxes: styled.div`
    display: flex;
    gap: 8px;
    align-items: center;
  `,
  CarouselVehicleSelector: styled.div<{ $active: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background-color: ${props => props.$active ? 'rgba(25, 118, 210, 0.1)' : 'transparent'};
    color: ${props => props.$active ? '#1976d2' : '#666'};
    cursor: pointer;
    transition: all 0.2s;
    border: 1px solid ${props => props.$active ? '#1976d2' : 'transparent'};
    
    &:hover {
      background-color: rgba(25, 118, 210, 0.15);
      color: #1976d2;
    }
  `,
  CarouselFilterIcon: styled.div<{ $active: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background-color: ${props => props.$active ? 'rgba(25, 118, 210, 0.1)' : 'transparent'};
    color: ${props => props.$active ? '#1976d2' : '#666'};
    cursor: pointer;
    transition: all 0.2s;
    border: 1px solid ${props => props.$active ? '#1976d2' : 'transparent'};
    
    &:hover {
      background-color: rgba(25, 118, 210, 0.15);
      color: #1976d2;
    }
  `,
  CarouselCheckboxWrapper: styled.div<{ $active: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 4px;
    border-radius: 8px;
    background-color: ${props => props.$active ? 'rgba(25, 118, 210, 0.1)' : 'transparent'};
    transition: all 0.2s;
  `,
  CarouselCheckboxContainer: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  `,
  CarouselCheckboxLabel: styled.span`
    font-size: 0.65em;
    font-weight: 500;
    color: #374151;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    white-space: nowrap;
  `,
  KitContent: styled.div`
    padding: 12px 12px 8px 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  `,
  KitVehicleName: styled.h3`
    font-size: 1.4em;
    font-weight: bold;
    color: #1a1a1a;
    margin: 0;
    line-height: 1.2;
  `,
  KitDescription: styled.p`
    font-size: 0.8em;
    color: #666;
    margin: 0;
    line-height: 1.2;
    display: block;
  `,
  FiltersList: styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 12px;
    margin: 8px 0;
    align-items: center;
  `,
  FilterItem: styled.div`
    display: flex;
    align-items: center;
    font-size: 0.8em;
    gap: 8px;
    margin: 0;
    padding: 0;
    line-height: 1.1;

    span {
      font-weight: 500;
      font-size: 0.85em;
      text-transform: uppercase;
      color: #374151;
      letter-spacing: 0.3px;
    }
  `,
  BottomSection: styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    background-color:rgb(255, 255, 255);
    border-radius: 8px;
    padding: 0;
    gap: 12px;
    margin-top: 0px;
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
  KitPriceColumn: styled.div<{ $selected?: boolean }>`
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
  KitPriceLabel: styled.span<{ $selected?: boolean }>`
    font-size: 0.85em;
    font-weight: ${props => props.$selected ? '600' : '500'};
    color: ${props => props.$selected ? '#1a1a1a' : '#666'};
    flex-shrink: 0;
    text-align: center;
  `,
  KitPriceValue: styled.span`
    font-size: 0.9em;
    font-weight: 600;
    color: #1a1a1a;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
  `,
  TotalPrice: styled.span`
    font-size: 1.2em;
    font-weight: bold;
    color: #1a1a1a;
    text-align: right;
    line-height: 1.2;
  `,
  OriginalPrice: styled.span`
    font-size: 1.2em;
    font-weight: bold;
    color: #1a1a1a;
    text-align: right;
    line-height: 1.2;
    text-decoration: line-through;
  `,
  FinalPrice: styled.span`
    font-size: 1.2em;
    font-weight: bold;
    color: #FFA500;
    text-align: right;
    line-height: 1.2;
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
  DiscountMessage: styled.div`
    font-size: 0.9em;
    color: #FFA500;
    font-weight: 600;
    text-align: center;
    padding: 4px 0;
  `,
  QuantityContainer: styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 2px;
    flex-shrink: 0;
    margin-right: 0;
    background-color:rgb(85, 84, 84);
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
    background-color:rgb(0, 0, 0);
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

// Estilos para el NumberInput
export const blue = {
  100: '#daecff',
  200: '#b6daff',
  300: '#66b2ff',
  400: '#3399ff',
  500: '#007fff',
  600: '#0072e5',
  700: '#0059B2',
  800: '#004c99',
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
  color: ${grey[500]};
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
`;

export const StyledInput = styled('input')`
  font-size: 0.875rem;
  font-family: inherit;
  font-weight: 400;
  line-height: 1.375;
  color: rgb(255, 255, 255);
  background: rgba(255, 255, 255, 0);
  border-bottom: 0px solid #e0e0e0;
  box-shadow: none;
  border-radius: 0px;
  margin: 0 2px;
  padding: 6px 8px;
  outline: 0;
  min-width: 0;
  width: 3rem;
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
  border: 0px solid;
  border-radius: 999px;
  border-color: #e0e0e0;
  background: rgba(255, 255, 255, 0);
  color: rgb(255, 255, 255);
  width: 25px;
  height: 25px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 120ms;

  &:hover {
    cursor: pointer;
    background: #fff5e6;
    border-color: #FF8C00;
    color: #FF8C00;
  }

  &:focus-visible {
    outline: 0;
  }

  &.increment {
    order: 1;
  }
`;

