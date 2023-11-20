'use client';

import {
  IconButton,
  Avatar,
  Box,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
} from '@chakra-ui/react';
import {
  FiHome,
  FiMenu,
  FiChevronDown,
  FiLayers,
  FiLogOut,
  FiCpu,
  FiUser,
  FiUsers,
  FiBox,
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { useSession, signOut } from 'next-auth/react';
import { useEffect } from 'react';
import { Link } from '@chakra-ui/next-js';
import { capitalize } from '@utils/helperFunctions';
import { CloseIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/navigation';
import { POSUserRoles } from 'types/POSUserRoles';

interface LinkItemProps {
  name: string;
  icon: IconType;
  href: string;
  minRole: POSUserRoles;
}

interface NavItemProps extends FlexProps {
  icon?: IconType;
}

interface MobileProps extends FlexProps {
  onOpen: () => void;
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
  { name: 'Home', icon: FiHome, href: '/dashboard/', minRole: POSUserRoles.USER },
  { name: 'Profile', icon: FiUser, href: '/dashboard/profile', minRole: POSUserRoles.USER },
  {
    name: 'Organizations',
    icon: FiUsers,
    href: '/dashboard/organizations',
    minRole: POSUserRoles.ADMIN,
  },
  {
    name: 'Categories',
    icon: FiLayers,
    href: '/dashboard/categories',
    minRole: POSUserRoles.ADMIN,
  },
  {
    name: 'Items',
    icon: FiBox,
    href: '/dashboard/items',
    minRole: POSUserRoles.ADMIN,
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
    <Box pos="fixed" py={6} h="full" {...rest}>
      <Flex
        transition="3s ease"
        bg={'rgba(255, 255, 255, 0.30)'}
        ml={6}
        p={4}
        borderRadius="30px"
        align="center"
        direction={'column'}
        justify="space-between"
        w={{ base: 'full', md: 24 }}
        h="full"
      >
        {/* LOGO */}
        <Stack>
          <Box
            as="button"
            mb={4}
            transition="300ms"
            _hover={{
              bg: 'brand.primary.green.300',
              color: 'white',
            }}
            p={1}
            borderRadius="full"
            onClick={() => {
              onNavigation('/dashboard/profile');
            }}
          >
            <Avatar size={'lg'} src={session?.user?.image ?? undefined} />
          </Box>

          {/* LINK ITEMS */}

          {LinkItems.map((link) => {
              return (
                <Box
                  onClick={() => {
                    onNavigation(link.href);
                  }}
                >
                  <NavItem key={link.name} icon={link?.icon}/>
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
                      href={`/dashboard/services/${category.slug}`}
                    />
                  ))}
                </Stack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion> */}
        </Stack>

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

const NavItem = ({ icon, ...rest }: NavItemProps) => {
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
          p="4"
          borderRadius={'full'}
          cursor="pointer"
          transition="300ms"
          _hover={{
            bg: 'brand.primary.green.300',
            color: 'white',
          }}
        >
          {icon && (
            <Icon
              fontSize="32"
              mt={'1px'}
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

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const { data: session } = useSession();

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={'brand.bg.main'}
      borderBottomWidth="1px"
      borderBottomColor={'whiteAlpha.500'}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      {/*<Box h={30} w={161} pos={'relative'} display={{ md: 'none' }}>
        <NextImage src={logo} alt="My Picture" fill />
      </Box>*/}

      <HStack spacing={{ base: '0', md: '6' }}>
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}
            >
              <HStack>
                <Avatar size={'sm'} src={session?.user?.image ?? undefined} />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">{session?.user?.name}</Text>
                  <Text fontSize="xs" color="gray.500">
                    {session?.user?.role ? capitalize(session?.user?.role) : ''}
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList bg={'gray.900'} borderColor={'whiteAlpha.500'}>
              <Link href={'/dashboard/profile'}>
                <MenuItem>Profile</MenuItem>
              </Link>
              <MenuDivider />
              <MenuItem
                onClick={() => {
                  signOut();
                }}
              >
                Sign out
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
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
        zIndex="9999"
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent
            onClose={onClose}
            isOpenModal={isOpenModal}
            onOpenModal={onOpenModal}
            onCloseModal={onCloseModal}
            onNavigation={onNavigation}
          />
          <Box
            as="button"
            position={'absolute'}
            top={5}
            right={5}
            onClick={onClose}
          >
            <CloseIcon />
          </Box>
        </DrawerContent>
      </Drawer>
      <MobileNav onOpen={onOpen} display={{ base: 'flex', md: 'none' }} />
      <Box
        ml={{ base: 0, md: '120px' }}
        py={4}
        px={{ base: 4, lg: 8 }}
        position={'relative'}
      >
        {isOpenModal && (
          // TODO create a context inside the navbar (or dashboard layout), to keep track of all state related to the Create Content Flow.
          // This way we can decide if we want to keep all the state when closing/opening the menu, or if we wish to reset them.
          // Note: Currently, it resets them because we mount/unmount the component
          <Box ml={{ base: -4, lg: -8 }} mt={{ base: -20, md: 0 }}>
            <Box
              background="rgba(0, 0, 0, 0.5)"
              backdropFilter="blur(20px)"
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
