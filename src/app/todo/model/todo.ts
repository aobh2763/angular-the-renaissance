import { TodoState } from "./type";

export class Todo {
  public id!: number;
  public name!:string;
  public content!:string;
  public state!: TodoState;
  constructor() { 
    this.name = '';
    this.content = '';
    this.state = 'waiting';
  }
}
