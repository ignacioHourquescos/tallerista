// MenuContent.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { Layout, Menu } from 'antd';
import { useRouter } from 'next/router';
import { LiaFileInvoiceDollarSolid } from 'react-icons/lia';
import { PiShoppingCartSimpleThin } from 'react-icons/pi';
import { PiListDashesLight } from 'react-icons/pi';
import { PiHouseThin } from 'react-icons/pi';
import { LogoutOutlined } from '@ant-design/icons';
import { TabBar } from 'antd-mobile';
import {
  HomeOutlined,
  ShoppingCartOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { StyledMenu, StyledMobileMenu } from './styles';

export interface IMenu {
  isMobile: boolean;
}

const MenuContent: React.FC<IMenu> = ({ isMobile }) => {
  const { Header } = Layout;
  const router = useRouter();
  const [current, setCurrent] = useState<string | undefined>();

  const pushRouter = (element: string) => {
    router.push(element);
    console.log(element);
  };

  const selectedMenuItemHandler = (e: any) => {
    console.log('click ', e.key);
    setCurrent(e.key);
  };

  // Check if localStorage is available before using it
  const clientJson: string | null =
    typeof localStorage !== 'undefined'
      ? localStorage?.getItem('client')
      : null;
  const client: any = clientJson ? JSON.parse(clientJson)?.name : null;

  const handleLogout = () => {
    localStorage.removeItem('client');
    localStorage.removeItem('auth_tenant');
    router.push('/');
  };

  const tabs = [
    {
      key: '/',
      title: 'HOME',
      icon: <HomeOutlined />,
    },
  ];

  return (
    <>
      {isMobile ? (
        <TabBar
          style={{
            position: 'fixed',
            zIndex: '1000',
            bottom: 0,
            width: '100%',
            background: '#001529',
            height: '50px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
          }}
          activeKey={router.pathname}
          onChange={(key) => {
            if (key === 'logout') {
              handleLogout();
            } else {
              router.push(key);
            }
          }}
        >
          {tabs.map((item) => (
            <TabBar.Item
              key={item.key}
              icon={item.icon}
              title={item.title}
              style={{}}
            />
          ))}
        </TabBar>
      ) : (
        <StyledMenu.Inner>
          <StyledMenu.Header>{client}</StyledMenu.Header>
          <Link href={'/'}>
            <div>
              <StyledMenu.Icon>
                <PiHouseThin size={22} />
                <StyledMenu.Title>HOME</StyledMenu.Title>
              </StyledMenu.Icon>
            </div>
          </Link>
          <div style={{ flex: 1 }} />
        </StyledMenu.Inner>
      )}
    </>
  );
};

export default MenuContent;
