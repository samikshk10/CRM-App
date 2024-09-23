import { PipelineInterface, InputPipelineInterface } from '@src/interfaces';
import Model from '@src/models';
import { BaseRepository } from './baseRepository';

export class PipelineRepository extends BaseRepository<
  InputPipelineInterface,
  PipelineInterface
> {
  constructor() {
    super(Model.Pipeline);
  }
}
