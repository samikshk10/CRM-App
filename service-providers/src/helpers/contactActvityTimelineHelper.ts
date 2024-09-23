import {
  ContactActivityTimelineInterface,
  InputContactActivityTimelineInterface,
} from "@src/interfaces";
import { ContactActivityTimelineService } from "@src/services";

class ContactActivityTimelineHelper {
  static instance: ContactActivityTimelineHelper;

  static get(): ContactActivityTimelineHelper {
    if (!ContactActivityTimelineHelper.instance)
      ContactActivityTimelineHelper.instance =
        new ContactActivityTimelineHelper();
    return ContactActivityTimelineHelper.instance;
  }

  public async addToActivityTimeline(
    input: InputContactActivityTimelineInterface
  ): Promise<ContactActivityTimelineInterface> {
    const newActivity = await new ContactActivityTimelineService().create(input);
    return new ContactActivityTimelineService().findByPk(newActivity.id);
  }
}

const contactActvityTimelineHelper = ContactActivityTimelineHelper.get();
export { contactActvityTimelineHelper as ContactActivityTimelineHelper };
