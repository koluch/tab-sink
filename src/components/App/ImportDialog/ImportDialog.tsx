import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { TabItem } from '../../../types';
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
              const data = importJson(json);
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
        <InputField id={inputId} rows={10} label={'JSON'} value={json} onChange={setJson} />
        {error && <MessageBar type="ERROR">{error}</MessageBar>}
      </div>
    </Dialog>
  );
}

function importJson(jsonText: string): TabItem[] {
  try {
    const json = JSON.parse(jsonText);
    // todo: validate
    return json as TabItem[];
  } catch (e) {
    console.error(e.message);
    throw new Error(`Unable to parse JSON! ${e.message}`);
  }
}
