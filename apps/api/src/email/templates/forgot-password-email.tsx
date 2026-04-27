import { Heading, Section, Text } from '@react-email/components';
import * as React from 'react';
import { BaseEmail, emailTheme } from './_components/base-email';

const { colors, fonts } = emailTheme;

export interface ForgotPasswordEmailProps {
  token: string;
}

export const ForgotPasswordEmail = ({ token = '000000' }: ForgotPasswordEmailProps) => (
  <BaseEmail preview="Seu código de redefinição de senha">
    <Heading style={heading}>Redefinir senha</Heading>

    <Text style={paragraph}>
      Recebemos um pedido para redefinir a senha da sua conta. Use o código abaixo para continuar.
    </Text>

    <Section style={codeWrapper}>
      <Text style={code}>{token}</Text>
      <Text style={codeHint}>Expira em 1 hora</Text>
    </Section>

    <Text style={disclaimer}>
      Se você não solicitou esta redefinição, pode ignorar este email com segurança — sua senha permanece inalterada.
    </Text>
  </BaseEmail>
);

ForgotPasswordEmail.PreviewProps = {
  token: 'A3F7K9',
} satisfies ForgotPasswordEmailProps;

export default ForgotPasswordEmail;

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

const codeWrapper: React.CSSProperties = {
  backgroundColor: colors.bg,
  border: `1px solid ${colors.border}`,
  borderRadius: '10px',
  margin: '0 0 32px',
  padding: '28px 16px',
  textAlign: 'center',
};

const code: React.CSSProperties = {
  color: colors.clay,
  fontFamily: '"Courier New", monospace',
  fontSize: '32px',
  fontWeight: 700,
  letterSpacing: '0.4em',
  lineHeight: '40px',
  margin: '0 0 8px',
  paddingLeft: '0.4em',
};

const codeHint: React.CSSProperties = {
  color: colors.muted,
  fontFamily: fonts.sans,
  fontSize: '12px',
  letterSpacing: '0.05em',
  margin: 0,
  textTransform: 'uppercase',
};

const disclaimer: React.CSSProperties = {
  color: colors.muted,
  fontFamily: fonts.sans,
  fontSize: '13px',
  lineHeight: '22px',
  margin: 0,
};
