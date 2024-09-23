import exceptionHandler from "../../../middlewares/exceptionHandler";
import { RouterClass } from "../../../classes";
import { Guard } from "../../../middlewares";
import { Multer } from "../../../config/multer";
import { MediaController } from "../../../controllers";
import { s3Bucket } from "../../../config";

export class MediaRouter extends RouterClass {
  constructor() {
    super();
  }

  define(): void {
    this.router
      .route("/single")
      .post(
        exceptionHandler(Guard.grant),
        exceptionHandler(new Multer().multer.single("file")),
        exceptionHandler(MediaController.singleMedia)
      );

    this.router
      .route("/multiple")
      .post(
        exceptionHandler(Guard.grant),
        exceptionHandler(new Multer().multer.array("files", 30)),
        exceptionHandler(MediaController.multipleMedia)
      );
    this.router
      .route("/")
      .get(
        exceptionHandler(Guard.grant),
        exceptionHandler(MediaController.list)
      );

    this.router.route("/assets").post(
      exceptionHandler(
        new Multer({
          name: s3Bucket.assetsName,
          region: s3Bucket.assetsRegion,
        }).multer.single("file")
      ),
      exceptionHandler(MediaController.assetMedia)
    );

    this.router
      .route("/disk/single")
      .post(
        exceptionHandler(Guard.grant),
        exceptionHandler(new Multer().diskStorage.single("file")),
        exceptionHandler(MediaController.singleMedia)
      );

    this.router
      .route("/disk/multiple")
      .post(
        exceptionHandler(Guard.grant),
        exceptionHandler(new Multer().diskStorage.array("files", 30)),
        exceptionHandler(MediaController.multipleMedia)
      );
  }
}
