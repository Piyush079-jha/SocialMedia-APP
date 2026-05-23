import React from 'react';
import Topbar from '../components/Topbar';
import Notifications from '../components/Notifications';
import CreatePost from '../components/CreatePost';

export { default as Topbar } from '../components/Topbar';

// Wrapper HOC that adds Topbar + Notifications + CreatePost to any page
const WithTopbar = ({ children }) => (
  <>
    <Topbar />
    {children}
    <Notifications />
    <CreatePost />
  </>
);

export default WithTopbar;
