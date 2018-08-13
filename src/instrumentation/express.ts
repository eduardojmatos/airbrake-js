import Notifier from '../notifier';


function makeErrorHandler(client: Notifier) {
    return function errorHandler(err: Error, req, _res, next): void {
        let url = req.protocol + '://' + req.headers['host'] + req.path;
        console.log('Airbrake Req:', req);
        let notice: any = {
            error: err,
            context: {
                userAddr: req.ip,
                userAgent: req.headers['user-agent'],
                url: url,
                route: req.route.path,
                httpMethod: req.method,
                component: 'express',
                action: req.route.stack[0].name,
            },
        };
        let referer = req.headers['referer'];
        if (referer) {
            notice.context.referer = referer;
        }

        client.notify(notice);
        next(err);
    };
}

export = makeErrorHandler;
