import { InputPlatformInterface, PlatformInterface } from "@src/interfaces";
import Model from "@src/models";
import { BaseRepository } from ".";

export class PlatformRepository extends BaseRepository<InputPlatformInterface, PlatformInterface> {
    constructor() {
        super(Model.Platform);
    }
}