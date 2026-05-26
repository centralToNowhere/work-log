import React from 'react';
import { Layout } from 'antd';
import { observer } from 'mobx-react-lite';
import styles from './CommonLayout.module.scss';

type CommonLayoutPorps = {
  headerTitle: React.ReactNode;
  headerExtra: React.ReactNode;
  children: React.ReactNode;
};

const { Content, Header } = Layout;

export const CommonLayout = observer(
  ({ headerTitle, headerExtra, children }: CommonLayoutPorps) => {
    return (
      <Layout className={styles.container}>
        <Header className={styles.header}>
          {headerTitle}
          {headerExtra}
        </Header>

        <Content>{children}</Content>
      </Layout>
    );
  },
);

export default CommonLayout;
