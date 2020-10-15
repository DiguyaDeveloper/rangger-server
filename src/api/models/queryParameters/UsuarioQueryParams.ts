import { FindConditions, FindManyOptions, Like } from 'typeorm';

import Pagination from '../../shared/Pagination';
import Specification from '../../shared/Specification';
import { User } from '../user-models/User.model';

export default class UsuarioQueryParams extends Pagination implements Specification<User> {
  lastname?: string;

  getOptions(): FindManyOptions<User> {
    const where: FindConditions<User> = {};

    if (this.lastname) {
      where.lastname = Like(`%${this.lastname}%`);
    }

    return this.paginate({
        where
    });
  }
}
