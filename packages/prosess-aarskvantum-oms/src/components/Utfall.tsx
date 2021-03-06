import React from 'react';
import { UtfallEnum, Utfalltype } from '@k9-sak-web/types';
import { Image } from '@fpsak-frontend/shared-components';
import { FormattedMessage } from 'react-intl';
import innvilget from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import avslått from '@fpsak-frontend/assets/images/avslaatt_valgt.svg';
import advarsel from '@fpsak-frontend/assets/images/advarsel_ny.svg';
import styles from './aktivitetTabell.less';

type UtfallProps = {
  utfall: Utfalltype;
  textId?: string;
};

const utfallSymbolMap = {
  [UtfallEnum.INNVILGET]: innvilget,
  [UtfallEnum.AVSLÅTT]: avslått,
  [UtfallEnum.UAVKLART]: advarsel,
};

const Utfall: React.FunctionComponent<UtfallProps> = ({ utfall, textId }) => (
  <div>
    <span className={styles.utfallsikon}>
      <Image src={utfallSymbolMap[utfall]} />
    </span>
    <FormattedMessage id={textId || `Uttaksplan.Utfall.${utfall}`} />
  </div>
);

export default Utfall;
