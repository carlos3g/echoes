import { EmailConfirmationEmail } from '@app/email/templates/email-confirmation-email';
import { EmailConfirmedEmail } from '@app/email/templates/email-confirmed-email';
import { ForgotPasswordEmail } from '@app/email/templates/forgot-password-email';
import { faker } from '@faker-js/faker';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// We use renderToStaticMarkup directly instead of @react-email/render because the latter
// uses dynamic imports that don't play well with Jest's CJS test runtime. The output is
// equivalent for content assertions — react-email only adds a doctype and optional pretty
// printing on top of this.
const renderHtml = (element: React.ReactElement) => renderToStaticMarkup(element);
const stripTags = (html: string) => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const renderText = (element: React.ReactElement) => stripTags(renderHtml(element));

describe('email templates', () => {
  describe('ForgotPasswordEmail', () => {
    it('should render the token verbatim in plain text', () => {
      const token = 'A3F7K9';
      const text = renderText(React.createElement(ForgotPasswordEmail, { token }));

      expect(text).toContain(token);
    });

    it('should include heading, expiry hint and security disclaimer', () => {
      const text = renderText(
        React.createElement(ForgotPasswordEmail, { token: faker.string.alphanumeric(6) })
      );

      expect(text).toContain('Redefinir senha');
      expect(text).toContain('Expira em 1 hora');
      expect(text).toMatch(/ignorar este email/i);
    });

    it('should include the Echoes wordmark and brand footer', () => {
      const text = renderText(React.createElement(ForgotPasswordEmail, { token: 'ABC123' }));

      expect(text).toContain('Echoes');
      expect(text).toContain('echoes.app');
    });
  });

  describe('EmailConfirmationEmail', () => {
    it('should render the link as both a CTA button href and a fallback link', () => {
      const link = `https://echoes.app/auth/email/confirm/${faker.string.alphanumeric(24)}`;
      const html = renderHtml(React.createElement(EmailConfirmationEmail, { link }));

      const matches = html.match(new RegExp(link.replace(/[/.]/g, '\\$&'), 'g'));
      expect(matches).not.toBeNull();
      expect(matches!.length).toBeGreaterThanOrEqual(2);
    });

    it('should include heading, CTA copy and disclaimer', () => {
      const text = renderText(
        React.createElement(EmailConfirmationEmail, { link: 'https://example.com' })
      );

      expect(text).toContain('Confirme seu email');
      expect(text).toMatch(/Bem-vindo ao Echoes/);
      expect(text).toContain('Confirmar email');
      expect(text).toMatch(/se você não criou uma conta/i);
    });
  });

  describe('EmailConfirmedEmail', () => {
    it('should include welcome heading and the illustrative quote', () => {
      const text = renderText(React.createElement(EmailConfirmedEmail));

      expect(text).toContain('Tudo certo');
      expect(text).toContain('As palavras certas, no momento certo, mudam tudo');
    });

    it('should mention the brand', () => {
      const text = renderText(React.createElement(EmailConfirmedEmail));

      expect(text).toContain('Echoes');
    });
  });

  describe('shared layout', () => {
    const cases: [string, React.ReactElement][] = [
      ['ForgotPasswordEmail', React.createElement(ForgotPasswordEmail, { token: 'ABC' })],
      ['EmailConfirmationEmail', React.createElement(EmailConfirmationEmail, { link: 'https://example.com' })],
      ['EmailConfirmedEmail', React.createElement(EmailConfirmedEmail)],
    ];

    it.each(cases)('%s should render the Echoes wordmark and footer link', (_name, element) => {
      const html = renderHtml(element);

      expect(html).toContain('Echoes');
      expect(html).toContain('https://echoes.app');
    });

    it.each(cases)('%s should set lang="pt-BR"', (_name, element) => {
      const html = renderHtml(element);

      expect(html).toMatch(/<html[^>]*lang="pt-BR"/);
    });

    it.each(cases)('%s should include a hidden Preview block for inbox previews', (_name, element) => {
      const html = renderHtml(element);

      // react-email's <Preview /> renders a hidden div with display:none style
      expect(html).toMatch(/display:\s*none/i);
    });
  });

  describe('XSS resistance', () => {
    it('should escape HTML in token to prevent injection', () => {
      const malicious = '<script>alert(1)</script>';
      const html = renderHtml(React.createElement(ForgotPasswordEmail, { token: malicious }));

      expect(html).not.toContain('<script>alert(1)</script>');
      expect(html).toContain('&lt;script&gt;');
    });

    it('should escape HTML special chars in confirmation link to prevent attribute injection', () => {
      const malicious = 'https://example.com/"><img src=x onerror=alert(1)>';
      const html = renderHtml(React.createElement(EmailConfirmationEmail, { link: malicious }));

      // No unescaped <img> tag should appear (would mean attribute escape was bypassed)
      expect(html).not.toMatch(/<img[^>]*onerror/i);
      // The "> sequence must be escaped — never appear raw in attributes
      expect(html).not.toContain('"><img');
      // React must escape these characters
      expect(html).toContain('&quot;');
      expect(html).toContain('&lt;img');
    });
  });
});
