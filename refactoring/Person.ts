class Person {
  private _name: string
  private _officeAreaCode: string
  private _officeNumber: string

  get name() {
    return this._name
  }

  set name(value: string) {
    this._name = value
  }

  get officeAreaCode() {
    return this._officeAreaCode
  }

  set officeAreaCode(value: string) {
    this._officeAreaCode = value
  }

  get officeNumber() {
    return this._officeNumber
  }

  set officeNumber(value: string) {
    this._officeNumber = value
  }
}
