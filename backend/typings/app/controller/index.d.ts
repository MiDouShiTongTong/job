// This file is created by egg-ts-helper@1.25.2
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAccount from '../../../app/controller/account';
import ExportHome from '../../../app/controller/home';
import ExportUser from '../../../app/controller/user';

declare module 'egg' {
  interface IController {
    account: ExportAccount;
    home: ExportHome;
    user: ExportUser;
  }
}
