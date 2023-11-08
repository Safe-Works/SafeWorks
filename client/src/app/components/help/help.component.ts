import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { UserAuth } from "src/app/auth/User.Auth";
import { ContractService } from "src/app/services/contract.service";
import { UserService } from "src/app/services/user.service";
import { HelpRequest } from "src/app/utils/interfaces/help-request.interface";
import Swal from "sweetalert2";

@Component({
  selector: "app-help",
  templateUrl: "./help.component.html",
  styleUrls: ["./help.component.css"],
})
export class HelpComponent {
  isLoading = false;
  helpForm!: FormGroup;
  contracts: any = null;
  title = new FormControl("", [Validators.required]);
  description = new FormControl("", [Validators.required]);
  contract = new FormControl("");
  constructor(
    private userService: UserService,
    private userAuth: UserAuth,
    private _snackBar: MatSnackBar,
    private router: Router,
    private contractService: ContractService
  ) {
    this.helpForm = new FormGroup({
      title: this.title,
      description: this.description,
      contract: this.contract,
    });
  }
  async ngOnInit() {
    this.contracts = await this.contractService.GetAllFromClient(
      this.userAuth.currentUser?.uid ?? ""
    );
  }
  isValidForm(): boolean {
    if (this.title.valid && this.description.valid) {
      return true;
    }
    return false;
  }
  async requestHelp(): Promise<void> {
    if (!this.isValidForm()) {
      return;
    }
    this.isLoading = true;
    const helpRequestInfos: HelpRequest = {
      title: this.helpForm.get("title")?.value,
      description: this.helpForm.get("description")?.value,
      user: {
        email: this.userAuth.currentUser?.email || "",
        name: this.userAuth.currentUser?.displayName || "",
        id: this.userAuth.currentUser?.uid || "",
      },
    };
    if(this.helpForm.get("contract")?.value)
      helpRequestInfos.contractId = this.helpForm.get("contract")?.value;
    try {
      let response = await this.userService.HelpRequest(helpRequestInfos);

      if (response.statusCode === 201) {
        this.isLoading = false;
        Swal.fire(
          "Sucesso!",
          "Sua solicitação foi enviada. Em breve, um de nossos administradores entrará em contato com você por e-mail.",
          "success"
        );
        this.router.navigate(["/"]);
      } else {
        console.error(response.error);
        this.isLoading = false;
        Swal.fire(
          "Erro!",
          "Ocorreu um erro ao enviar a sua solicitação.",
          "error"
        );
      }
    } catch (error) {
      console.error("Erro na solicitação:", error);
      this.isLoading = false;
    }
  }
}
