"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"

export function CurrencyConverter() {
  const [amount, setAmount] = useState<string>("100")
  const [fromCurrency, setFromCurrency] = useState<string>("USD")
  const [toCurrency, setToCurrency] = useState<string>("KSH")
  const [result, setResult] = useState<string>("")
  const [isCalculating, setIsCalculating] = useState<boolean>(false)

  // Mock exchange rates (in a real app, these would come from an API)
  const exchangeRates = {
    USD: 130.25,
    EUR: 142.5,
    GBP: 167.8,
    JPY: 0.88,
    AUD: 86.45,
    KSH: 1,
  }

  // Calculate conversion
  const calculateConversion = () => {
    setIsCalculating(true)

    // Simulate API call delay
    setTimeout(() => {
      try {
        const numAmount = Number.parseFloat(amount)
        if (isNaN(numAmount)) {
          setResult("Please enter a valid amount")
          return
        }

        // Convert from source currency to KSH
        let valueInKSH = numAmount
        if (fromCurrency !== "KSH") {
          valueInKSH = numAmount * exchangeRates[fromCurrency as keyof typeof exchangeRates]
        }

        // Convert from KSH to target currency
        let finalValue = valueInKSH
        if (toCurrency !== "KSH") {
          finalValue = valueInKSH / exchangeRates[toCurrency as keyof typeof exchangeRates]
        }

        setResult(`${numAmount} ${fromCurrency} = ${finalValue.toFixed(2)} ${toCurrency}`)
      } catch (error) {
        setResult("Error calculating conversion")
        console.error(error)
      } finally {
        setIsCalculating(false)
      }
    }, 500)
  }

  return (
    <div className="rounded-xl border border-green-200 bg-white p-6 shadow-md dark:bg-gray-900 dark:border-green-800">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium mb-2">
            Amount
          </label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full"
          />
        </div>
        <div>
          <label htmlFor="fromCurrency" className="block text-sm font-medium mb-2">
            From Currency
          </label>
          <select
            id="fromCurrency"
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="USD">US Dollar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="GBP">British Pound (GBP)</option>
            <option value="JPY">Japanese Yen (JPY)</option>
            <option value="AUD">Australian Dollar (AUD)</option>
            <option value="KSH">Kenyan Shilling (KSH)</option>
          </select>
        </div>
        <div>
          <label htmlFor="toCurrency" className="block text-sm font-medium mb-2">
            To Currency
          </label>
          <select
            id="toCurrency"
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="KSH">Kenyan Shilling (KSH)</option>
            <option value="USD">US Dollar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="GBP">British Pound (GBP)</option>
            <option value="JPY">Japanese Yen (JPY)</option>
            <option value="AUD">Australian Dollar (AUD)</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <Button
          onClick={calculateConversion}
          disabled={isCalculating}
          className="bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700 text-white"
        >
          {isCalculating ? "Calculating..." : "Convert"}
          {!isCalculating && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
          <p className="text-lg font-medium">{result}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Exchange rates are updated daily. Actual rates may vary at time of transaction.
          </p>
        </div>
      )}
    </div>
  )
}
