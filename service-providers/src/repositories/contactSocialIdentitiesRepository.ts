import { InputContactSocialIdentitiesInterface, ContactSocialIdentitiesInterface } from "@src/interfaces";
import Model from "@src/models";
import { BaseRepository } from ".";

export class ContactSocialIdentitiesRepository extends BaseRepository<InputContactSocialIdentitiesInterface, ContactSocialIdentitiesInterface> {
    constructor() {
        super(Model.ContactSocialIdentities);
    }
}
