import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Todolist, TodolistWithRelations} from './todolist.model';

@model()
export class Todo extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
    required: true,
  })
  desc: string;

  @property({
    type: 'boolean',
  })
  isComplete?: boolean;

  @belongsTo(() => Todolist)
  todolistId: number;

  constructor(data?: Partial<Todo>) {
    super(data);
  }
}

export interface TodoRelations {
  // describe navigational properties here
  todolist?: TodolistWithRelations;
}

export type TodoWithRelations = Todo & TodoRelations;
