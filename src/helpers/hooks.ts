import { nanoid } from 'nanoid';
import { useState } from 'preact/hooks';

export function useId(): string {
  const [id] = useState(nanoid());
  return id;
}
