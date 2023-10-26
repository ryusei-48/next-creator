import JP from './flags-svg/jp.svg';
import US from './flags-svg/us.svg';

const flagsSVG: {[key in AcceptLocales]: any} = {
  ja: JP, en: US
}

export type FlagsSVG = typeof flagsSVG;
export default flagsSVG;