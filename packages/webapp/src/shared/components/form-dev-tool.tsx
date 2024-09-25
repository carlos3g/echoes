import { DevTool } from '@hookform/devtools';
import type { Control } from 'react-hook-form';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FormDevTool = (props: { control?: Control<any> | undefined }) => {
  if (process.env.NODE_ENV === 'production') return null;

  return <DevTool {...props} />;
};
