import * as listItemsService from './list-items.service';

export type ListItem = Awaited<ReturnType<typeof listItemsService.getAll>>['data'][number];
