import React from 'react';
import styled from 'styled-components';
import { LubricantWithPrices } from '@/application/models/lubricants';

const ImageContainer = styled.div`
  width: 100%;
  height: 180px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  margin-bottom: 0;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 12px;
  background-color: white;
`;

const SpecsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: #f3f4f6;
  padding: 4px 12px;
  border-radius: 0;
  width: 100%;
  margin-top: 8px;
  flex-wrap: wrap;
`;

const SpecBadge = styled.span`
  font-size: 0.75rem;
  padding: 4px 8px;
  background-color: #f3f4f6;
  border-radius: 4px;
  color: #666;
  font-weight: 500;
`;

interface LubricantMiddleContentProps {
  lubricant: LubricantWithPrices;
}

const LubricantMiddleContent: React.FC<LubricantMiddleContentProps> = ({ lubricant }) => {
  return (
    <>
      <ImageContainer>
        <Image
          src={lubricant.imageUrl || '/placeholder.jpg'}
          alt={lubricant.description}
          onError={(e: any) => {
            e.target.src = '/placeholder.jpg';
          }}
        />
      </ImageContainer>
      {(lubricant.graduation || (typeof lubricant.presentation === 'string' && lubricant.presentation) || lubricant.type || lubricant.norm) && (
        <SpecsContainer>
          {lubricant.graduation && <SpecBadge>{lubricant.graduation}</SpecBadge>}
          {typeof lubricant.presentation === 'string' && lubricant.presentation && <SpecBadge>{lubricant.presentation}</SpecBadge>}
          {lubricant.type && <SpecBadge>{lubricant.type}</SpecBadge>}
          {lubricant.norm && <SpecBadge>{lubricant.norm}</SpecBadge>}
        </SpecsContainer>
      )}
    </>
  );
};

export default LubricantMiddleContent;

