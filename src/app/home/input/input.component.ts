import { Component, EventEmitter, Output } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { type MatSnackBar } from '@angular/material/snack-bar'
import { type ApiService } from '../home-services/api.service'
import { type ResponseInterface } from '../../interfaces/response-interface'

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent {
  clusterInputFormGroup = new FormGroup({
    clusterName: new FormControl(''),
    k: new FormControl(''),
    distanceMetric: new FormControl('EUCLIDEAN'),
    clusterDetermination: new FormControl('ELBOW')
  })

  @Output() apiResponse: EventEmitter<ResponseInterface> = new EventEmitter<ResponseInterface>()
  @Output() isLoading: EventEmitter<boolean> = new EventEmitter<boolean>()

  constructor (
    private readonly snackbar: MatSnackBar,
    private readonly apiService: ApiService
  ) {
  }

  public file?: File

  submit () {
    console.log(this.clusterInputFormGroup.value)

    if (this.file && this.clusterInputFormGroup.value.distanceMetric && this.clusterInputFormGroup.value.clusterDetermination) {
      this.isLoading.emit(true)
      this.apiService.postKmeans(
        this.file,
        undefined,
        undefined,
        Number(this.clusterInputFormGroup.value.k),
        this.clusterInputFormGroup.value.distanceMetric,
        this.clusterInputFormGroup.value.clusterDetermination
      ).subscribe((response: ResponseInterface) => {
        this.apiResponse.emit(response)
        this.isLoading.emit(false)
      }, error => {
        this.isLoading.emit(false)
        this.snackbar.open('Ein Fehler ist aufgetreten. Meldung: ' + error.error.detail, 'Okay')
        console.log(error)
      })
    } else {
      this.snackbar.open('Bitte lade erst eine Datei hoch', 'Okay', { duration: 3000 })
    }
  }

  onDragOver (event: any) {
    event.preventDefault()
  }

  onDropSuccess (event: any) {
    event.preventDefault()

    this.onFileChange(event.dataTransfer.files[0]) // notice the "dataTransfer" used instead of "target"
  }

  onChange (event: any) {
    this.onFileChange(event.target.files[0])
  }

  private onFileChange (file: File) {
    if (file.type == 'text/csv' || file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      this.file = file
      this.snackbar.open('Datei ' + file.name + ' wird hochgeladen', 'Okay', { duration: 2000 })
    } else {
      this.snackbar.open('Falsches Dateiformat', 'Okay', { duration: 3000 })
    }
  }
}
