'use client';

import React from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from '@nextui-org/react';

import * as authActions from 'actions/auth.actions';

const menuItems: readonly { label: string; href: string }[] = [
  { label: 'Listy', href: '/lists' },
  { label: 'Produkty', href: '/products' },
  { label: 'Kategorie', href: '/categories' },
] as const;

type NavigationProps = {
  name: string;
};

export function Navigation({ name }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [, startTransition] = React.useTransition();
  const pathname = usePathname();

  const onLogout = async () => {
    startTransition(async () => {
      setIsMenuOpen(false);
      await authActions.logout();
    });
  };

  return (
    <Navbar isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} maxWidth="full">
      <NavbarContent justify="start">
        <NavbarMenuToggle aria-label={isMenuOpen ? 'Zamknij menu' : 'Otwórz menu'} />
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
            <DropdownItem isReadOnly className="h-14 gap-2">
              <p className="font-semibold">Zalogowany jako</p>
              <p className="font-semibold">{name}</p>
            </DropdownItem>
            <DropdownItem color="danger" onPress={onLogout}>
              Wyloguj
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.href}-${index}`}>
            <Link
              color={pathname.includes(item.href) ? 'primary' : 'foreground'}
              className="h-full w-full py-1"
              href={item.href}
              as={NextLink}
              size="lg"
              onPress={() => setTimeout(() => setIsMenuOpen(false), 200)}
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem>
          <Link color="danger" className="w-full py-1" size="lg" onPress={onLogout}>
            Wyloguj
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
