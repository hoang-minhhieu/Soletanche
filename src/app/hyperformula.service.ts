import { HyperFormula } from 'hyperformula';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HyperformulaService {
  constructor() { }

  addNamedExpression(hf: HyperFormula, namedExpression: string, expression: string) {
    hf.addNamedExpression(namedExpression, `=${expression}`);
  }

  changeNamedExpression(hf: HyperFormula, namedExpression: string, expression: string) {
    return hf.changeNamedExpression(namedExpression, `=${expression}`);
  }

  getNamedExpressionValue(hf: HyperFormula, namedExpression: string): number {
    return Number(hf.getNamedExpressionValue(namedExpression));
  }

  removeNamedExpression(hf: HyperFormula, namedExpression: string) {
    hf.removeNamedExpression(namedExpression);
  }

  isItPossibleToAddNamedExpression(hf: HyperFormula, namedExpression: string, expression: string) {
    return hf.isItPossibleToAddNamedExpression(namedExpression, `=${expression}`);
  }
}
