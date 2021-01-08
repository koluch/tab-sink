import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { TabItem } from '../../../types';
import Dialog from '../../kit/Dialog/Dialog';
import InputField from '../../kit/InputField/InputField';
import { useId } from '../../../helpers/hooks';

interface Props {
  tabs: TabItem[];
  isShown: boolean;
  onClose: () => void;
}

export default function ExportDialog(props: Props): preact.JSX.Element {
  const { tabs, isShown, onClose } = props;

  const inputId = useId();
  const [exportJson, setExportJson] = useState('');

  useEffect(() => {
    if (isShown) {
      setExportJson(JSON.stringify(tabs, null, 2));
    }
  }, [isShown]);

  return (
    <Dialog
      isShown={isShown}
      onClose={onClose}
      buttons={[
        {
          children: 'Download as file',
          onClick: () => {
            download('tab-sink-export.json', exportJson);
          },
        },
        {
          children: 'Copy to clipboard',
          onClick: () => {
            copyToClipboard(inputId);
          },
        },
      ]}
    >
      <InputField id={inputId} rows={10} label={'JSON'} value={exportJson} />
    </Dialog>
  );
}

function download(filename: string, text: string): void {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function copyToClipboard(inputId: string): void {
  const copyText = document.getElementById(inputId);
  if (copyText != null) {
    (copyText as HTMLInputElement).select();
    document.execCommand('copy');
  }
}
