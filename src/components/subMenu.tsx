import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import MediaQuery from 'react-responsive'

const SidebarLink = styled(Link)`
  display: flex;
  color: #e1e9fc;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  list-style: none;
  height: 3.75rem;
  text-decoration: none;
  font-size: 1.125rem;
  &:hover {
    background: #252831;
    border-left: 0.25rem solid #632ce4;
    cursor: pointer;
  }
`;

const SidebarLinkMobile = styled(Link)`
  display: flex;
  color: #e1e9fc;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  list-style: none;
  height: 3.75rem;
  text-decoration: none;
  font-size: 2.125rem;
  &:hover {
    background: #252831;
    border-left: 0.25rem solid #632ce4;
    cursor: pointer;
  }
`;

const SidebarLabel = styled.span`
  margin-left: 16px;
`;

const DropdownLink = styled(Link)`
  background: #414757;
  height: 3.75rem;
  padding-left: 3rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #f5f5f5;
  font-size: 1.125rem;
  &:hover {
    background: #632ce4;
    cursor: pointer;
  }
`;

const DropdownLinkMobile = styled(Link)`
  background: #414757;
  height: 3.75rem;
  padding-left: 3rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #f5f5f5;
  font-size: 2.125rem;
  &:hover {
    background: #632ce4;
    cursor: pointer;
  }
`;

const SubMenu = ({ item }: any) => {
  const [subnav, setSubnav] = useState(false);

  const showSubnav = () => setSubnav(!subnav);

  return (
    <>
      <MediaQuery minWidth={1000}>
        <SidebarLink to={item.path} onClick={item.subNav && showSubnav}>
          <div>
            {item.icon}
            <SidebarLabel>{item.title}</SidebarLabel>
          </div>
          <div>
            {item.subNav && subnav
              ? item.iconOpened
              : item.subNav
              ? item.iconClosed
              : null}
          </div>
        </SidebarLink>
        {subnav &&
          item.subNav.map((item: any, index: any) => {
            return (
              <DropdownLink to={item.path} key={index}>
                {item.icon}
                <SidebarLabel>{item.title}</SidebarLabel>
              </DropdownLink>
            );
          })}
      </MediaQuery>


      <MediaQuery maxWidth={1000}>
        <SidebarLinkMobile to={item.path} onClick={item.subNav && showSubnav}>
          <div>
            {item.icon}
            <SidebarLabel>{item.title}</SidebarLabel>
          </div>
          <div className="mobile-font">
            {item.subNav && subnav
              ? item.iconOpened
              : item.subNav
              ? item.iconClosed
              : null}
          </div>
        </SidebarLinkMobile>
        {subnav &&
          item.subNav.map((item: any, index: any) => {
            return (
              <DropdownLinkMobile to={item.path} key={index}>
                {item.icon}
                <SidebarLabel>{item.title}</SidebarLabel>
              </DropdownLinkMobile>
            );
          })}
      </MediaQuery>
    </>
  );
};

export default SubMenu;