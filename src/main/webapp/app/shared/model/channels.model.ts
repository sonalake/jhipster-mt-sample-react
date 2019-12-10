import { IUser } from 'app/shared/model/user.model';
import { ICompany } from 'app/shared/model/company.model';

export interface IChannels {
  id?: number;
  name?: string;
  users?: IUser[];
  company?: ICompany;
}

export const defaultValue: Readonly<IChannels> = {};
