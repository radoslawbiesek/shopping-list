'use client';

import React from 'react';
import NextLink from 'next/link';

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Link,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  DropdownSection,
} from '@nextui-org/react';

import * as authActions from 'actions/auth.actions';

const menuItems = [{ label: 'Moje listy', href: '/lists' }] as const;

type NavigationProps = {
  name: string;
};

export function Navigation({ name }: NavigationProps) {
  const [, startTransition] = React.useTransition();

  const onLogout = async () => {
    startTransition(async () => {
      await authActions.logout();
    });
  };

  return (
    <Navbar>
      <NavbarContent justify="start">
        <NavbarMenuToggle />
      </NavbarContent>
      <NavbarContent justify="center">
        <NavbarBrand>
          <p className="text-xl font-bold tracking-wider text-inherit">Listonix</p>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="primary"
              name={name[0]?.toUpperCase()}
              size="sm"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownSection
              classNames={{ heading: 'font-bold text-sm' }}
              title={`Zalogowany jako ${name}`}
            >
              <DropdownItem key="logout" color="danger" onPress={onLogout}>
                Wyloguj
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.href}-${index}`}>
            <Link color="primary" className="w-full" href={item.href} as={NextLink} size="lg">
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem>
          <Link color="danger" className="w-full" size="lg" onPress={onLogout}>
            Wyloguj
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
