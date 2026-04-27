import { Heading, Section, Text } from '@react-email/components';
import * as React from 'react';
import { BaseEmail, emailTheme } from './_components/base-email';

const { colors, fonts } = emailTheme;

export const EmailConfirmedEmail = () => (
  <BaseEmail preview="Seu email está confirmado. Bem-vindo ao Echoes.">
    <Heading style={heading}>Tudo certo</Heading>

    <Text style={paragraph}>
      Seu email está confirmado. Agora você pode salvar citações, criar coleções e acompanhar vozes que ressoam com
      você.
    </Text>

    <Section style={quoteWrapper}>
      <Text style={quoteMark}>“</Text>
      <Text style={quoteText}>As palavras certas, no momento certo, mudam tudo.</Text>
      <Text style={quoteAuthor}>— bem-vindo ao Echoes</Text>
    </Section>

    <Text style={paragraph}>
      Toda vez que você guardar uma citação aqui, ela vai estar esperando — minimal, calma, sua.
    </Text>
  </BaseEmail>
);

EmailConfirmedEmail.PreviewProps = {};

export default EmailConfirmedEmail;

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

const quoteWrapper: React.CSSProperties = {
  borderLeft: `3px solid ${colors.sage}`,
  margin: '0 0 32px',
  padding: '8px 0 8px 24px',
};

const quoteMark: React.CSSProperties = {
  color: colors.sage,
  fontFamily: fonts.serif,
  fontSize: '48px',
  lineHeight: '24px',
  margin: '0 0 8px',
};

const quoteText: React.CSSProperties = {
  color: colors.text,
  fontFamily: fonts.serif,
  fontSize: '20px',
  fontStyle: 'italic',
  lineHeight: '32px',
  margin: '0 0 8px',
};

const quoteAuthor: React.CSSProperties = {
  color: colors.muted,
  fontFamily: fonts.sans,
  fontSize: '13px',
  letterSpacing: '0.05em',
  margin: 0,
  textTransform: 'uppercase',
};
