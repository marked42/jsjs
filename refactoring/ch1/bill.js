const plays = require('./play.json')
const invoices = require('./invoices.json')

function statement(invoice, plays) {
  return renderPlainText(createStatementData(invoice))
}

function createStatementData(invoice) {
  const statementData = {}
  statementData.customer = invoice.customer
  statementData.performances = invoice.performances.map(enrichPerformance)
  statementData.totalAmount = totalAmountFor(statementData)
  statementData.totalVolumeCredits = totalVolumeCredits(statementData)
  return statementData
}

function renderPlainText(data) {
  let result = `Statement for ${data.customer}\n`

  for (let perf of data.performances) {
    // print lint for this order
    result += ` ${perf.play.name}: ${usd(perf.amount)} (${
      perf.audience
    } seats)\n`
  }

  result += `Amount owed is ${usd(data.totalAmount)}\n`
  result += `You earned ${data.totalVolumeCredits} credits\n`
  return result
}

invoices.forEach((invoice) => {
  console.log(statement(invoice, plays))
})

function enrichPerformance(aPerformance) {
  const result = Object.assign({}, aPerformance)
  result.play = playFor(result)
  result.amount = amountFor(result)
  result.volumeCredits = volumeCreditsFor(result)

  return result
}

function htmlStatement(invoice, plays) {
  return renderHtml(enrichPerformance(invoice, plays))
}

function totalAmountFor(data) {
  let result = 0
  for (let perf of data.performances) {
    result += perf.amount
  }
  return result
}

function totalVolumeCredits(data) {
  let result = 0
  for (let perf of data.performances) {
    result += perf.volumeCredits
  }
  return result
}

function usd(aNumber) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(aNumber / 100)
}

function volumeCreditsFor(aPerformance) {
  let result = Math.max(aPerformance.audience - 30, 0)
  // add extra credit for every then comedy attendees
  if (aPerformance.play.type === 'comedy') {
    result += Math.floor(aPerformance.audience / 5)
  }
  return result
}

function playFor(aPerformance) {
  return plays[aPerformance.playID]
}

function amountFor(aPerformance) {
  let result = 0
  switch (aPerformance.play.type) {
    case 'tragedy':
      result = 40000
      if (aPerformance.audience > 30) {
        result += 1000 * (aPerformance.audience - 30)
      }
      break
    case 'comedy':
      result = 30000
      if (aPerformance.audience > 20) {
        result += 10000 + 500 * (aPerformance.audience - 20)
      }
      result += 300 * aPerformance.audience
      break
    default:
      throw new Error(`unknown type: ${performance.play.type}`)
  }
  return result
}
