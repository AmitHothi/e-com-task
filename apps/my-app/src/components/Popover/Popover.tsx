import { ReactNode, useEffect, useRef, useState } from 'react';
import { cn } from '@/utils';
import Div from '../Div';

export interface IPopover {
  /**
   * children element
   */
  children?: ReactNode;

  /**
   * particular popoverId
   */
  id?: string;

  /**
   * particular popover selectedId
   */
  selectedId?: string;

  /**
   * open
   */
  open?: boolean;

  /**
   * handle close Popover
   */
  handleOnClose?: () => void;

  /**
   * classes for styling
   */
  className?: string;

  /**
   * anchor el for opening popover at proper position
   */
  anchorEl?: HTMLElement | null;

  /**
   * adjust vertical position of children
   */
  adjustVerticalPosition?: number;

  /**
   * adjust horizontal position of children
   */
  adjustHorizontalPosition?: number;
}
const Popover = ({
  id,
  selectedId,
  open = false,
  children,
  handleOnClose = () => null,
  className = '',
  anchorEl,
  adjustVerticalPosition = 0,
  adjustHorizontalPosition = 0,
}: IPopover): JSX.Element => {
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState<boolean>(open);
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  useEffect(() => {
    if (anchorEl && id === selectedId) {
      const rect = anchorEl.getBoundingClientRect();
      setPosition({
        top: rect.bottom + adjustVerticalPosition, // Adjust the vertical position as needed
        left: rect.left + adjustHorizontalPosition,
      });
      setVisible(true);
    } else {
      setVisible(false);
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        handleOnClose();
      }
    };

    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [anchorEl, visible]);

  return (
    <Div>
      {visible && (
        <Div
          className={cn(
            ' bg-white border rounded-md   shadow-sm  transition-all absolute',
            className,
          )}
          style={{ top: position.top, left: position.left }}
          ref={popoverRef}>
          {children}
        </Div>
      )}
    </Div>
  );
};

Popover.displayName = 'Popover';

export default Popover;
