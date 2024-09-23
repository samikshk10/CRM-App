import {
  ContactNoteInterface,
  InputContactNoteInterface,
} from '@src/interfaces';
import { BaseRepository } from '.';
import Model from '@src/models';

export class ContactNoteRepository extends BaseRepository<
  InputContactNoteInterface,
  ContactNoteInterface
> {
  constructor() {
    super(Model.Note);
  }
}
