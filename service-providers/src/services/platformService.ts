import slug from "slug";
import { GraphQLError } from "graphql";

import {
    PlatformInterface,
    InputPlatformInterface,
} from "@src/interfaces";
import { PlatformRepository } from "@src/repositories";

export class PlatformService {
    private repository: PlatformRepository;
    constructor() {
        this.repository = new PlatformRepository();
    }

    public async create(
        input: InputPlatformInterface,
    ): Promise<PlatformInterface> {
        const platformSlug = slug(input.name);
        const platformSlugExists = await this.repository.findOne({
            where: { slug: platformSlug },
        });
        if (platformSlugExists)
            throw new GraphQLError(`Platform: ${input.name} already exist!`, {
                extensions: {
                    code: "BAD_USER_INPUT",
                    status: 400,
                    message: `Platform ${input.name} already exist!`,
                    attribute: "name",
                },
            });
        input.slug = platformSlug;
        const createPlatform = await this.repository.create({
            name: input.name,
            slug: input.slug,
            active: input.active,
            avatarUrl: input.avatarUrl,
        });
        return createPlatform;
    }

    public async findByPk(id: number): Promise<PlatformInterface> {
        const platform = await this.repository.findByPk(id);
        if (!platform)
            throw new GraphQLError(`Platform: ${id} does not exist!`, {
                extensions: {
                    code: "BAD_USER_INPUT",
                    status: 400,
                    message: `Platform ${id} does not exist!`,
                    attribute: "id",
                },
            });
        return platform;
    }

    public async findAll(): Promise<PlatformInterface[]> {
        const platforms = await this.repository.findAll({
            where: {
                deletedAt: null
            }
        });
        if (!platforms)
            throw new GraphQLError("Fetch platform failed", {
                extensions: {
                    code: "BAD_USER_INPUT",
                    status: 400,
                    message: `Platform doesnot exist`,
                    attribute: "id",
                },
            });
        return platforms;
    }

    public async updateOne(
        id: number,
        input: Partial<InputPlatformInterface>,
    ): Promise<PlatformInterface> {
        const platformExists = await this.repository.findByPk(id);
        if (!platformExists)
            throw new GraphQLError("Update platform failed", {
                extensions: {
                    code: "BAD_USER_INPUT",
                    status: 400,
                    message: `Platform with id: ${id} does not exists`,
                    attribute: "id",
                },
            });
        const platformSlug = slug(input.name);
        const platformSlugExists = await this.repository.findOne({
            where: { slug: platformSlug },
        });
        if (platformSlugExists)
            throw new GraphQLError(`Failed to update platform`, {
                extensions: {
                    code: "BAD_USER_INPUT",
                    status: 400,
                    message: `Platform ${input.name} already exist!`,
                    attribute: "name",
                },
            });
        input.slug = platformSlug;
        await this.repository.updateOne({ id, input });
        return this.findByPk(id);
    }

    public async deleteOne(id: number): Promise<boolean> {
        const platformExists = await this.repository.findByPk(id);
        if (!platformExists)
            throw new GraphQLError("Fetch platform failed", {
                extensions: {
                    code: "BAD_USER_INPUT",
                    status: 400,
                    message: `Platform with id: ${id} does not exists`,
                    attribute: "id",
                },
            });
        const remove = await this.repository.deleteOne(id);
        return remove === 0 ? false : true;
    }
}
