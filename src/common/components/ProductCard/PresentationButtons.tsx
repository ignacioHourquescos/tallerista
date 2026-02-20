import React from 'react';
import { Styled } from './styles';

export interface PresentationButtonsProps {
  /** Objeto con las opciones de presentación (ej: { unit: "0%", box: "10%", promo: "15%" }) */
  presentation?: Record<string, string>;
  /** Clave seleccionada actualmente */
  selectedKey?: string;
  /** Callback cuando se selecciona una opción */
  onSelect?: (key: string) => void;
}

/**
 * Componente reutilizable para mostrar botones de selección de presentación.
 * Renderiza botones dinámicamente basados en las keys del objeto presentation.
 * Si no hay presentación o está vacío, no renderiza nada.
 */
const PresentationButtons: React.FC<PresentationButtonsProps> = ({
  presentation,
  selectedKey,
  onSelect,
}) => {
  // Si no hay presentación o está vacío, no renderizar nada
  if (!presentation || typeof presentation !== 'object' || Object.keys(presentation).length === 0) {
    return null;
  }

  const presentationKeys = Object.keys(presentation);

  // Si no hay keys, no renderizar nada
  if (presentationKeys.length === 0) {
    return null;
  }

  // Capitalizar la primera letra de la key para el label
  const getLabel = (key: string): string => {
    return key.charAt(0).toUpperCase() + key.slice(1);
  };

  return (
    <Styled.PriceContainer>
      {presentationKeys.map((key) => {
        const isSelected = selectedKey === key;
        const value = presentation[key];

        return (
          <Styled.PresentationButton
            key={key}
            $selected={isSelected}
            onClick={() => onSelect?.(key)}
          >
            <Styled.PresentationLabel $selected={isSelected}>
              {getLabel(key)}
            </Styled.PresentationLabel>
            <Styled.PresentationValue>
              {value}
            </Styled.PresentationValue>
          </Styled.PresentationButton>
        );
      })}
    </Styled.PriceContainer>
  );
};

export default PresentationButtons;

