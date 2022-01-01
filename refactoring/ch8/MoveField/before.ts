class Customer {
  private _name: string
  private _discountRate: number
  private _contract: CustomerContract

  constructor(name: string, discountRate: number) {
    this._name = name
    this._discountRate = discountRate
    this._contract = new CustomerContract(dateToday())
  }

  get discountRate() {
    return this._discountRate
  }

  becomePreferred() {
    this._discountRate += 0.03
  }

  applyDiscount(amount) {
    return amount.subtract(amount.multiply(this._discountRate))
  }
}

class CustomerContract {
  private _startDate: Date

  constructor(startDate) {
    this._startDate = startDate
  }
}

function dateToday() {
  return new Date()
}

export {}
