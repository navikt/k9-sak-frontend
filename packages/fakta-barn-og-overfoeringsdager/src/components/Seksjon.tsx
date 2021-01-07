import React, { FunctionComponent } from 'react';
import { Image } from '@fpsak-frontend/shared-components/index';
import { Undertittel } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames/bind';
import styles from './seksjon.less';

const classNames = classnames.bind(styles);

interface SeksjonProps {
  imgSrc: string;
  title: {
    id: string;
    values?: any;
  };
  bakgrunn: 'grå' | 'hvit';
}

const Seksjon: FunctionComponent<SeksjonProps> = ({ imgSrc, title, bakgrunn, children }) => (
  <section className={classNames('seksjon', { grå: bakgrunn === 'grå' })}>
    <Undertittel tag="h3" className={styles.tittel}>
      <Image src={imgSrc} />
      <FormattedMessage id={title.id} values={title.values} />
    </Undertittel>
    {children}
  </section>
);

export default Seksjon;
