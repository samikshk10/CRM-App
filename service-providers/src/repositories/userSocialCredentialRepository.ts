import { InputUserSocialCredentialInterface, UserSocialCredentialInterface } from "@src/interfaces";
import Model from "@src/models";
import { BaseRepository } from ".";

export class UserSocialCredentialRepository extends BaseRepository<InputUserSocialCredentialInterface, UserSocialCredentialInterface> {
    constructor() {
        super(Model.ContactCredential);
    }
}