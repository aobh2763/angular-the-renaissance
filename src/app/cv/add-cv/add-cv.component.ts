import { Component, ChangeDetectionStrategy, inject } from "@angular/core";
import { AbstractControl, FormBuilder, Validators, ReactiveFormsModule } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { CvService } from "../services/cv.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { APP_ROUTES } from "src/config/routes.config";
import { CreateCvDto } from "../dto/create-cv.dto";

@Component({
    selector: "app-add-cv",
    templateUrl: "./add-cv.component.html",
    styleUrls: ["./add-cv.component.css"],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [ReactiveFormsModule]
})
export class AddCvComponent {
  private cvService = inject(CvService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private formBuilder = inject(FormBuilder);

  submitAttempted = false;

  form = this.formBuilder.group(
    {
      name: ["", Validators.required],
      firstname: ["", Validators.required],
      path: [""],
      job: ["", Validators.required],
      cin: [
        "",
        {
          validators: [Validators.required, Validators.pattern("[0-9]{8}")],
        },
      ],
      age: [null, Validators.required],
    },
  );

  addCv() {
    if (this.form.invalid) {
      this.submitAttempted = true;
      this.form.markAllAsTouched();
      return;
    }

    this.submitAttempted = false;
    const raw = this.form.getRawValue();
    const payload: CreateCvDto = {
      name: raw.name ?? "",
      firstname: raw.firstname ?? "",
      path: raw.path ?? "",
      job: raw.job ?? "",
      age: Number(raw.age ?? 0),
      cin: Number(raw.cin ?? 0),
    };

    this.cvService.addCv(payload).subscribe({
      next: (cv) => {
        this.router.navigate([APP_ROUTES.cv]);
        this.toastr.success(`Le cv ${cv.firstname} ${cv.name}`);
      },
      error: (error: HttpErrorResponse) => {
        console.error("Erreur lors de l’ajout du CV", error.error);
        this.toastr.error(this.getAddCvErrorMessage(error));
      },
    });
  }

  private getAddCvErrorMessage(error: HttpErrorResponse): string {
    const body: unknown = error.error;
    if (typeof body === "object" && body !== null) {
      const response = body as Record<string, unknown>;
      const apiError = response["error"];
      if (typeof apiError === "object" && apiError !== null) {
        const message = (apiError as Record<string, unknown>)["message"];
        if (typeof message === "string" && message.length > 0) {
          return `Le serveur a refusé le CV : ${message}`;
        }
      }

      const message = response["message"];
      if (typeof message === "string" && message.length > 0) {
        return `Le serveur a refusé le CV : ${message}`;
      }
    }

    return `Le serveur a refusé le CV (HTTP ${error.status}). Vérifiez les données saisies.`;
  }

  get name(): AbstractControl {
    return this.form.get("name")!;
  }
  get firstname() {
    return this.form.get("firstname");
  }
  get age(): AbstractControl {
    return this.form.get("age")!;
  }
  get job() {
    return this.form.get("job");
  }
  get path() {
    return this.form.get("path");
  }
  get cin(): AbstractControl {
    return this.form.get("cin")!;
  }
}
