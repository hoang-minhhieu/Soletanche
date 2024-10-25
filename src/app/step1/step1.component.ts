import { ExportedCellChange, ExportedNamedExpressionChange } from 'hyperformula';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HyperformulaService } from '../hyperformula.service';

export interface TableRow {
  code: string;
  formule: string;
  valeur: number;
}

@Component({
  selector: 'app-step1',
  standalone: true,
  imports: [MatTableModule, FormsModule],
  templateUrl: './step1.component.html',
  styleUrl: './step1.component.css'
})
export class Step1Component {
  displayedColumns: string[] = ['code', 'formule', 'valeur'];
  table: MatTableDataSource<TableRow>;
  data: TableRow[];
  hyperFormulaService: HyperformulaService;
  sheetName = 'Step1';
  sheetId!: number;

  constructor(_hyperFormulaService: HyperformulaService) {
    this.hyperFormulaService = _hyperFormulaService;
    this.hyperFormulaService.addNewSheet(this.sheetName);
    const tmp = this.hyperFormulaService.getSheetId(this.sheetName);
    if (tmp !== null) {
      this.sheetId = tmp;
    };
    // Générer 1000 lignes de "VAR_1" à "VAR_1000"
    this.data = [{ code: 'VAR_1', formule: '1', valeur: 1 }, { code: 'VAR_2', formule: '2', valeur: 2 }];
    this.hyperFormulaService.setParameter('VAR_1', '1', 1, 0, this.sheetId);
    this.hyperFormulaService.setParameter('VAR_2', '2', 2, 1, this.sheetId);
    for (let i = 3; i <= 1000; i++) {
      this.data.push({
        code: `VAR_${i}`,
        formule: `VAR_${i - 1} + VAR_${i - 2}`,
        valeur: this.hyperFormulaService.getNamedExpressionValue(`VAR_${i - 1}`, this.sheetId) + this.hyperFormulaService.getNamedExpressionValue(`VAR_${i - 2}`, this.sheetId),
      });
      this.hyperFormulaService.setParameter(`VAR_${i}`, `VAR_${i - 1} + VAR_${i - 2}`, this.hyperFormulaService.getNamedExpressionValue(`VAR_${i - 1}`, this.sheetId) + this.hyperFormulaService.getNamedExpressionValue(`VAR_${i - 2}`, this.sheetId), i - 1, this.sheetId);
    }
    this.table = new MatTableDataSource(this.data);
  }

  onChangeFormula(valeur: Event, idx: number) {
    if (valeur.target !== null) {
      const result = this.hyperFormulaService.verifyFormula((valeur.target as HTMLInputElement).value, idx, this.sheetId);
      if (result !== undefined && result !== null) {
        const cellChanged = this.hyperFormulaService.changeNamedExpression(`VAR_${idx + 1}`, Number(result), this.sheetId);
        if (cellChanged.length === 1) {
          this.data[idx].valeur = Number(cellChanged[0].newValue);
        } else {
          for (let i = 0; i < cellChanged.length; i++) {
            if (i === 0) { // 0 est de type ExportedNamedExpressionChange
              const cell = cellChanged[i] as ExportedNamedExpressionChange;
              this.data[idx].valeur = Number(cell.newValue);
            } else if (i !== 1) { // On ne prend pas en compte indice 1 car c'est lui même comme 0, et le reste est de type ExportedCellChange
              const cell = cellChanged[i] as ExportedCellChange;
              this.data[cell.row].valeur = Number(cell.newValue);
            }
          }
        }
      }
    }
  }
}
