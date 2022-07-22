import { DefaultBodyType, PathParams, ResponseComposition, rest, RestContext, RestRequest } from 'msw';
import { MockToken } from './handlers/MockToken';
import { ApiPath } from '../shared/api/Path';
import { MockTwitter, MockEldorado } from './handlers';

const getResponse = async<T extends RestRequest>(req: T, res: ResponseComposition<DefaultBodyType>, ctx: RestContext) => {

    const pathname: string = req.url.pathname;

    return await (async(pathname)=>{
        switch(pathname) {
            
            case ApiPath.TOKEN: return new MockToken().getResponse(req);
            case ApiPath.TWITTER_GET_USERS_ME: return new MockTwitter().getUsersMe();
            case ApiPath.ELDORADO_HALLS: return MockEldorado.getHalls(req);
            case ApiPath.ELDORADO_LATEST_HALLS: return MockEldorado.getLatestHalls();

            default: throw new Error("{88CC17F3-0674-41E3-BE53-3DF7BD448E68}");
        }
    })(pathname).then(ret=>{
        return res(ctx.status(200), ctx.json(ret))
    }).catch(err=>{
        return res(ctx.status(500), ctx.text(err));
    });
};

export const handlers = [
    rest.get('/api/*', async(req, res, ctx) => {
        return await getResponse<RestRequest<never, PathParams<string>>>(req, res, ctx);
    }),
    rest.post("/api/*", async(req,res, ctx)=>{
        return await getResponse<RestRequest<DefaultBodyType, PathParams<string>>>(req, res, ctx);
    }),
]