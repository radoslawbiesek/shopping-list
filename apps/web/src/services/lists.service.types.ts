import * as listsService from './lists.service';

export type List = Awaited<ReturnType<typeof listsService.getAll>>['data'][number];
