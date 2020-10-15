import { Action } from 'routing-controllers';
import { Connection } from 'typeorm';

import { User } from '../api/models/user-models/User.model';

export function currentUserChecker(connection: Connection): (action: Action) => Promise<User | undefined> {
    return async function innerCurrentUserChecker(action: Action): Promise<User | undefined> {
        return action.request.user;
    };
}
