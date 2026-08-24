import type { ReactNode } from 'react';
import { Box, IconButton, Modal, Typography } from '@mui/material';
import { Iconify } from 'src/components/iconify';

// ============================================================
//  MODAL STYLES - Consistent with all modals in the application
//  These styles ensure the same look and feel across all modals
// ============================================================

/**
 * Main modal container styles
 * - Centered on screen with absolute positioning
 * - Flex column layout with header, body, footer structure
 * - Max height with overflow hidden to contain scrolling
 */
const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '95%', sm: 700, md: 800 },
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  borderRadius: 3,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column' as const,
  overflow: 'hidden',
};

/**
 * Modal header styles
 * - Fixed at top with border bottom separator
 * - Flex layout with space between title and close button
 * - Sticky with z-index to stay above scrollable content
 */
const modalHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  p: 3,
  pb: 2,
  borderBottom: '1px solid',
  borderColor: 'divider',
  flexShrink: 0,
  bgcolor: 'background.paper',
  borderTopLeftRadius: 3,
  borderTopRightRadius: 3,
  zIndex: 10,
};

/**
 * Modal body styles
 * - Scrollable content area with flex grow
 * - Custom light gray scrollbar for Webkit browsers
 * - Firefox scrollbar styling
 */
const modalBodyStyle = {
  flex: 1,
  overflowY: 'auto' as const,
  p: 3,
  pt: 2,
  minHeight: 0,
  maxHeight: '100%',
  // Webkit scrollbar (Chrome, Safari, Edge)
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f0f0f0',
    borderRadius: '3px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#d0d0d0',
    borderRadius: '3px',
    '&:hover': {
      background: '#b0b0b0',
    },
  },
  // Firefox scrollbar
  scrollbarWidth: 'thin' as const,
  scrollbarColor: '#d0d0d0 #f0f0f0',
};

/**
 * Modal footer styles
 * - Fixed at bottom with border top separator
 * - Flex layout with gap between action buttons
 * - Z-index to stay above scrollable content
 */
const modalFooterStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 1,
  p: 3,
  pt: 2,
  borderTop: '1px solid',
  borderColor: 'divider',
  flexShrink: 0,
  bgcolor: 'background.paper',
  borderBottomLeftRadius: 3,
  borderBottomRightRadius: 3,
  zIndex: 10,
};

// ============================================================
//  TYPES
// ============================================================

interface ModalDialogProps {
  /** Controls the visibility of the modal */
  open: boolean;
  /** Callback function when the modal needs to close */
  handleDialogClose: () => void;
  /** The title displayed in the modal header */
  title: string;
  /** Optional subtitle displayed below the title */
  subtitle?: ReactNode;
  /** The content to be rendered in the modal body */
  children: ReactNode;
  /** Whether to show the footer actions section */
  showActions?: boolean;
  /** Custom action buttons or a function that returns them */
  customActions?: ReactNode | ((handleClose: () => void) => ReactNode);
  /** Maximum width of the modal in pixels */
  maxWidth?: number;
  /** Additional styles to apply to the modal container */
  sx?: any;
}

// ============================================================
//  COMPONENT
// ============================================================

/**
 * ModalDialogContent - Reusable modal component
 *
 * Features:
 * - Fixed header with title, subtitle, and close button
 * - Scrollable body with custom light gray scrollbar
 * - Fixed footer with custom action buttons
 * - Consistent design across all modals in the application
 *
 * @example
 * <ModalDialogContent
 *   title="Edit Account"
 *   subtitle="Update your account information"
 *   open={isOpen}
 *   handleDialogClose={onClose}
 *   customActions={(handleClose) => (
 *     <>
 *       <Button onClick={handleClose}>Cancel</Button>
 *       <Button onClick={onSubmit}>Save</Button>
 *     </>
 *   )}
 *   maxWidth={500}
 * >
 *   <TextField label="Name" />
 * </ModalDialogContent>
 */
const ModalDialogContent = (props: ModalDialogProps) => {
  const {
    open,
    handleDialogClose,
    title,
    subtitle,
    children,
    showActions = true,
    customActions,
    maxWidth = 463,
    sx,
  } = props;

  /**
   * Renders the custom actions in the footer
   * Supports both ReactNode and function that returns ReactNode
   */
  const renderCustomActions = () => {
    if (!customActions) return null;

    if (typeof customActions === 'function') {
      return customActions(handleDialogClose);
    }

    return customActions;
  };

  return (
    <Modal open={open} onClose={handleDialogClose} aria-labelledby="modal-dialog-title">
      <Box
        sx={{
          ...modalStyle,
          width: { xs: '95%', sm: maxWidth || 463 },
          ...sx,
        }}
      >
        {/* ======== HEADER ======== */}
        <Box sx={modalHeaderStyle}>
          <Box>
            <Typography id="modal-dialog-title" variant="h6" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <IconButton onClick={handleDialogClose} size="small">
            <Iconify icon={'eva:close-outline' as any} width={24} />
          </IconButton>
        </Box>

        {/* ======== BODY ======== */}
        <Box sx={modalBodyStyle}>{children}</Box>

        {/* ======== FOOTER ======== */}
        {showActions && <Box sx={modalFooterStyle}>{renderCustomActions()}</Box>}
      </Box>
    </Modal>
  );
};

export default ModalDialogContent;
