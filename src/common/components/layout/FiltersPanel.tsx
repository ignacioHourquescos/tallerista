import React from 'react';
import styled from 'styled-components';
import { useFilter } from '@/context/FilterContext';

/* ── styled ── */

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 350px;
  overflow: hidden;

  @media (max-width: 768px) {
    min-width: 280px;
  }
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

const SectionTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 0.85rem;
  font-weight: 600;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

const Placeholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  font-size: 0.9rem;
`;

/* ── component ── */

const FiltersPanel: React.FC = () => {
  return (
    <Panel>
      <Content>
        <Placeholder>Filtros próximamente</Placeholder>
      </Content>
    </Panel>
  );
};

export default FiltersPanel;

