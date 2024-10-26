import { Component, OnInit, ViewChild } from '@angular/core';
import { DetailedCellError, ExportedNamedExpressionChange, HyperFormula } from 'hyperformula';
import { MatTable, MatTableModule } from '@angular/material/table';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TableRow } from '../step1/step1.component';

@Component({
  selector: 'app-step3',
  standalone: true,
  imports: [MatTableModule, FormsModule, CommonModule, MatIconModule],
  templateUrl: './step3.component.html',
  styleUrl: './step3.component.css'
})
export class Step3Component implements OnInit {
  displayedColumns: string[] = ['code', 'formule', 'valeur', 'delete'];
  data: TableRow[] = [];
  @ViewChild(MatTable) table!: MatTable<any>;
  hf: HyperFormula = HyperFormula.buildEmpty({ licenseKey: 'gpl-v3' });
  previousCodeValue: any = null; // Stocker la valeur de Code avant le trigger (change) au cas ou si la nouvelle valeur n'est pas valide

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
          this.hf.removeNamedExpression(this.previousCodeValue);
        }
        this.previousCodeValue = newCode;
      } else {
        this.data[idx].code = this.previousCodeValue;
        alert('Le même code existe déjà. Veuillez choisir un autre code');
      }
    }
  }

  onChangeFormula(event: Event, idx: number) {
    const element = event.target;
    if (element !== null) {
      const selectedCode = this.data[idx].code;
      const newFormula = (element as HTMLInputElement).value;
      const affectedCells = this.hf.changeNamedExpression(selectedCode, `=${newFormula}`);
      // Mise à jour les nouvelles valeurs affectées par le changement
      affectedCells.forEach((cell) => {
        const updatedCode = (cell as ExportedNamedExpressionChange).name;
        const updatedValue = (cell as ExportedNamedExpressionChange).newValue;

        const dataItem = this.data.find((item) => item.code === updatedCode);
        if (dataItem) {
          dataItem.valeur = Number(updatedValue);
        }
      });
    }
  }

  startEditCode(code: any) {
    this.previousCodeValue = code;
  }

  startEditFormula(formule: any) {
    this.previousCodeValue = formule;
  }

  deleteRow(idx: number) {
    const selectedCode = this.data[idx].code;
    const formula = this.data[idx].formule;
    const changes = this.hf.removeNamedExpression(selectedCode);
    let error = false;

    for (let i = 0; i < changes.length; i++) {
      const updatedValue = (changes[i] as ExportedNamedExpressionChange).newValue;
      if (updatedValue instanceof DetailedCellError) {
        error = true;
        break;
      }
    };

    if (!error) {
      this.data.splice(idx, 1);
      this.table.renderRows();
    } else {
      this.hf.addNamedExpression(selectedCode, `=${formula}`);
      alert('Impossible de supprimer la ligne car ce code est utilisé dans la formule d\'une autre variable');
    }
  }

  addNewRow() {
    this.data.push({ code: '', formule: '', valeur: 0 });
    this.table.renderRows();
  }
}
