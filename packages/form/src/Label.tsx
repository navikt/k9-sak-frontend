import classnames from 'classnames/bind';
import { Undertekst, TypografiProps } from 'nav-frontend-typografi';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import styles from './label.less';
import LabelType from './LabelType';

const classNames = classnames.bind(styles);

interface LabelProps {
  input?: LabelType;
  typographyElement?: React.ComponentType<TypografiProps>;
  readOnly?: boolean;
}

export const Label = (props: LabelProps & WrappedComponentProps) => {
  const format = label => {
    if (label && label.id) {
      const { intl } = props;
      return intl.formatMessage({ id: label.id }, label.args);
    }
    return label;
  };

  const { input, readOnly, typographyElement: TypoElem } = props;
  if (!input) {
    return null;
  }
  return (
    <span className={classNames('labelWrapper', { readOnly })}>
      <TypoElem tag="span" className={styles.label}>
        {format(input)}
      </TypoElem>
    </span>
  );
};

Label.defaultProps = {
  input: null,
  typographyElement: Undertekst,
  readOnly: false,
};

export default injectIntl(Label);
