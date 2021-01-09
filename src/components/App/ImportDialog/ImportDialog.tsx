import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import * as Either from 'fp-ts/Either';

import { TabItem, TabListCodec } from '../../../types';
import Dialog from '../../kit/Dialog/Dialog';
import InputField from '../../kit/InputField/InputField';
import { useId } from '../../../helpers/hooks';
import MessageBar from '../../kit/MessageBar/MessageBar';

import s from './ImportDialog.module.scss';

interface Props {
  isShown: boolean;
  onImport: (data: TabItem[]) => void;
  onClose: () => void;
}

export default function ImportDialog(props: Props): preact.JSX.Element {
  const { isShown, onImport, onClose } = props;

  const inputId = useId();
  const [json, setJson] = useState('');
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    if (!isShown) {
      setJson('');
      setError('');
    }
  }, [isShown]);

  return (
    <Dialog
      isShown={isShown}
      onClose={onClose}
      buttons={[
        {
          children: 'Import',
          isPrimary: true,
          onClick: () => {
            setError(null);
            try {
              const data = parseJsonText(json);
              onImport(data);
              onClose();
            } catch (e) {
              setError(e.message);
            }
          },
        },
      ]}
    >
      <div className={s.root}>
        <InputField
          id={inputId}
          rows={10}
          label={'Exported JSON'}
          value={json}
          onChange={setJson}
        />
        {error && <MessageBar type="ERROR">{error}</MessageBar>}
      </div>
    </Dialog>
  );
}

function parseJsonText(json: string): TabItem[] {
  let asJson;
  try {
    asJson = JSON.parse(json);
  } catch (e) {
    throw new Error(`Please, supply valid JSON`);
  }
  const decoded = TabListCodec.decode(asJson);
  if (Either.isLeft(decoded)) {
    const [firstError, ...restErrors] = decoded.left;
    let errorText;
    if (firstError.message != null) {
      errorText = firstError.message;
    } else {
      const path = firstError.context
        .map(({ key }) => (/^\d+$/.test(key) ? `[${key}]` : key))
        .join('/');
      const lastContextEntry = firstError.context[firstError.context.length - 1];
      const message = `expected ${lastContextEntry.type.name}, got ${JSON.stringify(
        lastContextEntry.actual,
      )}`;
      errorText = path + ' - ' + message;
    }
    if (restErrors.length > 0) {
      errorText += ` (and ${restErrors.length} more errors)`;
    }
    throw new Error(errorText);
  }
  return decoded.right;
}
