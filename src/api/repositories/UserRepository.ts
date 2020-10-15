import { EntityRepository, Repository } from 'typeorm';

import { User } from '../models/user-models/User.model';

@EntityRepository(User)
export class UserRepository extends Repository<User>  {

}
