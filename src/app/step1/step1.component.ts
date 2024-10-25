import { Component, OnInit } from '@angular/core';
import { ExportedNamedExpressionChange, HyperFormula } from 'hyperformula';

import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table'

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
  data: TableRow[] = [{ code: 'VAR_1', formule: '1', valeur: 1 }, { code: 'VAR_2', formule: '2', valeur: 2 }];
  hf: HyperFormula = HyperFormula.buildEmpty({ licenseKey: 'gpl-v3' });

  constructor() { }

  ngOnInit() {
    // Générer 1000 lignes de "VAR_1" à "VAR_1000"
    this.data = [{ code: 'VAR_1', formule: '1', valeur: 1 }, { code: 'VAR_2', formule: '2', valeur: 2 }];
    this.hf.addNamedExpression('VAR_1', '1');
    this.hf.addNamedExpression('VAR_2', '2');
    // Loop to create each variable, its formula, and calculate its value
    for (let i = 3; i <= 1000; i++) {
      const code = `VAR_${i}`;
      const formula = `VAR_${i - 1} + VAR_${i - 2}`;

      // Add named expression to HyperFormula
      this.hf.addNamedExpression(code, `=${formula}`);

      // Calculate the current value using HyperFormula
      const valeur = this.hf.getNamedExpressionValue(code);

      // Push the entry with calculated value
      this.data.push({
        code,
        formule: formula,
        valeur: Number(valeur),
      });
    }
  }

  onChangeFormula(event: Event, idx: number) {
    const element = event.target;
    if (element !== null) {
      const selectedCode = this.data[idx].code;
      const newFormula = (element as HTMLInputElement).value;
      const affectedCells = this.hf.changeNamedExpression(selectedCode, `=${newFormula}`);
      // Loop through affected cells and update the data array
      affectedCells.forEach((cell) => {
        const updatedCode = (cell as ExportedNamedExpressionChange).name;
        const updatedValue = (cell as ExportedNamedExpressionChange).newValue;  // The new value of the expression

        // Find the matching item in `data` by `code` and update its `valeur`
        const dataItem = this.data.find((item) => item.code === updatedCode);
        if (dataItem) {
          dataItem.valeur = Number(updatedValue);
        }
      });
    }
  }
}
