import { Component, ViewChild } from '@angular/core';
import { MatTable, MatTableModule } from '@angular/material/table';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-step3',
  standalone: true,
  imports: [MatTableModule, FormsModule, CommonModule],
  templateUrl: './step3.component.html',
  styleUrl: './step3.component.css'
})
export class Step3Component {
  displayedColumns: string[] = ['code', 'formule', 'valeur'];
  sheetName = 'Step3';
  sheetId!: number;
  @ViewChild(MatTable) table!: MatTable<any>;

  constructor() {
    // this.hyperFormulaService = _hyperFormulaService;
    // this.hyperFormulaService.addNewSheet(this.sheetName);
    // const tmp = this.hyperFormulaService.getSheetId(this.sheetName);
    // if (tmp !== null) {
    //   this.sheetId = tmp;
    // };
    // this.data = [];
    // this.tableDataSource = new MatTableDataSource(this.data);
  }

  // onChangeCode(valeur: Event, idx: number) {
  //   if (valeur.target !== null) {
  //     const isValid = this.hyperFormulaService.isItPossibleToAddNamedExpression((valeur.target as HTMLInputElement).value, this.data[idx].formule);
  //     if (isValid) {
  //       this.hyperFormulaService.addNamedExpression((valeur.target as HTMLInputElement).value, this.data[idx].formule);
  //     } else {
  //       alert('Le même code existe déjà.');
  //     }
  //   }
  // }

  // onChangeFormula(valeur: Event, idx: number) {
  //   if (valeur.target !== null) {
  //     const result = this.hyperFormulaService.verifyFormula((valeur.target as HTMLInputElement).value, idx, this.sheetId);
  //     if (result !== undefined && result !== null) {
  //       const cellChanged = this.hyperFormulaService.changeNamedExpression(`VAR_${idx + 1}`, Number(result));
  //       if (cellChanged.length === 1) {
  //         this.data[idx].valeur = Number(cellChanged[0].newValue);
  //       } else {
  //         for (let i = 0; i < cellChanged.length; i++) {
  //           if (i === 0) { // 0 est de type ExportedNamedExpressionChange
  //             const cell = cellChanged[i] as ExportedNamedExpressionChange;
  //             this.data[idx].valeur = Number(cell.newValue);
  //           } else if (i !== 1) { // On ne prend pas en compte indice 1 car c'est lui même comme 0, et le reste est de type ExportedCellChange
  //             const cell = cellChanged[i] as ExportedCellChange;
  //             this.data[cell.row].valeur = Number(cell.newValue);
  //           }
  //         }
  //       }
  //     }
  //   }
  // }

  // addNewRow() {
  //   this.data.push({ code: '', formule: '', valeur: 0 });
  //   this.tableDataSource = new MatTableDataSource(this.data);
  //   this.table.renderRows();
  // }
}
