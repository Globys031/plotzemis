import React, { useState } from 'react';
import { FaHockeyPuck } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from './sidebar';

const SidebarLink = styled(Link)`
  display: flex;
  color: #e1e9fc;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  list-style: none;
  height: 60px;
  text-decoration: none;
  font-size: 18px;
  &:hover {
    background: #252831;
    border-left: 4px solid #632ce4;
    cursor: pointer;
  }
`;

const SidebarLabel = styled.span`
  margin-left: 16px;
`;

const DropdownLink = styled(Link)`
  background: #414757;
  height: 60px;
  padding-left: 3rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #f5f5f5;
  font-size: 18px;
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
    </>
  );
};

export default SubMenu;



// import React, { useState } from 'react';
// import { Component } from "react";
// import styled from 'styled-components';
// import { Link } from 'react-router-dom';
// import * as FaIcons from 'react-icons/fa';
// import * as AiIcons from 'react-icons/ai';
// import { SidebarDataUser } from '../global/sidebarDataUser';
// import { SidebarDataGuest } from '../global/sidebarDataGuest';
// import { IconContext } from 'react-icons/lib';

// const SidebarLink = styled(Link)`
//   display: flex;
//   color: #e1e9fc;
//   justify-content: space-between;
//   align-items: center;
//   padding: 20px;
//   list-style: none;
//   height: 60px;
//   text-decoration: none;
//   font-size: 18px;
//   &:hover {
//     background: #252831;
//     border-left: 4px solid #632ce4;
//     cursor: pointer;
//   }
// `;

// const SidebarLabel = styled.span`
//   margin-left: 16px;
// `;

// const DropdownLink = styled(Link)`
//   background: #414757;
//   height: 60px;
//   padding-left: 3rem;
//   display: flex;
//   align-items: center;
//   text-decoration: none;
//   color: #f5f5f5;
//   font-size: 18px;
//   &:hover {
//     background: #632ce4;
//     cursor: pointer;
//   }
// `;

// type Props = {};

// type State = {
//   subnav: boolean,
// }

// export default class SubMenu extends Component<Props, State> {
//   constructor(props: Props) {
//     super(props);
//     this.state = { 
//       subnav: false,
//     };
//   }

//   handleClose = () => this.setState({subnav: false})
//   handleShow = () => this.setState({subnav: true})

//   render() {
//     const { subnav } = this.state;

//     return (
//       <>
//         <SidebarLink to={this.props.item.path} onClick={item.subNav && showSubnav}>
//           <div>
//             {item.icon}
//             <SidebarLabel>{item.title}</SidebarLabel>
//           </div>
//           <div>
//             {item.subNav && subnav
//               ? item.iconOpened
//               : item.subNav
//               ? item.iconClosed
//               : null}
//           </div>
//         </SidebarLink>
//         {subnav &&
//           item.subNav.map((item: any, index: any) => {
//             return (
//               <DropdownLink to={item.path} key={index}>
//                 {item.icon}
//                 <SidebarLabel>{item.title}</SidebarLabel>
//               </DropdownLink>
//             );
//           })}
//       </>
//     );
//   }

// }