export interface Example {
    id: number;
    name: string;
    description: string;
}

export type ExampleCreate = Omit<Example, 'id'>;
