import { Injectable, signal } from '@angular/core';
import { Cv } from '../model/cv';

@Injectable({
  providedIn: 'root',
})
export class EmbaucheService {
  #embauchees = signal<readonly Cv[]>([]);
  readonly embauchees = this.#embauchees.asReadonly();

  constructor() {}

  /**
   *
   * Retourne la liste des embauchees
   *
   * @returns CV[]
   *
   */
  getEmbauchees(): Cv[] {
    return [...this.#embauchees()];
  }

  /**
   *
   * Embauche une personne si elle ne l'est pas encore
   * Sinon il retourne false
   *
   * @param cv : Cv
   * @returns boolean
   */
  embauche(cv: Cv): boolean {
    if (!this.#embauchees().includes(cv)) {
      this.#embauchees.update((cvs) => [...cvs, cv]);
      return true;
    }
    return false;
  }
}
