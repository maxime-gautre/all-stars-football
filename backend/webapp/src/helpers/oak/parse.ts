import { Context, getQuery, validation as v } from "../../../../deps.ts";

export async function parseBody<T>(
  ctx: Context,
  validator: v.Validator<T>,
  request: (payload: T) => Promise<void>,
) {
  const payload = ctx.request.body();
  const bodyValue = await payload.value;
  const isValid = validator.validate(bodyValue);

  if (isValid.ok) {
    return request(isValid.value);
  } else {
    ctx.response.status = 400;
    ctx.response.body = {
      message: "Invalid request",
      errors: isValid.errors,
    };
  }
}

export function parseQueryParams<T>(
  ctx: Context,
  validator: v.Validator<T>,
  request: (payload: T) => Promise<void>,
) {
  const params = getQuery(ctx);
  const isValid = validator.validate(params);

  if (isValid.ok) {
    return request(isValid.value);
  } else {
    ctx.response.status = 400;
    ctx.response.body = {
      message: "Invalid request",
      errors: isValid.errors,
    };
  }
}
