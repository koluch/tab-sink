import { ComponentChildren, h } from 'preact';

import Overlay from '../Overlay/Overlay';
import Button, { Props as ButtonProps } from '../Button/Button';

import s from './Dialog.module.scss';

interface Props {
  isShown: boolean;
  children: ComponentChildren;
  buttons?: ButtonProps[];
  onClose: () => void;
}

export default function Dialog(props: Props): preact.JSX.Element {
  const { isShown, buttons = [], children, onClose } = props;

  const hasPrimaryButton = buttons.some(({ isPrimary }) => isPrimary);

  return (
    <Overlay isShown={isShown} onClose={onClose}>
      <div
        className={s.root}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className={s.content}>{children}</div>
        <div className={s.buttons}>
          <div className={s.buttonsGroup}>
            {buttons.map((buttonProps) => (
              <Button key={buttonProps.children} {...buttonProps} />
            ))}
          </div>
          <Button isPrimary={!hasPrimaryButton} onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Overlay>
  );
}
