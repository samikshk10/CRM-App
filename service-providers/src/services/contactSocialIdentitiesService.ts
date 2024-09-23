import { GraphQLError } from 'graphql';
import { ContactSocialIdentitiesInterface, InputContactSocialIdentitiesInterface } from '@src/interfaces';
import { ContactSocialIdentitiesRepository } from '@src/repositories';

export class ContactSocialIdentitiesService {
  private repository: ContactSocialIdentitiesRepository;
  constructor() {
    this.repository = new ContactSocialIdentitiesRepository();
  }

  public async create(input: InputContactSocialIdentitiesInterface): Promise<ContactSocialIdentitiesInterface> {
    const createCredential = await this.repository.create({
      ownerId: input.ownerId,
      userSocialCredentialId: input.userSocialCredentialId,
      contactAccessId: input.contactAccessId,
      meta: {
        name: input.meta.name,
        profilePic: input.meta.profile_pic,
        gender: input.meta.gender,
        conversationId: input.meta.conversationId,
      },
    });
    return createCredential;
  }
  public async findByPk(id: number): Promise<ContactSocialIdentitiesInterface> {
    const credential = await this.repository.findByPk(id);
    if (!credential)
      throw new GraphQLError(`Credential: ${id} does not exist!`, {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Credential ${id} does not exist!`,
          attribute: "id",
        },
      });
    return credential;
  }

  public async findAll(): Promise<ContactSocialIdentitiesInterface[]> {
    const credentials = await this.repository.findAll({
      where: {
        deletedAt: null,
      },
    });
    if (!credentials)
      throw new GraphQLError(`Credentials does not exist!`, {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Credentials does not exist!`,
          attribute: "credentials",
        },
      });
    return credentials;
  }

  public async updateOne(
    id: number,
    input: InputContactSocialIdentitiesInterface,
  ): Promise<ContactSocialIdentitiesInterface> {
    const credential = await this.repository.findByPk(id);
    if (!credential)
      throw new GraphQLError(`Credential: ${id} does not exist!`, {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Credential ${id} does not exist!`,
          attribute: "id",
        },
      });
    if (input.meta) {
      const oldObj = credential.meta;
      const newObj = input.meta;
      const updateObj = { ...oldObj, ...newObj };
      input.meta = updateObj;
    }
    await this.repository.updateOne({ id, input });
    return this.findByPk(id);
  }

  public async delete(id: number): Promise<boolean> {
    const credential = await this.repository.findByPk(id);
    if (!credential)
      throw new GraphQLError(`Credential: ${id} does not exist!`, {
        extensions: {
          code: "BAD_USER_INPUT",
          status: 400,
          message: `Credential ${id} does not exist!`,
          attribute: "id",
        },
      });
    const removeCredential = await this.repository.deleteOne(id);
    return removeCredential === 0 ? false : true;
  }
}
