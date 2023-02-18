import { NextApiRequest, NextApiResponse } from 'next';
import httpProxy from 'http-proxy';
import Cookies from 'cookies';

export const proxy = httpProxy.createProxyServer({
  target: process.env.API_URL,
  autoRewrite: false,
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return new Promise((resolve, reject) => {
    req.url = req.url?.replace(/^\/api/, '');

    const cookies = new Cookies(req, res);
    const authorization = cookies.get('authorization');

    req.headers.cookie = '';

    if (authorization) {
      req.headers.authorization = authorization;
    }

    proxy.once('error', reject);

    proxy.web(req, res);
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
