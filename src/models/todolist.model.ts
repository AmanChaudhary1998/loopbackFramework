import {Entity, hasMany, model, property} from '@loopback/repository';
import {Todo, TodoWithRelations} from './todo.model';

@model()
export class Todolist extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
  })
  color?: string;

  @hasMany(() => Todo)
  todos: Todo[];

  constructor(data?: Partial<Todolist>) {
    super(data);
  }
}

export interface TodolistRelations {
  // describe navigational properties here
  todos?: TodoWithRelations[]
}

export type TodolistWithRelations = Todolist & TodolistRelations;
