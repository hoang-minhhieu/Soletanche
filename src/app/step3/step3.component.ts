import { Component, OnInit, ViewChild } from '@angular/core';
import { DetailedCellError, ErrorType, ExportedNamedExpressionChange, HyperFormula } from 'hyperformula';
import { MatTable, MatTableModule } from '@angular/material/table';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TableRow } from '../step1/step1.component';

@Component({
  selector: 'app-step3',
  standalone: true,
  imports: [MatTableModule, FormsModule, CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './step3.component.html',
  styleUrl: './step3.component.css'
})
export class Step3Component implements OnInit {
  displayedColumns: string[] = ['code', 'formule', 'valeur', 'delete'];
  data: TableRow[] = [];
  @ViewChild(MatTable) table!: MatTable<any>;
  hf: HyperFormula = HyperFormula.buildEmpty({ licenseKey: 'gpl-v3' });
  previousCodeValue: any = null; // Stocker la valeur de Code avant le trigger (change) au cas ou si la nouvelle valeur n'est pas valide
  previousFormulaValue: any = null // Stocker la valeur de Formule avant le trigger (change) au cas ou si la nouvelle valeur n'est pas valide

  constructor() { }

  ngOnInit(): void {
    this.data = []
  }

  onChangeCode(event: Event, idx: number) {
    const element = event.target;
    if (element !== null) {
      const newCode = (element as HTMLInputElement).value;
      const formula = this.data[idx].formule;
      const isValid = this.hf.isItPossibleToAddNamedExpression(newCode, formula);
      if (isValid) {
        this.hf.addNamedExpression(newCode, `=${formula}`);
        if (this.previousCodeValue !== '') {
          const changes = this.hf.removeNamedExpression(this.previousCodeValue);
          for (let i = 0; i < changes.length; i++) {
            const updatedValue = (changes[i] as ExportedNamedExpressionChange).newValue;
            if (updatedValue instanceof DetailedCellError) {
              this.hf.undo();
              this.data[idx].code = this.previousCodeValue;
              alert('Impossible de modifier ce code car il est utilisé dans la formule d\'une autre variable.');
            }
          };
        }
        this.previousCodeValue = newCode;
      } else {
        this.data[idx].code = this.previousCodeValue;
        alert('Il existe déjà ce code ou le nouveau code ne respecte pas le règle de nommage (commence par une lettre ou underscore _).');
      }
    }
  }

  onChangeFormula(event: Event, idx: number) {
    const element = event.target;
    if (element !== null) {
      let error = false;
      const selectedCode = this.data[idx].code;
      const newFormula = (element as HTMLInputElement).value;
      const affectedCells = this.hf.changeNamedExpression(selectedCode, `=${newFormula}`);
      // Mise à jour les nouvelles valeurs affectées par le changement
      for (let i = 0; i < affectedCells.length; i++) {
        const cell = affectedCells[i];
        const updatedCode = (cell as ExportedNamedExpressionChange).name;
        const updatedValue = (cell as ExportedNamedExpressionChange).newValue;
        // Vérifier Références circulaires
        if (updatedValue instanceof DetailedCellError) {
          error = true;
          switch (updatedValue.type) {
            case ErrorType.NAME: {
              alert(`Expression ${newFormula} n'existe pas.`);
              break;
            }
            case ErrorType.CYCLE: {
              alert('Références circulaires detectées.');
              break;
            }
            default: alert(`Unhandled error: ${updatedValue}`);
          }
          break;
        }

        const dataItem = this.data.find((item) => item.code === updatedCode);
        if (dataItem) {
          dataItem.valeur = Number(updatedValue);
        }
      }

      if (error) {
        if (this.previousFormulaValue !== '') {
          const oldValue = this.hf.undo();
          // Rollback to old formula and value
          this.data[idx].formule = this.previousFormulaValue;
          this.data[idx].valeur = Number(oldValue[0].newValue);
        } else {
          // Init row
          this.data[idx].formule = '';
          this.data[idx].valeur = 0;
        }
        this.table.renderRows();
      }
    }
  }

  startEditCode(code: any) {
    this.previousCodeValue = code;
  }

  startEditFormula(formule: any) {
    this.previousFormulaValue = formule;
  }

  deleteRow(idx: number) {
    const selectedCode = this.data[idx].code;
    if (selectedCode === '') {
      this.data.splice(idx, 1);
      this.table.renderRows();
    } else {
      const changes = this.hf.removeNamedExpression(selectedCode);
      let error = false;

      for (let i = 0; i < changes.length; i++) {
        const updatedValue = (changes[i] as ExportedNamedExpressionChange).newValue;
        if (updatedValue instanceof DetailedCellError) {
          error = true;
          this.hf.undo();
          alert('Impossible de supprimer la ligne car ce code est utilisé dans la formule d\'une autre variable.');
          break;
        }
      };

      if (!error) {
        this.data.splice(idx, 1);
        this.table.renderRows();
      }
    }
  }

  addNewRow() {
    this.data.push({ code: '', formule: '', valeur: 0 });
    this.table.renderRows();
  }
}
