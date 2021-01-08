import { h } from 'preact';
import cn from 'clsx';
import { JSXInternal } from 'preact/src/jsx';

import s from './InputField.module.scss';

import TargetedEvent = JSXInternal.TargetedEvent;

interface Props {
  id?: string;
  label: string;
  value: string;
  rows?: number;
  onChange?: (value: string) => void;
}

export default function InputField(props: Props): preact.JSX.Element {
  const { id, label, rows = 1, value, onChange } = props;

  const inputProps = {
    id,
    value: value,
    onChange: onChange
      ? (e: TargetedEvent<EventTarget & { value: string }>) => {
          onChange(e.currentTarget.value);
        }
      : undefined,
    className: s.input,
    readOnly: onChange == null,
  };

  return (
    <label className={cn(s.root)}>
      <span className={s.label}>{label}</span>
      {rows > 1 ? <textarea {...inputProps} rows={rows} /> : <input {...inputProps} />}
    </label>
  );
}
