import s from '../../SCSS/profile.module.scss';

import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Navigate, NavLink, Route, Routes } from 'react-router-dom';


import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { logOutUser } from '../../Redux/login-reducer';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import BlockIcon from '@mui/icons-material/Block';
import UserPage from './user';
import TasksPage from './tasks';
import GoalsPage from './goals/goals';


const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
   ({ theme, open }) => ({
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
         easing: theme.transitions.easing.sharp,
         duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: `-${drawerWidth}px`,
      ...(open && {
         transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
         }),
         marginLeft: 0,
      }),
   }),
);

const AppBar = styled(MuiAppBar, {
   shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
   transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
   }),
   ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(['margin', 'width'], {
         easing: theme.transitions.easing.easeOut,
         duration: theme.transitions.duration.enteringScreen,
      }),
   }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
   display: 'flex',
   alignItems: 'center',
   padding: theme.spacing(0, 1),
   ...theme.mixins.toolbar,
   justifyContent: 'flex-end',
}));

let linkData = [
   ['Профиль', 'user', <AccountBoxIcon />], ['Задачи', 'tasks', <AssignmentTurnedInIcon />], ['Цели', 'goals', <AutoGraphIcon />]
]

export default function PersistentDrawerLeft() {
   const dispatch = useDispatch()


   const profileStatus = useSelector((state) => state.registerSlice.profileStatus)

   const logOUT = () => {
      dispatch(logOutUser(dispatch))
   }

   const theme = useTheme();
   const [open, setOpen] = useState(false);

   const handleDrawerOpen = () => {
      setOpen(true);
   };
   const handleDrawerClose = () => {
      setOpen(false);
   };

   if (!profileStatus) {
      return <Navigate to='/' />
   }
   return (
      <Box sx={{ display: 'flex' }}>
         <CssBaseline />
         <AppBar position="fixed" open={open}>
            <Toolbar>
               <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  edge="start"
                  sx={{ mr: 2, ...(open && { display: 'none' }) }}
               >
                  <MenuIcon />
               </IconButton>
               <Typography variant="h6" noWrap component="div">
                  Профиль пользователя
               </Typography>
            </Toolbar>
         </AppBar>
         <Drawer
            sx={{
               width: drawerWidth,
               flexShrink: 0,
               '& .MuiDrawer-paper': {
                  width: drawerWidth,
                  boxSizing: 'border-box',
               },
            }}
            variant="persistent"
            anchor="left"
            open={open}
         >
            <DrawerHeader>
               <IconButton onClick={handleDrawerClose}>
                  {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
               </IconButton>
            </DrawerHeader>
            <Divider />
            <List>

               {linkData.map((value, index) => (
                  <ListItem key={value[1]} disablePadding>
                     <NavLink to={`/profile/${value[1]}`} className={s.linkMenu}>
                        <ListItemButton>
                           <ListItemIcon>
                              {value[2]}
                           </ListItemIcon>
                           <div>{value[0]}</div>
                        </ListItemButton>
                     </NavLink>

                  </ListItem>
               ))}
            </List>
            <Divider />
            <List>
               {['Выход'].map((text, index) => (
                  <ListItem key={text} disablePadding>
                     <ListItemButton >
                        <ListItemIcon>
                           {text === 'Выход' && <BlockIcon />}
                        </ListItemIcon>
                        <ListItemText primary={text} onClick={logOUT} />
                     </ListItemButton>
                  </ListItem>
               ))}
            </List>
         </Drawer>
         <Main open={open}>
            <DrawerHeader />
            <Routes>
               <Route path="/user" element={<UserPage />} />
               <Route path="/tasks" element={<TasksPage />} />
               <Route path="/goals" element={<GoalsPage t={'t'} />} />
            </Routes>
         </Main>
      </Box>
   );
}
