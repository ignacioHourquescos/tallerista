import styled from 'styled-components';

export const Styled = {
  Inner: styled.div`
    flex: 1;
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  `,
  Header: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid black;
    flex-shrink: 0;
  `,
  Title: styled.h2`
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #000;
  `,
  Content: styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 20px;
  `,
  EmptyCart: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #666;
    font-size: 1rem;
  `,
  KitCard: styled.div`
    border: 1px solid black;
    margin-bottom: 20px;
  `,
  KitHeader: styled.div`
    display: flex;
    align-items: flex-start;
    padding: 16px;
    border-bottom: 1px solid black;
  `,
  KitImage: styled.img`
    width: 100px;
    height: 75px;
    object-fit: cover;
    border: 1px solid black;
    margin-right: 16px;
  `,
  KitInfo: styled.div`
    flex: 1;
  `,
  KitVehicleName: styled.div`
    font-weight: 600;
    font-size: 1.1rem;
    color: #000;
    margin-bottom: 4px;
  `,
  KitDescription: styled.div`
    font-size: 0.9rem;
    color: #333;
    margin-bottom: 4px;
  `,
  KitQuantity: styled.div`
    font-size: 0.85rem;
    color: #666;
  `,
  FiltersList: styled.div`
    display: flex;
    flex-direction: column;
  `,
  FilterItem: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #ddd;
    
    &:last-child {
      border-bottom: none;
    }
  `,
  FilterInfo: styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  `,
  FilterType: styled.span`
    font-size: 0.75rem;
    color: #666;
    text-transform: uppercase;
    font-weight: 500;
  `,
  FilterCode: styled.span`
    font-weight: 600;
    font-size: 0.95rem;
    color: #000;
  `,
  FilterDescription: styled.span`
    font-size: 0.85rem;
    color: #666;
  `,
  FilterPrice: styled.span`
    font-weight: 600;
    font-size: 1rem;
    color: #000;
    margin-right: 12px;
  `,
  KitTotal: styled.div`
    text-align: right;
    font-weight: 600;
    font-size: 1.1rem;
    color: #000;
    padding: 12px 16px;
    border-top: 1px solid black;
  `,
  ButtonContainer: styled.div`
    position: sticky;
    bottom: 0;
    padding: 20px;
    border-top: 1px solid black;
    margin-top: auto;
    flex-shrink: 0;
  `,
  TotalPrice: styled.div`
    font-weight: 700;
    font-size: 1.5rem;
    color: #000;
    text-align: center;
    margin-bottom: 16px;
    padding: 12px;
    border: 1px solid black;
  `,
};
