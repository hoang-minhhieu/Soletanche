import { Component, OnInit } from '@angular/core';
import { ExportedNamedExpressionChange, HyperFormula } from 'hyperformula';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { TableRow } from '../step1/step1.component';

@Component({
  selector: 'app-step2',
  standalone: true,
  imports: [MatTableModule, FormsModule, CommonModule],
  templateUrl: './step2.component.html',
  styleUrl: './step2.component.css'
})
export class Step2Component implements OnInit {
  displayedColumns: string[] = ['code', 'formuleValeur'];
  data: TableRow[] = [{ code: 'VAR_1', formule: '1', valeur: 1 }, { code: 'VAR_2', formule: '2', valeur: 2 }];
  editingElement: any = null; // Stocker la ligne laquelle on a cliquée
  hf: HyperFormula = HyperFormula.buildEmpty({ licenseKey: 'gpl-v3' });

  constructor() { }

  ngOnInit(): void {
    // Générer 1000 lignes de "VAR_1" à "VAR_1000"
    this.data = [{ code: 'VAR_1', formule: '1', valeur: 1 }, { code: 'VAR_2', formule: '2', valeur: 2 }];
    this.hf.addNamedExpression('VAR_1', '1');
    this.hf.addNamedExpression('VAR_2', '2');
    for (let i = 3; i <= 1000; i++) {
      const code = `VAR_${i}`;
      const formula = `VAR_${i - 1} + VAR_${i - 2}`;

      // Ajouter l'expression nommée
      this.hf.addNamedExpression(code, `=${formula}`);

      // Calculate la valeur avec HyperFormula
      const valeur = this.hf.getNamedExpressionValue(code);

      // Ajouter le dans notre data source
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
      this.data[idx].formule = newFormula;
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

  finishEdit() {
    this.editingElement = null; // Exit edit mode
  }

  // Switch vers la vue Formule
  startEdit(element: any) {
    this.editingElement = element;
  }
}
