import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ApiService} from "../home-services/api.service";
import {ResponseInterface} from "../../interfaces/response-interface";

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent {
  clusterInputFormGroup = new FormGroup({
    clusterName: new FormControl(''),
    k: new FormControl(''),
  });
  @Output() apiResponse: EventEmitter<ResponseInterface> = new EventEmitter<ResponseInterface>()
  // apiResponse: ResponseInterface | undefined;

  constructor(
      private snackbar: MatSnackBar,
      private apiService: ApiService,
      ) { //http wird später für die API Anbindung benutzt
  }

  public file?: File;

  submit() {
    console.log(JSON.stringify(this.clusterInputFormGroup.value));
  }

  onDragOver(event: any){
    event.preventDefault();
  }

  onDropSuccess(event: any) {
    event.preventDefault();

    this.onFileChange(event.dataTransfer.files[0]);    // notice the "dataTransfer" used instead of "target"
  }

  onChange(event:any){
    this.onFileChange(event.target.files[0]);
  }

  private onFileChange(file: File){
    if(file.type == 'text/csv' || file.type =='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
      this.file = file;
      this.snackbar.open('Ich lade die Datei '+file.name+' hoch wenn die API Jungs soweit sind','Okay');

      this.apiService.postKmeans(this.file, 2).subscribe((response: ResponseInterface) => {
        // console.log(response);
        this.apiResponse.emit(response);
      })
    }
    else {
      this.snackbar.open('Falsches Dateiformat','Okay');
    }

  }
}
