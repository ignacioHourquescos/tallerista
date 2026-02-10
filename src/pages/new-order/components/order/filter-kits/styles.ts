import styled from 'styled-components';

export const Styled = {
  Container: styled.div`
    padding: 50px;
    margin: 0;
    margin-top: 60px;
    position: relative;
    z-index: 1;
    @media (max-width: 768px) {
      padding: 20px;
      padding-top: 8px;
      margin-top: 32px;
      width: 100%;
      box-sizing: border-box;
      position: relative;
      z-index: 1;
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
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;

    &:hover {
      transform: translateY(-1px);
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
    font-size: 0.75rem;
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
    font-size: 1.8rem;
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
    font-size: 0.65rem;
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
    font-size: 1.4rem;
    font-weight: bold;
    color: #1976d2;
    margin: 0;
    line-height: 1.2;
  `,
  KitDescription: styled.p`
    font-size: 0.8rem;
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
    font-size: 0.8rem;
    gap: 8px;
    margin: 0;
    padding: 0;
    line-height: 1.1;

    span {
      font-weight: 500;
      font-size: 0.85rem;
      text-transform: uppercase;
      color: #374151;
      letter-spacing: 0.3px;
    }
  `,
  PriceSection: styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 50%;
    flex-shrink: 0;
  `,
  PriceContainer: styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
  `,
  TotalPrice: styled.span`
    font-size: 1.2rem;
    font-weight: bold;
    color: #1976d2;
    text-align: right;
    line-height: 1.2;
  `,
  OriginalPrice: styled.span`
    font-size: 1.2rem;
    font-weight: bold;
    color: #1976d2;
    text-align: right;
    line-height: 1.2;
    text-decoration: line-through;
  `,
  FinalPrice: styled.span`
    font-size: 1.2rem;
    font-weight: bold;
    color: #FFA500;
    text-align: right;
    line-height: 1.2;
  `,
  QuantityAndButtonContainer: styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 8px;
    margin-left: -10px;
    margin-right: -10px;
    padding: 12px 14px;
    background-color: transparent;
    border-radius: 0;
    width: calc(100% + 20px);
    box-sizing: border-box;

    @media (max-width: 768px) {
      margin-left: 0;
      margin-right: 0;
      width: 100%;
      padding: 12px;
    }
  `,
  FirstRow: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
  `,
  DiscountMessage: styled.div`
    font-size: 0.9rem;
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
    width: 50%;
    flex-shrink: 0;
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
    background-color: #1976d2;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    line-height: 1.4;

    &:hover:not(:disabled) {
      background-color: #1565c0;
    }

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
      opacity: 0.6;
    }
  `,
};

