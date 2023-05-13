'use server';

import * as listsService from '../services/lists.service';

export async function create(data: Parameters<typeof listsService.create>[0]) {
  return listsService.create(data);
}
