/* eslint-disable */
// see: https://github.com/nest-modules/mailer/blob/main/lib/adapters/mjml.adapter.ts#L8

import mjml2html = require('mjml');
import type { TemplateAdapterConfig } from '../interfaces/template-adapter-config.interface';
import { PugAdapter } from './pug.adapter';
import type { TemplateAdapter } from '../interfaces/template-adapter.interface';
import type { MailerOptions } from '../interfaces/mailer-options.interface';
// see: https://github.com/nest-modules/mailer/issues/982

export class MjmlAdapter implements TemplateAdapter {
  private engine: TemplateAdapter | null;

  constructor(
    engine: TemplateAdapter | '' | 'pug' | 'handlebars' | 'ejs',
    config?: TemplateAdapterConfig,
    others?: {
      handlebar?: {
        helper?: any;
      };
    }
  ) {
    this.engine = engine as TemplateAdapter;

    if (typeof engine === 'string') {
      if (engine === 'pug') {
        this.engine = new PugAdapter(config);
      } else if (engine === '') {
        engine = '';
      }
    }
  }

  public compile(mail: any, callback: any, mailerOptions: MailerOptions): void {
    this?.engine?.compile(
      mail,
      () => {
        mail.data.html = mjml2html(mail.data.html).html;
        callback();
      },
      mailerOptions
    );
  }
}
