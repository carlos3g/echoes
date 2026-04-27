import { Button, Heading, Link, Section, Text } from '@react-email/components';
import * as React from 'react';
import { BaseEmail, emailTheme } from './_components/base-email';

const { colors, fonts } = emailTheme;

export interface EmailConfirmationEmailProps {
  link: string;
}

export const EmailConfirmationEmail = ({
  link = 'https://echoes.app/auth/email/confirm/preview',
}: EmailConfirmationEmailProps) => (
  <BaseEmail preview="Confirme seu email para começar a usar o Echoes">
    <Heading style={heading}>Confirme seu email</Heading>

    <Text style={paragraph}>Bem-vindo ao Echoes. Estamos quase lá — só precisamos confirmar que este email é seu.</Text>

    <Section style={ctaWrapper}>
      <Button href={link} style={button}>
        Confirmar email
      </Button>
    </Section>

    <Text style={fallbackLabel}>Ou copie e cole este link no seu navegador:</Text>
    <Text style={fallbackLink}>
      <Link href={link} style={fallbackAnchor}>
        {link}
      </Link>
    </Text>

    <Text style={disclaimer}>Se você não criou uma conta no Echoes, pode ignorar este email com segurança.</Text>
  </BaseEmail>
);

EmailConfirmationEmail.PreviewProps = {
  link: 'https://echoes.app/auth/email/confirm/abc123def456',
} satisfies EmailConfirmationEmailProps;

export default EmailConfirmationEmail;

const heading: React.CSSProperties = {
  color: colors.text,
  fontFamily: fonts.serif,
  fontSize: '28px',
  fontWeight: 400,
  lineHeight: '36px',
  margin: '0 0 16px',
};

const paragraph: React.CSSProperties = {
  color: colors.text,
  fontFamily: fonts.sans,
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 32px',
};

const ctaWrapper: React.CSSProperties = {
  margin: '0 0 32px',
  textAlign: 'center',
};

const button: React.CSSProperties = {
  backgroundColor: colors.clay,
  borderRadius: '8px',
  color: '#ffffff',
  display: 'inline-block',
  fontFamily: fonts.sans,
  fontSize: '15px',
  fontWeight: 500,
  letterSpacing: '0.01em',
  padding: '14px 32px',
  textDecoration: 'none',
};

const fallbackLabel: React.CSSProperties = {
  color: colors.muted,
  fontFamily: fonts.sans,
  fontSize: '13px',
  lineHeight: '20px',
  margin: '0 0 4px',
};

const fallbackLink: React.CSSProperties = {
  fontFamily: fonts.sans,
  fontSize: '13px',
  lineHeight: '20px',
  margin: '0 0 32px',
  wordBreak: 'break-all',
};

const fallbackAnchor: React.CSSProperties = {
  color: colors.clay,
  textDecoration: 'underline',
};

const disclaimer: React.CSSProperties = {
  color: colors.muted,
  fontFamily: fonts.sans,
  fontSize: '13px',
  lineHeight: '22px',
  margin: 0,
};
