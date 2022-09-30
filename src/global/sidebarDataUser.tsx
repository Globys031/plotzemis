import React from 'react';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as SiIcons from 'react-icons/si';
import * as GiIcons from 'react-icons/gi';

export const SidebarDataUser = [
  {
    title: 'Streets',
    path: '/street/list',
    icon: <SiIcons.SiGooglestreetview />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Create',
        path: '/street/create',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'Read',
        path: '/street/read',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'Update',
        path: '/street/update',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'Delete',
        path: '/street/delete',
        icon: <IoIcons.IoIosPaper />
      },
    ]
  },
  {
    title: 'Plots',
    path: '/plot/list',
    icon: <GiIcons.GiPlainSquare />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Create',
        path: '/plot/create',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'Read',
        path: '/plot/read',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'Update',
        path: '/plot/update',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'Delete',
        path: '/plot/delete',
        icon: <IoIcons.IoIosPaper />
      },
    ]
  },
  {
    title: 'Buildings',
    path: '/building/list',
    icon: <AiIcons.AiFillHome />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Create',
        path: '/building/create',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'Read',
        path: '/building/read',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'Update',
        path: '/building/update',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'Delete',
        path: '/building/delete',
        icon: <IoIcons.IoIosPaper />
      },
    ]
  },
];