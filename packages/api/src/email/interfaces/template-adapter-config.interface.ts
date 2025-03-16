// see: https://github.com/nest-modules/mailer/blob/main/lib/interfaces/template-adapter-config.interface.ts

import { Options } from '@css-inline/css-inline';

export interface TemplateAdapterConfig {
  inlineCssOptions?: Options;
  inlineCssEnabled?: boolean;
}
