import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogActions,
} from '@mui/material';

interface OrderItem {
  quantity: number;
  id: string;
}

interface ConfirmationDialogProps {
  text: string;
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode; // Aquí van los botones personalizados
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  text,
  open,
  onClose,
  children,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirmation-dialog-title"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="confirmation-dialog-title">{text}</DialogTitle>
      <DialogActions sx={{ flexDirection: 'column', p: 2, gap: 1 }}>
        {children}
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
