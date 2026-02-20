import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useFilter } from '@/context/FilterContext';
import { useView } from '@/context/ViewContext';
import filterKitsData from '@/data/filter-kits.json';
import lubricantsData from '@/data/lubricants.json';

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
  margin: 0 0 16px 0;
  font-size: 0.85rem;
  font-weight: 600;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

const ChipsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Chip = styled.span<{ $active: boolean }>`
  display: inline-block;
  padding: 8px 16px;
  border: 1px solid ${props => props.$active ? '#1a1a1a' : '#d0d0d0'};
  border-radius: 20px;
  background-color: ${props => props.$active ? '#1a1a1a' : '#ffffff'};
  color: ${props => props.$active ? '#ffffff' : '#666'};
  font-size: 0.85rem;
  font-weight: ${props => props.$active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;

  &:hover {
    border-color: ${props => props.$active ? '#1a1a1a' : '#999'};
    background-color: ${props => props.$active ? '#2a2a2a' : '#f5f5f5'};
    transform: ${props => props.$active ? 'scale(1.02)' : 'scale(1.01)'};
  }

  &:active {
    transform: scale(0.98);
  }
`;

/* ── component ── */

const FiltersPanel: React.FC = () => {
  const { brandFilter, setBrandFilter, graduationFilter, setGraduationFilter } = useFilter();
  const { activeView } = useView();

  // Obtener todas las marcas únicas del JSON (para kits)
  const brands = useMemo(() => {
    const uniqueBrands = new Set<string>();
    filterKitsData.forEach((kit: any) => {
      if (kit.vehicleBrand) {
        uniqueBrands.add(kit.vehicleBrand);
      }
    });
    return Array.from(uniqueBrands).sort();
  }, []);

  // Obtener todas las graduaciones únicas del JSON (para lubricantes)
  const graduations = useMemo(() => {
    const uniqueGraduations = new Set<string>();
    lubricantsData.forEach((lubricant: any) => {
      if (lubricant.graduation) {
        uniqueGraduations.add(lubricant.graduation);
      }
    });
    return Array.from(uniqueGraduations).sort();
  }, []);

  return (
    <Panel>
      <Content>
        {activeView === 'kits' ? (
          <>
            <SectionTitle>Marca del Vehículo</SectionTitle>
            <ChipsContainer>
              <Chip
                $active={!brandFilter || brandFilter === 'all'}
                onClick={() => setBrandFilter('all')}
              >
                Todas las marcas
              </Chip>
              {brands.map((brand) => (
                <Chip
                  key={brand}
                  $active={brandFilter === brand}
                  onClick={() => setBrandFilter(brand)}
                >
                  {brand}
                </Chip>
              ))}
            </ChipsContainer>
          </>
        ) : (
          <>
            <SectionTitle>Graduación</SectionTitle>
            <ChipsContainer>
              <Chip
                $active={!graduationFilter || graduationFilter === 'all'}
                onClick={() => setGraduationFilter('all')}
              >
                Todas las graduaciones
              </Chip>
              {graduations.map((graduation) => (
                <Chip
                  key={graduation}
                  $active={graduationFilter === graduation}
                  onClick={() => setGraduationFilter(graduation)}
                >
                  {graduation}
                </Chip>
              ))}
            </ChipsContainer>
          </>
        )}
      </Content>
    </Panel>
  );
};

export default FiltersPanel;

