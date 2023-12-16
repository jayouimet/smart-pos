import { Box, BoxProps, Flex, Grid, GridItem } from '@chakra-ui/react';
import {
  LinkItemProps,
  NavItem,
} from '@components/navigation/DashboardSidebar';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { Fragment } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { SystemRoles } from '@type/roles/SystemRoles';

interface MenuButtonProps extends BoxProps {
  LinkItems: Array<LinkItemProps>;
  isButtonClicked: boolean;
  showAdditionalBox: boolean;
  LinkItemOnClick: (href: string) => void;
  onMenuClick: () => void;
}

const MenuButton = ({
  isButtonClicked,
  showAdditionalBox,
  LinkItems,
  LinkItemOnClick,
  onMenuClick,
  ...rest
}: MenuButtonProps) => {
  const { data: session } = useSession();

  return (
    <Fragment>
      {/* OVERLAY to close the menu when clicking outside of it */}
      {isButtonClicked && (
        <Box
          as="button"
          position={'fixed'}
          width={'100%'}
          height={'100vh'}
          top={0}
          left={0}
          zIndex={-1}
          onClick={onMenuClick}
        />
      )}

      {/* MENU BUTTON */}
      <Box
        as="button"
        aria-label="open menu"
        borderRadius={7}
        h={12}
        w={12}
        p={1}
        background={
          isButtonClicked ? 'whiteAlpha.400' : 'brand.primary.gray.700'
        }
        zIndex={2}
        onClick={onMenuClick}
        {...rest}
      >
        <Grid
          templateRows={'repeat(2, 1fr)'}
          templateColumns="repeat(2, 1fr)"
          gap={2}
        >
          {[...Array(4)].map((_, index) => (
            <GridItem
              key={index}
              aspectRatio={1}
              borderRadius={5}
              bg="brand.primary.gray.800"
            />
          ))}
        </Grid>
      </Box>

      {/* SUBMENU*/}
      {showAdditionalBox && (
        <Box
          position="absolute"
          bottom={1}
          left={2}
          width={'calc(100% - 16px)'}
          height="210%"
          borderRadius={7}
          bg="rgba(255, 255, 255, 0.2)"
          backdropFilter={'blur(10px)'}
          zIndex={1}
        >
          <Flex
            alignItems="center"
            direction="row"
            color={'whiteAlpha.900'}
            mx={2}
            my={2.5}
            gap={3}
            h={14}
          >
            {LinkItems.map((link: any) => {
              if (
                (link.minRole === SystemRoles.ADMIN &&
                  session?.user.role === SystemRoles.ADMIN) ||
                link.minRole === SystemRoles.USER
              )
                return (
                  <Box
                    key={link.name}
                    onClick={() => LinkItemOnClick(link.href)}
                  >
                    <NavItem key={link.name} icon={link.icon} />
                  </Box>
                );
            })}
          </Flex>
          <Box
            position="absolute"
            top="7.5px"
            right="10px"
            color={'whiteAlpha.900'}
          >
            <Box
              as="button"
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                event.stopPropagation();
                signOut();
              }}
            >
              <NavItem key={'Logout'} icon={FiLogOut} />
            </Box>
          </Box>
        </Box>
      )}
    </Fragment>
  );
};

export default MenuButton;
