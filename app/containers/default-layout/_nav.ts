import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/',
    iconComponent: { name: 'cil-CreditCard' },
  },
  // {
  //   name: 'Transaction History',
  //   url: '/transaction-history',
  //   iconComponent: { name: 'cil-ShareBoxed' },
  // },
  {
    name: 'Publish Course',
    url: '/publish-course',
    iconComponent: { name: 'cil-ShareBoxed' },
  },
  {
    name: 'Manage Attachments',
    url: '/manage-attachments',
    iconComponent: { name: 'cil-paperclip' },
  },
  {
    name: 'Manage Enrollments',
    url: '/manage-enrollments',
    iconComponent: { name: 'cil-school' },
  },
  // {
  //   name: 'Buttons',
  //   url: '/buttons',
  //   iconComponent: { name: 'cil-cursor' },
  //   children: [
  //     {
  //       name: 'Buttons',
  //       url: '/buttons/buttons'
  //     },
  //     {
  //       name: 'Button groups',
  //       url: '/buttons/button-groups'
  //     },
  //     {
  //       name: 'Dropdowns',
  //       url: '/buttons/dropdowns'
  //     },
  //   ]
  // },
];
