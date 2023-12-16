'use client';

import {
  IconButton,
  Avatar,
  Box,
  Flex,
  Icon,
  useDisclosure,
  BoxProps,
  FlexProps,
  Stack,
} from '@chakra-ui/react';
import { FiHome, FiLayers, FiUsers, FiLogOut, FiCpu, FiBox } from 'react-icons/fi';
import { IconType } from 'react-icons';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import { CloseIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/navigation';
import MenuButton from '@components/navigation/MenuButton';
import { SystemRoles } from 'types/roles/SystemRoles';

export interface LinkItemProps {
  name: string;
  icon: IconType;
  href: string;
  minRole: SystemRoles;
}

interface NavItemProps extends FlexProps {
  icon?: IconType;
}

interface MobileProps extends BoxProps {
  onOpen: () => void;
  onClose: () => void;
  onOpenModal: () => void;
  onCloseModal: () => void;
  onNavigation: (url: string) => void;
  isOpenModal: boolean;
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
  onOpenModal: () => void;
  onCloseModal: () => void;
  onNavigation: (url: string) => void;
  isOpenModal: boolean;
}

interface DashboardSidebarProps extends BoxProps {
  children: React.ReactNode;
}

const LinkItems: Array<LinkItemProps> = [
  { 
    name: 'Home', 
    icon: FiHome, 
    href: '/dashboard', 
    minRole: SystemRoles.USER 
  },
  {
    name: 'Organizations',
    icon: FiUsers,
    href: '/dashboard/organizations',
    minRole: SystemRoles.ADMIN,
  },
  {
    name: 'Products',
    icon: FiBox,
    href: '/dashboard/products',
    minRole: SystemRoles.ADMIN,
  },
  {
    name: 'Categories',
    icon: FiLayers,
    href: '/dashboard/categories',
    minRole: SystemRoles.ADMIN,
  },
];

const SidebarContent = ({
  onClose,
  onOpenModal,
  onCloseModal,
  isOpenModal,
  onNavigation,
  ...rest
}: SidebarProps) => {
  const { data: session } = useSession();

  return (
    <Box pos="fixed" py={{ base: 3, xl: 5 }} h="full" {...rest}>
      <Flex
        transition="3s ease"
        bg={'whiteAlpha.400'}
        ml={{ base: 3, xl: 5 }}
        p={2}
        borderRadius="30px"
        align="center"
        direction={'column'}
        justify="space-between"
        w={{ base: 'full', md: 16 }}
        h="full"
      >
        {/* LOGO */}
        <Stack>
          <Box
            as="button"
            mb={4}
            onClick={() => {
              onNavigation('/profile');
            }}
          >
            <Avatar
              size={'full'}
              src={session?.user?.image ?? undefined}
              transition="300ms"
              _hover={{
                shadow: 'lightGreen',
              }}
            />
          </Box>

          {/* LINK ITEMS */}

          {LinkItems.map((link) => {
            if (
              (link.minRole === SystemRoles.ADMIN &&
                session?.user.role === SystemRoles.ADMIN) ||
              link.minRole === SystemRoles.USER
            )
              return (
                <Box
                  key={link.name}
                  onClick={() => {
                    onNavigation(link.href);
                  }}
                >
                  <NavItem key={link.name} icon={link.icon} />
                </Box>
              );
          })}

          {/* CATEGORIES ACCORDION */}
          {/* <Accordion allowToggle>
            <AccordionItem style={{ border: '0' }}>
              <h2>
                <Box px="4">
                  <AccordionButton
                    as="a"
                    width={'full'}
                    p="4"
                    borderRadius={'4px'}
                    cursor="pointer"
                    _hover={{
                      bg: 'brand.primary.green.300',
                      color: 'white',
                    }}
                  >
                    <Box as="span" flex="1" textAlign="left" width={'full'}>
                      <Icon
                        height={'4'}
                        width={'4'}
                        mr={'4'}
                        aria-label="open menu"
                        as={FiTool}
                      />
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </Box>
              </h2>
              <AccordionPanel>
                <Stack>
                  {categories.map((category) => (
                    <NavItem
                      key={category.name}
                      href={`/services/${category.slug}`}
                    />
                  ))}
                </Stack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion> */}
        </Stack>

        {/* CREATE CONTENT MENU */}

        {/* // LOGOUT*/}
        <Stack>
          <Box
            as="button"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.stopPropagation();
              signOut();
            }}
          >
            <NavItem key={'Logout'} icon={FiLogOut} />
          </Box>
        </Stack>
      </Flex>
    </Box>
  );
};

export const NavItem = ({ icon, ...rest }: NavItemProps) => {
  return (
    <Box style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        width={'full'}
        borderRadius="lg"
        role="group"
        {...rest}
      >
        <Box
          width={'full'}
          lineHeight={1}
          textAlign="center"
          p={2}
          mb={2}
          borderRadius={'full'}
          cursor="pointer"
          transition="300ms"
          _hover={{
            bg: 'brand.primary.green.300',
          }}
        >
          {icon && (
            <Icon
              fontSize="32"
              // mt={'1px'}
              _groupHover={{
                color: 'white',
              }}
              as={icon}
            />
          )}
        </Box>
      </Flex>
    </Box>
  );
};

const MobileNav = ({
  onNavigation,
  onOpen,
  onClose,
  onOpenModal,
  onCloseModal,
  isOpenModal,
  ...rest
}: MobileProps) => {
  const { data: session } = useSession();
  const [showAdditionalBox, setShowAdditionalBox] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  return (
    <Box
      position="fixed"
      bottom="0"
      zIndex="9999"
      bg="linear-gradient(to top, var(--chakra-colors-brand-bg-main) 75%, transparent 85%)"
      pt={5}
      px={3}
      w={'full'}
      {...rest}
    >
      <Flex
        mt={1}
        mb={3}
        mx={'auto'}
        px={3}
        py={1}
        width={'full'}
        alignItems="center"
        bg={'whiteAlpha.500'}
        borderRadius={20}
        justifyContent="space-between"
        position={'relative'}
      >
        <MenuButton
          isButtonClicked={isButtonClicked}
          showAdditionalBox={showAdditionalBox}
          LinkItems={LinkItems}
          LinkItemOnClick={(href: string) => {
            setShowAdditionalBox(!showAdditionalBox);
            setIsButtonClicked(!isButtonClicked);
            onNavigation(href);
          }}
          onMenuClick={() => {
            setShowAdditionalBox(!showAdditionalBox);
            setIsButtonClicked(!isButtonClicked);
          }}
        />

        <Box
          as="button"
          onClick={() => {
            onNavigation('/profile');
          }}
        >
          <Avatar
            size={'md'}
            src={session?.user?.image ?? undefined}
            transition="300ms"
            _hover={{
              shadow: { base: 'none', md: 'lightGreen' },
            }}
            _active={{
              shadow: 'lightGreen',
            }}
          />
        </Box>
      </Flex>
    </Box>
  );
};

const DashboardSidebar = ({ children, ...rest }: DashboardSidebarProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenModal,
    onOpen: onOpenModal,
    onClose: onCloseModal,
  } = useDisclosure();

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isOpenModal) {
      // Store the current scroll position
      const currentScrollY = window.scrollY;

      // Scroll to the top of the page
      window.scrollTo(0, 0);

      // Disable body scroll
      document.body.style.overflow = 'hidden';

      // Restore the previous scroll position when the modal is closed
      return () => {
        window.scrollTo(0, currentScrollY);
        document.body.style.overflow = 'auto';
      };
    } else {
      // Re-enable body scroll when the modal is closed
      document.body.style.overflow = 'auto';
    }
  }, [isOpenModal]);

  const onNavigation = (url: string) => {
    onClose();
    onCloseModal();
    router.push(url);
  };

  return (
    <Box minH="100vh" {...rest}>
      <SidebarContent
        onClose={onClose}
        isOpenModal={isOpenModal}
        onOpenModal={onOpenModal}
        onCloseModal={onCloseModal}
        onNavigation={onNavigation}
        display={{ base: 'none', md: 'block' }}
        zIndex="999"
      />
      <MobileNav
        onOpen={onOpen}
        display={{ base: 'flex', md: 'none' }}
        onNavigation={onNavigation}
        onClose={onClose}
        onOpenModal={onOpenModal}
        onCloseModal={onCloseModal}
        isOpenModal={isOpenModal}
      />
      <Box
        ml={{ base: 0, md: '80px', xl: '88px' }}
        px={{ base: 3, xl: 5 }}
        position={'relative'}
      >
        {isOpenModal && (
          // TODO create a context inside the navbar (or dashboard layout), to keep track of all state related to the Create Content Flow.
          // This way we can decide if we want to keep all the state when closing/opening the menu, or if we wish to reset them.
          // Note: Currently, it resets them because we mount/unmount the component
          <Box ml={{ base: -4, lg: -8 }} mt={{ base: 0, md: 0 }}>
            <Box
              background="rgba(80, 80, 80, 0.20)"
              backdropFilter="blur(100px)"
              position={'fixed'}
              top="0"
              right="0"
              w="100vw"
              h="100vh"
              zIndex={10}
            />
            <Flex
              position="absolute"
              w={'100%'}
              justifyContent="flex-end"
              p={4}
              zIndex={100}
            >
              <IconButton
                aria-label="Exit create menu"
                icon={<CloseIcon />}
                onClick={onCloseModal}
              />
            </Flex>
          </Box>
        )}
        {children}
      </Box>
    </Box>
  );
};

export default DashboardSidebar;
