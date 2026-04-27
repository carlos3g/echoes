import { Body, Container, Font, Head, Hr, Html, Link, Preview, Section, Text } from '@react-email/components';
import * as React from 'react';

const colors = {
  bg: '#f8f6f0',
  surface: '#ffffff',
  border: '#efe8db',
  text: '#3d2c1c',
  muted: '#9a6e47',
  clay: '#b5845a',
  sage: '#7a8b6f',
};

const fonts = {
  serif: '"Playfair Display", Georgia, serif',
  sans: '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

interface BaseEmailProps {
  preview: string;
  children: React.ReactNode;
}

export const BaseEmail = ({ preview, children }: BaseEmailProps) => (
  <Html lang="pt-BR">
    <Head>
      <meta name="color-scheme" content="light" />
      <meta name="supported-color-schemes" content="light" />
      <Font
        fontFamily="Playfair Display"
        fallbackFontFamily="Georgia"
        webFont={{
          url: 'https://fonts.gstatic.com/s/playfairdisplay/v37/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDWtA.woff2',
          format: 'woff2',
        }}
        fontWeight={400}
        fontStyle="normal"
      />
      <Font
        fontFamily="DM Sans"
        fallbackFontFamily="Helvetica"
        webFont={{
          url: 'https://fonts.gstatic.com/s/dmsans/v15/rP2Hp2ywxg089UriCZOIHTWEBlw.woff2',
          format: 'woff2',
        }}
        fontWeight={400}
        fontStyle="normal"
      />
    </Head>
    <Preview>{preview}</Preview>
    <Body style={body}>
      <Container style={container}>
        <Section style={header}>
          <Text style={wordmark}>Echoes</Text>
        </Section>

        <Section style={card}>{children}</Section>

        <Section style={footer}>
          <Hr style={divider} />
          <Text style={footerText}>Você está recebendo este email porque tem uma conta no Echoes.</Text>
          <Text style={footerText}>
            <Link href="https://echoes.app" style={footerLink}>
              echoes.app
            </Link>
            {' · '}
            Citações que ressoam.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const body: React.CSSProperties = {
  backgroundColor: colors.bg,
  fontFamily: fonts.sans,
  margin: 0,
  padding: '40px 16px',
};

const container: React.CSSProperties = {
  margin: '0 auto',
  maxWidth: '560px',
  width: '100%',
};

const header: React.CSSProperties = {
  padding: '0 0 32px',
  textAlign: 'center',
};

const wordmark: React.CSSProperties = {
  color: colors.clay,
  fontFamily: fonts.serif,
  fontSize: '32px',
  fontStyle: 'italic',
  fontWeight: 400,
  letterSpacing: '0.02em',
  margin: 0,
};

const card: React.CSSProperties = {
  backgroundColor: colors.surface,
  border: `1px solid ${colors.border}`,
  borderRadius: '12px',
  padding: '48px 40px',
};

const footer: React.CSSProperties = {
  padding: '32px 0 0',
  textAlign: 'center',
};

const divider: React.CSSProperties = {
  border: 0,
  borderTop: `1px solid ${colors.border}`,
  margin: '0 0 24px',
};

const footerText: React.CSSProperties = {
  color: colors.muted,
  fontFamily: fonts.sans,
  fontSize: '12px',
  lineHeight: '20px',
  margin: '4px 0',
};

const footerLink: React.CSSProperties = {
  color: colors.clay,
  textDecoration: 'none',
};

export const emailTheme = { colors, fonts };
