import { Request, Response } from "express";

import { MediaService } from "../services";
import { InputMediaInterface } from "../interfaces";
import { defaultOrder, defaultSort, hostUrl, pgMaxLimit, pgMinLimit } from "../config";

export class MediaController {
  public constructor() {}

  public static async singleMedia(
    req: Request,
    res: Response
  ): Promise<Response> {
    const file = req.file as Express.MulterS3.File;

    const media = await new MediaService().create({
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      key: file.key || file.filename,
      url: file.location || `${hostUrl}/upload/${file.path}`,
      log: file,
    });

    return res.status(200).json({
      message: "File uploaded successfully.",
      data: media,
    });
  }

  public static async multipleMedia(
    req: Request,
    res: Response
  ): Promise<Response> {
    const files = req.files as Express.MulterS3.File[];

    const payload: InputMediaInterface[] = files.map(
      (file: Express.MulterS3.File) => {
        return {
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          key: file.key || file.filename,
          url: file.location ||`${hostUrl}/upload/${file.path}`,
          log: file,
        };
      }
    );

    const media = await new MediaService().bulkCreate(payload);

    return res.status(200).json({
      message: "Files uploaded successfully.",
      edges: media,
    });
  }

  public static async list(req: Request, res: Response): Promise<Response> {
    let { offset, limit, order, sort } = req.query as any;

    offset = Number(offset) && Number(offset) > 0 ? Number(offset) - 1 : 0;
    limit: limit ? limit : pgMinLimit;
    limit = Math.min(limit, pgMaxLimit);
    order = order ? order : defaultOrder;
    sort = sort ? sort : defaultSort;

    const { count, rows: data } = await new MediaService().findAndCountAll({
      offset,
      limit,
      sort,
      order,
    });

    return res.status(200).json({
      message: "Media lists are fetched successfully.",
      data,
      count,
    });
  }

  public static async assetMedia(req: Request, res: Response): Promise<Response> {
    const file = req.file as Express.MulterS3.File;

    return res.status(200).json({
      message: "File uploaded successfully.",
      data: file,
    });
  }
}
