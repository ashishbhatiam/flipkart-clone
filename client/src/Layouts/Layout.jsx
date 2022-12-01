import React, { useState } from 'react'
import Drawer from './Drawer/Drawer'
import Header from './Header/Header'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import { matchPath, useLocation } from 'react-router-dom'

const drawerWidth = 240
const mdTheme = createTheme()

const Layout = props => {
  const [open, setOpen] = useState(true)
  const toggleDrawer = () => {
    setOpen(!open)
  }
  const { pathname } = useLocation()
  const isPathMatch = () => {
    return matchPath('/', pathname) ? true : false
  }
  const isFakeAuthenticated = isPathMatch()

  return (
    <>
      <ThemeProvider theme={mdTheme}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          {isFakeAuthenticated ? (
            <>
              <Header
                open={open}
                toggleDrawer={toggleDrawer}
                drawerWidth={drawerWidth}
              />
              <Drawer
                open={open}
                toggleDrawer={toggleDrawer}
                drawerWidth={drawerWidth}
              />
              <Box
                component='main'
                sx={{
                  backgroundColor: theme =>
                    theme.palette.mode === 'light'
                      ? theme.palette.grey[100]
                      : theme.palette.grey[900],
                  flexGrow: 1,
                  height: 'calc(100vh - 64px)',
                  overflowX: 'hidden',
                  overflowY: 'auto',
                  marginTop: '64px',
                  padding: '10px 0 0 10px'
                }}
              >
                {props.children}
              </Box>
            </>
          ) : (
            <>{props.children}</>
          )}
        </Box>
      </ThemeProvider>
    </>
  )
}

export default Layout
