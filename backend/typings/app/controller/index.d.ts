// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg'; // Make sure ts to import egg declaration at first
import Account from '../../../app/controller/account';
import Home from '../../../app/controller/home';

declare module 'egg' {
  interface IController {
    account: Account;
    home: Home;
  }
}
