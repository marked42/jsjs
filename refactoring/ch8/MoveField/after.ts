class Customer {
  private _name: string
  private _contract: CustomerContract

  constructor(name: string, discountRate: number) {
    this._name = name
    this._contract = new CustomerContract(dateToday(), discountRate)
    this._setDiscountRate(discountRate)
  }

  get discountRate() {
    return this._contract.discountRate
  }

  _setDiscountRate(aNumber: number) {
    this._contract.discountRate = aNumber
  }

  becomePreferred() {
    this._setDiscountRate(this.discountRate + 0.03)
  }

  // applyDiscount(amount) {
  //   return amount.subtract(amount.multiply(this.discountRate))
  // }
}

class CustomerContract {
  private _startDate: Date
  private _discountRate: number

  constructor(startDate: Date, discountRate: number) {
    this._startDate = startDate
    this._discountRate = discountRate
  }

  get discountRate() {
    return this._discountRate
  }

  set discountRate(aNumber: number) {
    this._discountRate = aNumber
  }
}

function dateToday() {
  return new Date()
}

console.log(new Customer('tom', 1))

export {}
