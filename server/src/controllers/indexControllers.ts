import { Request,Response } from "express";

class IndexController{

    public index(req:Request, resp:Response){
        resp.send('Ya responde!!!');
    }
}
export const indexController= new IndexController();

