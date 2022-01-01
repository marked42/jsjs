class Person {
  private _name: string
  private _officeAreaCode: string
  private _officeNumber: string
  private _telephoneNumber: TelephoneNumber

  constructor(code: string, number: string) {
    this._telephoneNumber = new TelephoneNumber(code, number)
  }

  get name() {
    return this._name
  }

  set name(value: string) {
    this._name = value
  }

  get telephoneNumber() {
    return this._telephoneNumber.toString()
  }

  get officeAreaCode() {
    return this._telephoneNumber.officeAreaCode
  }

  set officeAreaCode(value: string) {
    this._telephoneNumber.officeAreaCode = value
  }

  get officeNumber() {
    return this._telephoneNumber.officeNumber
  }

  set officeNumber(value: string) {
    this._telephoneNumber.officeNumber = value
  }
}

class TelephoneNumber {
  private _officeAreaCode: string
  private _officeNumber: string

  constructor(code, number) {
    this._officeAreaCode = code
    this._officeNumber = number
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

  toString() {
    return `(${this.officeAreaCode}) ${this.officeNumber}`
  }
}
