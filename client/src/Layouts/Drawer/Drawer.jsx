import React from 'react'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import MuiDrawer from '@mui/material/Drawer'
import { styled } from '@mui/material/styles'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import AppRegistrationRoundedIcon from '@mui/icons-material/AppRegistrationRounded'
import LoginRoundedIcon from '@mui/icons-material/LoginRounded'
import { matchPath, useLocation, useNavigate } from 'react-router-dom'

const DrawerContainer = styled(MuiDrawer, {
  shouldForwardProp: prop => prop !== 'open'
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: 240,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9)
      }
    })
  }
}))

const routesList = [
  { label: 'Dashboard', icon: <DashboardRoundedIcon />, route: '/' },
  { label: 'Signup', icon: <AppRegistrationRoundedIcon />, route: '/signup' },
  { label: 'Login', icon: <LoginRoundedIcon />, route: '/login' }
]

const Drawer = props => {
  const { open, toggleDrawer } = props
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const isPathMatch = key => {
    return matchPath(key, pathname) ? true : false
  }

  return (
    <DrawerContainer variant='permanent' open={open}>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          px: [1]
        }}
      >
        <IconButton onClick={toggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List component='nav'>
        {routesList.map((route, index) => {
          return (
            <ListItemButton
              selected={isPathMatch(route.route)}
              key={index}
              onClick={() =>
                !isPathMatch(route.route) ? navigate(route.route) : null
              }
            >
              <ListItemIcon>{route.icon}</ListItemIcon>
              <ListItemText primary={route.label} />
            </ListItemButton>
          )
        })}
      </List>
    </DrawerContainer>
  )
}

export default Drawer
