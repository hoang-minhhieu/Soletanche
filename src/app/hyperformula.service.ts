import { HyperFormula } from 'hyperformula';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HyperformulaService {
  hf: HyperFormula;
  constructor() {
    // Créer un instance HyperFormula
    this.hf = HyperFormula.buildEmpty({ licenseKey: 'gpl-v3' });
  }

  addNewSheet(sheetName: string) {
    this.hf.addSheet(sheetName);
  }

  getSheetId(sheetName: string) {
    // Récupérer le sheetId depuis un nom de sheet donné
    const sheetId = this.hf.getSheetId(sheetName);
    if (sheetId === undefined) {
      alert('Sheet not found');
      return null;
    }
    return sheetId;
  }

  setParameter(namedExpression: string, formula: string, value: number, row: number, sheetId: number) {
    this.hf.addNamedExpression(namedExpression, value, sheetId);
    this.hf.setCellContents({ sheet: sheetId, col: 0, row }, `=${formula}`);
  }

  changeNamedExpression(namedExpression: string, newValue: number, sheetId: number) {
    return this.hf.changeNamedExpression(namedExpression, newValue, sheetId);
  }

  getNamedExpressionValue(namedExpression: string, sheetId: number): number {
    return Number(this.hf.getNamedExpressionValue(namedExpression, sheetId));
  }

  verifyFormula(formula: string, row: number, sheetId: number) {
    try {
      // Update formula
      this.hf.setCellContents({ sheet: sheetId, col: 0, row }, `=${formula}`);
      // Compute le résultat et le récupère
      return this.hf.getCellValue({ sheet: sheetId, col: 0, row });
    } catch (error) {
      if (error instanceof Error) {
        alert('Invalid formula:' + error.message);
      } else {
        alert('An unknown error occurred');
      }
      return null;
    }
  }
}
