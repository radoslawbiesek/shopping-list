/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  '/auth/register': {
    post: {
      requestBody: {
        content: {
          'application/json': {
            /** Format: email */
            email: string;
            name: string;
            password: string;
          };
        };
      };
      responses: {
        /** @description Default Response */
        200: {
          content: {
            'application/json': {
              email: string;
              name: string;
              /** Format: date-time */
              createdAt: string;
              /** Format: date-time */
              updatedAt: string;
              id: number;
            };
          };
        };
      };
    };
  };
  '/auth/login': {
    post: {
      requestBody: {
        content: {
          'application/json': {
            /** Format: email */
            email: string;
            password: string;
          };
        };
      };
      responses: {
        /** @description Default Response */
        200: {
          content: {
            'application/json': {
              token: string;
              user: {
                email: string;
                name: string;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
                id: number;
              };
            };
          };
        };
      };
    };
  };
  '/auth/me': {
    get: {
      responses: {
        /** @description Default Response */
        200: {
          content: {
            'application/json': {
              email: string;
              name: string;
              /** Format: date-time */
              createdAt: string;
              /** Format: date-time */
              updatedAt: string;
              id: number;
            };
          };
        };
      };
    };
  };
  '/categories/': {
    get: {
      responses: {
        /** @description Default Response */
        200: {
          content: {
            'application/json': {
              id: number;
              name: string;
              /** Format: date-time */
              createdAt: string;
              /** Format: date-time */
              updatedAt: string;
              createdBy: number;
            }[];
          };
        };
      };
    };
    post: {
      requestBody: {
        content: {
          'application/json': {
            name: string;
          };
        };
      };
      responses: {
        /** @description Default Response */
        200: {
          content: {
            'application/json': {
              id: number;
              name: string;
              /** Format: date-time */
              createdAt: string;
              /** Format: date-time */
              updatedAt: string;
              createdBy: number;
            };
          };
        };
      };
    };
  };
  '/categories/{id}': {
    delete: {
      parameters: {
        path: {
          id: number;
        };
      };
      responses: {
        /** @description Default Response */
        204: {
          content: {
            'application/json': unknown;
          };
        };
      };
    };
  };
  '/products/': {
    get: {
      responses: {
        /** @description Default Response */
        200: {
          content: {
            'application/json': {
              id: number;
              name: string;
              categoryId: number;
              description: ('null' | null) | string;
              image: ('null' | null) | string;
              lastUsed: ('null' | null) | string;
              /** Format: date-time */
              createdAt: string;
              /** Format: date-time */
              updatedAt: string;
              createdBy: number;
              category: {
                id: number;
                name: string;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
                createdBy: number;
              };
            }[];
          };
        };
      };
    };
    post: {
      requestBody: {
        content: {
          'application/json': {
            name: string;
            description?: string;
            image?: string | '';
            categoryId: number | ('null' | null);
          };
        };
      };
      responses: {
        /** @description Default Response */
        200: {
          content: {
            'application/json': {
              id: number;
              name: string;
              categoryId: number;
              description: ('null' | null) | string;
              image: ('null' | null) | string;
              lastUsed: ('null' | null) | string;
              /** Format: date-time */
              createdAt: string;
              /** Format: date-time */
              updatedAt: string;
              createdBy: number;
            };
          };
        };
      };
    };
  };
  '/products/{id}': {
    delete: {
      parameters: {
        path: {
          id: number;
        };
      };
      responses: {
        /** @description Default Response */
        204: {
          content: {
            'application/json': unknown;
          };
        };
      };
    };
  };
  '/lists/': {
    get: {
      responses: {
        /** @description Default Response */
        200: {
          content: {
            'application/json': {
              id: number;
              name: string;
              /** Format: date-time */
              createdAt: string;
              /** Format: date-time */
              updatedAt: string;
              createdBy: number;
            }[];
          };
        };
      };
    };
    post: {
      requestBody: {
        content: {
          'application/json': {
            name: string;
          };
        };
      };
      responses: {
        /** @description Default Response */
        200: {
          content: {
            'application/json': {
              id: number;
              name: string;
              /** Format: date-time */
              createdAt: string;
              /** Format: date-time */
              updatedAt: string;
              createdBy: number;
            };
          };
        };
      };
    };
  };
  '/lists/{id}': {
    delete: {
      parameters: {
        path: {
          id: number;
        };
      };
      responses: {
        /** @description Default Response */
        204: {
          content: {
            'application/json': unknown;
          };
        };
      };
    };
  };
  '/lists/{listId}/items': {
    get: {
      parameters: {
        path: {
          listId: number;
        };
      };
      responses: {
        /** @description Default Response */
        200: {
          content: {
            'application/json': {
              id: number;
              listId: number;
              productId: number;
              isChecked: boolean;
              isPriority: boolean;
              amount: number;
              /** Format: date-time */
              createdAt: string;
              /** Format: date-time */
              updatedAt: string;
              createdBy: number;
              product: {
                id: number;
                name: string;
                categoryId: number;
                description: ('null' | null) | string;
                image: ('null' | null) | string;
                lastUsed: ('null' | null) | string;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
                createdBy: number;
              };
            }[];
          };
        };
      };
    };
    post: {
      parameters: {
        path: {
          listId: number;
        };
      };
      requestBody: {
        content: {
          'application/json': {
            productId: number;
            /** @default false */
            isChecked?: boolean;
            /** @default false */
            isPriority?: boolean;
            /** @default 1 */
            amount?: number;
          };
        };
      };
      responses: {
        /** @description Default Response */
        200: {
          content: {
            'application/json': {
              id: number;
              listId: number;
              productId: number;
              isChecked: boolean;
              isPriority: boolean;
              amount: number;
              /** Format: date-time */
              createdAt: string;
              /** Format: date-time */
              updatedAt: string;
              createdBy: number;
            };
          };
        };
      };
    };
  };
  '/lists/{listId}/items/{id}': {
    delete: {
      parameters: {
        path: {
          listId: number;
          id: number;
        };
      };
      responses: {
        /** @description Default Response */
        204: {
          content: {
            'application/json': unknown;
          };
        };
      };
    };
    patch: {
      parameters: {
        path: {
          listId: number;
          id: number;
        };
      };
      requestBody?: {
        content: {
          'application/json': {
            isChecked?: boolean;
            isPriority?: boolean;
            amount?: number;
          };
        };
      };
      responses: {
        /** @description Default Response */
        200: {
          content: {
            'application/json': {
              id: number;
              listId: number;
              productId: number;
              isChecked: boolean;
              isPriority: boolean;
              amount: number;
              /** Format: date-time */
              createdAt: string;
              /** Format: date-time */
              updatedAt: string;
              createdBy: number;
            };
          };
        };
      };
    };
  };
  '/lists/{listId}/access': {
    get: {
      parameters: {
        path: {
          listId: number;
        };
      };
      responses: {
        /** @description Default Response */
        200: {
          content: {
            'application/json': {
              id: number;
              listId: number;
              userId: number;
              access: string;
              /** Format: date-time */
              createdAt: string;
              /** Format: date-time */
              updatedAt: string;
            }[];
          };
        };
      };
    };
    post: {
      parameters: {
        path: {
          listId: number;
        };
      };
      requestBody: {
        content: {
          'application/json': {
            userId: number;
          };
        };
      };
      responses: {
        /** @description Default Response */
        200: {
          content: {
            'application/json': {
              id: number;
              listId: number;
              userId: number;
              access: string;
              /** Format: date-time */
              createdAt: string;
              /** Format: date-time */
              updatedAt: string;
            };
          };
        };
      };
    };
  };
  '/lists/{listId}/access/{id}': {
    delete: {
      parameters: {
        path: {
          listId: number;
          id: number;
        };
      };
      responses: {
        /** @description Default Response */
        204: {
          content: {
            'application/json': unknown;
          };
        };
      };
    };
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {};
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type external = Record<string, never>;

export type operations = Record<string, never>;
