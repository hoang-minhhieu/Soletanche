import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'

import { ExportedCellChange } from 'hyperformula';
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
export class Step1Component implements OnInit {
  displayedColumns: string[] = ['code', 'formule', 'valeur'];
  tableData: MatTableDataSource<TableRow>;
  data: TableRow[];
  hyperFormulaService: HyperformulaService;
  sheetName = 'Step1';

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

  ngOnInit() { }

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
}
