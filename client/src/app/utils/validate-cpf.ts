import { AbstractControl, ValidationErrors } from "@angular/forms";

export function validateCPF(control: AbstractControl): ValidationErrors | null {
    const cpf = control.value?.replace(/[^\d]+/g, ''); // remove todos os caracteres não numéricos do CPF
  
    if (cpf && cpf.length === 11) {
      let soma = 0;
      for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
      }
      let resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) {
        resto = 0;
      }
      if (resto !== parseInt(cpf.charAt(9))) {
        return { cpfInvalido: true };
      }
      soma = 0;
      for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
      }
      resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) {
        resto = 0;
      }
      if (resto !== parseInt(cpf.charAt(10))) {
        return { cpfInvalido: true };
      }
      return null;
    }
    return { cpfInvalido: true };
  }