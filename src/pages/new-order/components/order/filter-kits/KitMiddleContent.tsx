import React from 'react';
import styled from 'styled-components';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import OilBarrelIcon from '@mui/icons-material/OilBarrel';
import AirIcon from '@mui/icons-material/Air';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { FilterKitWithPrices } from '@/application/models/filter-kits';

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

const CarouselImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 12px;
  background-color: white;
`;

const FilterCodeBadge = styled.div`
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
`;

const CarouselControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: #f3f4f6;
  padding: 4px 12px;
  border-radius: 0;
  width: 100%;
  margin-top: 8px;
`;

const CarouselButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.4em;
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
`;

const CarouselCheckboxes = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const CarouselVehicleSelector = styled.div<{ $active: boolean }>`
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
`;

const CarouselFilterIcon = styled.div<{ $active: boolean }>`
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
`;

interface KitMiddleContentProps {
  kit: FilterKitWithPrices;
  images: Array<{ url: string; label: string; type?: 'oil' | 'air' | 'fuel' | 'cabin' }>;
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

const KitMiddleContent: React.FC<KitMiddleContentProps> = ({
  kit,
  images,
  currentIndex,
  onIndexChange,
}) => {
  return (
    <>
      <ImageContainer>
        {images.length <= 1 ? (
          <Image
            src={images[0]?.url || kit.imageUrl || '/placeholder.jpg'}
            alt={images[0]?.label || kit.vehicleName}
            onError={(e: any) => {
              e.target.src = '/placeholder.jpg';
            }}
          />
        ) : (
          <>
            <CarouselImage
              src={images[currentIndex]?.url || '/placeholder.jpg'}
              alt={images[currentIndex]?.label || kit.vehicleName}
              onError={(e: any) => {
                e.target.src = '/placeholder.jpg';
              }}
            />
            {currentIndex > 0 && images[currentIndex]?.type && (
              <FilterCodeBadge>
                {images[currentIndex].type === 'oil' && kit.oilFilterCode}
                {images[currentIndex].type === 'air' && kit.airFilterCode}
                {images[currentIndex].type === 'fuel' && kit.fuelFilterCode}
                {images[currentIndex].type === 'cabin' && kit.cabinFilterCode}
              </FilterCodeBadge>
            )}
          </>
        )}
      </ImageContainer>
      {images.length > 1 && (
        <CarouselControls>
          <CarouselButton
            onClick={(e) => {
              e.stopPropagation();
              const newIdx = (currentIndex - 1 + images.length) % images.length;
              onIndexChange(newIdx);
            }}
          >
            ←
          </CarouselButton>
          <CarouselCheckboxes>
            <CarouselVehicleSelector
              $active={currentIndex === 0}
              onClick={(e) => {
                e.stopPropagation();
                onIndexChange(0);
              }}
            >
              <DirectionsCarIcon fontSize="small" />
            </CarouselVehicleSelector>
            {images.map((image, idx) => {
              if (idx === 0) return null;
              
              const isActive = idx === currentIndex;
              let IconComponent = null;
              if (image.type === 'oil') {
                IconComponent = OilBarrelIcon;
              } else if (image.type === 'air') {
                IconComponent = AirIcon;
              } else if (image.type === 'fuel') {
                IconComponent = LocalGasStationIcon;
              } else if (image.type === 'cabin') {
                IconComponent = FilterAltIcon;
              }
              
              if (!IconComponent) return null;
              
              return (
                <CarouselFilterIcon
                  key={idx}
                  $active={isActive}
                  onClick={(e) => {
                    e.stopPropagation();
                    onIndexChange(idx);
                  }}
                >
                  <IconComponent fontSize="small" />
                </CarouselFilterIcon>
              );
            })}
          </CarouselCheckboxes>
          <CarouselButton
            onClick={(e) => {
              e.stopPropagation();
              const newIdx = (currentIndex + 1) % images.length;
              onIndexChange(newIdx);
            }}
          >
            →
          </CarouselButton>
        </CarouselControls>
      )}
    </>
  );
};

export default KitMiddleContent;

