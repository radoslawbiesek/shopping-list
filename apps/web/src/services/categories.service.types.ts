import * as categoriesService from './categories.service';

export type Category = Awaited<ReturnType<typeof categoriesService.getAll>>['data'][number];
