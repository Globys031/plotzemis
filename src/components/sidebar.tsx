import React, { useState } from 'react';
import { Component } from "react";
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { SidebarDataUser } from '../global/sidebarDataUser';
import { SidebarDataGuest } from '../global/sidebarDataGuest';
import SubMenu from './subMenu';
import { IconContext } from 'react-icons/lib';

import {userContext} from '../user/userContext';

const Nav = styled.div`
height: 80px;
display: flex;
justify-content: flex-start;
align-items: center;
`;

const NavIcon = styled(Link)`
margin-left: 2rem;
margin-right: 2rem;
font-size: 2rem;
height: 80px;
display: flex;
justify-content: flex-start;
align-items: center;
`;

const SidebarNav = styled.nav<{ sidebar: boolean }>`
background: #15171c;
width: 250px;
height: 100vh;
display: flex;
justify-content: center;
position: fixed;
top: 96;
left: ${({ sidebar }) => (sidebar ? '0' : '-100%')};
transition: 350ms;
z-index: 10;
`;

const SidebarWrap = styled.div`
width: 100%;
overflow: scroll;
overflow-x: hidden;
`;

type Props = {};

type State = {
  sidebar: boolean,
}

export default class Sidebar extends Component<Props, State> {
  static contextType = userContext;
  declare context: React.ContextType<typeof userContext>

  constructor(props: Props) {
    super(props);

    this.state = { 
      sidebar: false,
    };
  }

  handleClose = () => this.setState({sidebar: false})
  handleShow = () => this.setState({sidebar: true})

  render() {
    const { sidebar } = this.state;
    return (
      <div>
      <IconContext.Provider value={{ color: '#fff' }}>
        <Nav>
          <NavIcon to='#'>
            <FaIcons.FaBars onClick={this.handleShow} />
          </NavIcon>
        </Nav>
        <SidebarNav sidebar={sidebar}>
          <SidebarWrap>
            <NavIcon to='#'>
              <AiIcons.AiOutlineClose onClick={this.handleClose} />
            </NavIcon>
            {/* {SidebarData.map((item, index) => {
              return <SubMenu item={item} key={index} />;
            })} */}

            {this.context.user ? ( 
              SidebarDataUser.map((item, index) => {
                return <SubMenu item={item} key={index} />;
              })
            ) : (
              SidebarDataGuest.map((item, index) => {
                return <SubMenu item={item} key={index} />;
              })
            )}
          </SidebarWrap>
        </SidebarNav>
      </IconContext.Provider>
      </div>
    )
  }

}