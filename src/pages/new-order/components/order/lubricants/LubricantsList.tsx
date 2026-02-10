import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 32px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const Placeholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: #666;
  gap: 16px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #888;
  margin: 0;
`;

const LubricantsList: React.FC = () => {
  return (
    <Container>
      <Placeholder>
        <Title>Lubricantes</Title>
        <Subtitle>Próximamente — las cards de lubricantes se mostrarán aquí.</Subtitle>
      </Placeholder>
    </Container>
  );
};

export default LubricantsList;

