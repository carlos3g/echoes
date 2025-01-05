import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

interface LogoProps extends SvgProps {}

export const Logo: React.FC<LogoProps> = (props) => (
  <Svg width={346} height={452} viewBox="0 0 346 452" fill="#000" {...props}>
    <Path d="M37.832 451.28c-24.576 0-36.864-9.556-36.864-28.672 0-4.096 1.365-11.604 4.096-22.528L113.608 53.968c6.827-21.845 15.019-36.181 24.576-43.008C147.741 4.133 164.125.72 187.336.72h106.496c34.133 0 51.2 10.24 51.2 30.72 0 8.192-3.413 20.48-10.24 36.864l-147.456 348.16c-5.461 12.288-12.971 21.164-22.528 26.624-8.192 5.46-20.48 8.192-36.864 8.192H37.832z" />
  </Svg>
);
