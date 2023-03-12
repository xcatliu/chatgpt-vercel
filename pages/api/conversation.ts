import { SendMessageOptions, ChatMessage } from 'chatgpt';

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAPIInstance } from '@/utils/getApiInstance';
import { HttpMethod, HttpStatusCode } from '@/utils/constants';

type ReqBody = SendMessageOptions & {
  message: string;
};

interface ErrorResponse {
  code: HttpStatusCode;
  message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ChatMessage | ErrorResponse>) {
  // https://stackoverflow.com/a/66740097/2777142
  if (req.method !== HttpMethod.POST) {
    res
      .status(HttpStatusCode.MethodNotAllowed)
      .send({ code: HttpStatusCode.MethodNotAllowed, message: 'Only POST requests allowed' });
    return;
  }

  if (!req.cookies.OPENAI_API_KEY) {
    res
      .status(HttpStatusCode.BadRequest)
      .send({ code: HttpStatusCode.BadRequest, message: 'Cookie `OPENAI_API_KEY` is required' });
    return;
  }

  const { OPENAI_API_KEY } = req.cookies;
  const { message, parentMessageId } = req.body as ReqBody;

  if (!message) {
    res
      .status(HttpStatusCode.BadRequest)
      .send({ code: HttpStatusCode.BadRequest, message: 'Parameter `message` is required' });
    return;
  }

  const api = getAPIInstance(OPENAI_API_KEY);

  const chatGptRes = await api.sendMessage(message, {
    parentMessageId,
  });

  res.status(HttpStatusCode.OK).json(chatGptRes);
}
