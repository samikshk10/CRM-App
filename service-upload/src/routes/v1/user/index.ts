import { Router } from "express";
import { MediaRouter } from "./mediaRoutes";
import { IRouteInterface } from "../../../interfaces";

class ProxyRouter {
  private static instance: ProxyRouter;
  private router: Router = Router();
  private readonly routes = [
    {
      segment: "/media",
      provider: MediaRouter,
    },
  ];

  private constructor() {}

  public static get(): ProxyRouter {
    if (!ProxyRouter.instance) ProxyRouter.instance = new ProxyRouter();
    return ProxyRouter.instance;
  }

  public map(): Router {
    this.routes.forEach((route: IRouteInterface) => {
      const instance = new route.provider() as { router: Router };
      this.router.use(route.segment, instance.router);
    });
    return this.router;
  }
}

const proxyRouter = ProxyRouter.get();
export { proxyRouter as ProxyRouter };
