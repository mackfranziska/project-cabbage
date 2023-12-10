import { Discourse } from '../../../shared/models';
import { AskHimRequest, AskHimResponse } from '../models/ask-roland.models';

export function createDiscourse(
  request: AskHimRequest,
  response: AskHimResponse,
): Discourse {
  return {
    name: request.name,
    input: request.input,
    output: response.output,
  };
}
