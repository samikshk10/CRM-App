import { ContactActivityTimelineInterface, InputContactActivityTimelineInterface } from '@src/interfaces';
import Model from '@src/models';
import { BaseRepository } from './baseRepository';

export class ContactActivityTimelineRepository extends BaseRepository<
  InputContactActivityTimelineInterface,
  ContactActivityTimelineInterface
> {
  constructor() {
    super(Model.ContactActivityTimeline);
  }
}
