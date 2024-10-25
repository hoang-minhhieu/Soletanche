import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HyperFormula } from 'hyperformula';
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
  table: MatTableDataSource<TableRow>;
  data: TableRow[];
  hyperFormulaService: HyperformulaService;
  sheetName = 'Step2';
  editingElement: any = null; // Stocker la ligne laquelle on a cliquée
  hf: HyperFormula = HyperFormula.buildEmpty({ licenseKey: 'gpl-v3' });

  constructor(_hyperFormulaService: HyperformulaService) {
    this.hyperFormulaService = _hyperFormulaService;
    // Générer 1000 lignes de "VAR_1" à "VAR_1000"
    this.data = [{ code: 'VAR_1', formule: '1', valeur: 1 }, { code: 'VAR_2', formule: '2', valeur: 2 }];
    this.hyperFormulaService.addNamedExpression(this.hf, 'VAR_1', '1');
    this.hyperFormulaService.addNamedExpression(this.hf, 'VAR_2', '2');
    for (let i = 3; i <= 1000; i++) {
      this.data.push({
        code: `VAR_${i}`,
        formule: `VAR_${i - 1} + VAR_${i - 2}`,
        valeur: this.hyperFormulaService.getNamedExpressionValue(this.hf, `VAR_${i - 1}`) + this.hyperFormulaService.getNamedExpressionValue(this.hf, `VAR_${i - 2}`),
      });
      this.hyperFormulaService.addNamedExpression(this.hf, `VAR_${i}`, `VAR_${i - 1} + VAR_${i - 2}`);
    }
    this.table = new MatTableDataSource(this.data);
  }

  onChangeFormula(valeur: Event, idx: number) {
    if (valeur.target !== null) {
      this.editingElement = null; // Reset editingElement pour que ca revienne à la vue Valeur
      // const result = this.hyperFormulaService.verifyFormula((valeur.target as HTMLInputElement).value, idx);
      // if (result !== undefined && result !== null) {
      //   const cellChanged = this.hyperFormulaService.changeNamedExpression(`VAR_${idx + 1}`, Number(result));
      //   if (cellChanged.length === 1) {
      //     this.data[idx].valeur = Number(cellChanged[0].newValue);
      //   } else {
      //     for (let i = 1; i < cellChanged.length; i++) { // Index commence par 1 parce que la première valeur est un ExportedNamedExpressionChange, ici on a besoin de savoir juste la liste des ExportedCellChange
      //       const cell = cellChanged[i] as ExportedCellChange;
      //       this.data[cell.row - 1].valeur = Number(cell.newValue);
      //     }
      //   }
      // }
    }
  }

  // Switch vers la vue Formule
  startEdit(element: any) {
    this.editingElement = element;
  }
}
