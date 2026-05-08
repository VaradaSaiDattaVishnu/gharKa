import type { FastifyRequest, FastifyReply } from "fastify";
import type { VerifyOtpInput, OnboardInput } from "@gharka/shared";
import * as authService from "./auth.service.js";

export async function verifyFirebase(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as VerifyOtpInput;
  const result = await authService.verifyFirebaseAndLogin(body.firebaseToken);
  return reply.code(200).send({
    success: true,
    data: {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      isNew: result.isNew,
    },
  });
}

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as { refreshToken: string };
  const result = await authService.refreshAccessToken(body.refreshToken);
  return reply.code(200).send({
    success: true,
    data: result,
  });
}

export async function logout(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as { refreshToken: string };
  await authService.logout(request.userId, body.refreshToken);
  return reply.code(200).send({ success: true, data: null });
}

export async function onboard(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as OnboardInput;
  const result = await authService.onboardUser(request.userId, body);
  return reply.code(200).send({
    success: true,
    data: result,
  });
}
