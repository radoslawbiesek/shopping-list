import * as productsService from './products.service';

export type Product = Awaited<ReturnType<typeof productsService.getAll>>['data'][number];
