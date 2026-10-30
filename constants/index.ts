export type NavLink = {
  label: string;
  route: string;
  roles?: ('admin' | 'creator' | 'user')[];
};

export const headerLinks: NavLink[] = [
  {
    label: 'Home',
    route: '/',
  },
  {
    label: 'Create Event',
    route: '/events/create',
    roles: ['admin', 'creator'],
  },
  {
    label: 'Become a Creator',
    route: '/creator-onboarding',
    roles: ['user'],
  },
  {
    label: 'Admin Portal',
    route: '/admin',
    roles: ['admin'],
  },
  {
    label: 'My Profile',
    route: '/profile',
  },
];

export const eventDefaultValues = {
  title: '',
  description: '',
  location: '',
  imageUrl: '',
  startDateTime: new Date(),
  endDateTime: new Date(),
  categoryId: '',
  price: '',
  isFree: false,
  url: '',
};
