import { InputMediaInterface, MediaInterface } from "../interfaces";
import Model from "../models";
import { BaseRepository } from "./baseRepository";

export class MediaRepository extends BaseRepository<
  InputMediaInterface,
  MediaInterface
> {
  constructor() {
    super(Model.Media);
  }
}
