import { SetMetadata } from '@nestjs/common';
import { ActorType } from '@ve_xe_nhanh_ts/shared-types';
import { ACTORS_KEY } from '../constants';

export const Actors = (...actors: ActorType[]) =>
  SetMetadata(ACTORS_KEY, actors);
