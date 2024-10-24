import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ExportedCellChange } from 'hyperformula';
import { FormsModule } from '@angular/forms';
import { HyperformulaService } from '../hyperformula.service';
import { TableRow } from '../step1/step1.component';

@Component({
  selector: 'app-step2',
  standalone: true,
  imports: [MatTableModule, FormsModule, CommonModule],
  templateUrl: './step2.component.html',
  styleUrl: './step2.component.css'
})
export class Step2Component {
  displayedColumns: string[] = ['code', 'formuleValeur'];
  tableData: MatTableDataSource<TableRow>;
  data: TableRow[];
  hyperFormulaService: HyperformulaService;
  sheetName = 'Step2';
  // Store the currently editing row
  editingElement: any = null;

  constructor(_hyperFormulaService: HyperformulaService) {
    this.hyperFormulaService = _hyperFormulaService;
    this.hyperFormulaService.addNewSheet(this.sheetName);
    const sheetId = this.hyperFormulaService.getSheetId(this.sheetName);
    // Générer 1000 lignes de "VAR_1" à "VAR_1000"
    this.data = [{ code: 'VAR_1', formule: '1', valeur: 1 }, { code: 'VAR_2', formule: '2', valeur: 2 }];
    this.hyperFormulaService.setParameter('VAR_1', '1', 1, 0, sheetId!);
    this.hyperFormulaService.setParameter('VAR_2', '2', 2, 1, sheetId!);
    for (let i = 3; i <= 1000; i++) {
      this.data.push({
        code: `VAR_${i}`,
        formule: `VAR_${i - 1} + VAR_${i - 2}`,
        valeur: this.hyperFormulaService.getNamedExpressionValue(`VAR_${i - 1}`, sheetId!) + this.hyperFormulaService.getNamedExpressionValue(`VAR_${i - 2}`, sheetId!),
      });
      this.hyperFormulaService.setParameter(`VAR_${i}`, `VAR_${i - 1} + VAR_${i - 2}`, this.hyperFormulaService.getNamedExpressionValue(`VAR_${i - 1}`, sheetId!) + this.hyperFormulaService.getNamedExpressionValue(`VAR_${i - 2}`, sheetId!), i - 1, sheetId!);
    }
    this.tableData = new MatTableDataSource(this.data);
  }

  onChangeFormula(valeur: Event, idx: number) {
    if (valeur.target !== null) {
      const sheetId = this.hyperFormulaService.getSheetId(this.sheetName);
      const result = this.hyperFormulaService.verifyFormula((valeur.target as HTMLInputElement).value, idx, sheetId!);
      if (result !== undefined && result !== null) {
        const cellChanged = this.hyperFormulaService.changeNamedExpression(`VAR_${idx + 1}`, Number(result), sheetId!);
        for (let i = 1; i < cellChanged.length; i++) { // Index commence par 1 parce que la première valeur est un ExportedNamedExpressionChange, ici on a besoin de savoir juste la liste des ExportedCellChange
          const cell = cellChanged[i] as ExportedCellChange;
          this.data[cell.row - 1].valeur = Number(cell.newValue);
        }
      }
    }
  }

  // Start editing the row (shows the formula)
  startEdit(element: any) {
    this.editingElement = element;
  }
}
