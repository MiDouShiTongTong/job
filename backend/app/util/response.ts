import { Context } from 'egg';

export default async (ctx: Context, { header, body }) => {
  ctx.status = header.status;
  ctx.body = body;
}
