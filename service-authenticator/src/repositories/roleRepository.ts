import { InputRoleInterface, RoleInterface } from '../interfaces';
import Model from '../models';
import { BaseRepository } from './baseRepository';

export class RoleRepository extends BaseRepository<
  InputRoleInterface,
  RoleInterface
> {
	constructor() {
		super(Model.Role);
	}
}