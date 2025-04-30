import Link from "next/link"
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Globe,
  QrCode,
  ShieldCheck,
  Wallet,
  Smartphone,
  Lock,
  CreditCardIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { TermsOfService, PrivacyPolicy, CookiePolicy, RefundPolicy } from "@/components/legal-popover"
import { CurrencyConverter } from "@/components/currency-converter"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section with Enhanced Animation */}
      <section className="relative overflow-hidden bg-gradient-to-b from-green-50 via-amber-50 to-white dark:from-gray-900 dark:via-green-950 dark:to-amber-950">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=500&width=1000')] bg-center opacity-10"></div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-amber-500 to-green-500 animate-gradient"></div>
        <div className="container relative flex flex-col items-center justify-center gap-6 py-20 md:py-28 lg:py-32">
          <div className="mx-auto flex max-w-[800px] flex-col items-center space-y-4 text-center">
            <div className="inline-block rounded-full bg-gradient-to-r from-green-600/20 to-amber-600/20 px-3 py-1 text-sm font-medium text-green-700 dark:text-green-400 animate-fade-in">
              Simplifying Currency Exchange for Tourists
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl animate-slide-in">
              Travel Kenya Without{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-amber-600 animate-pulse">
                Currency Worries
              </span>
            </h1>
            <p
              className="mx-auto max-w-[700px] text-muted-foreground text-lg md:text-xl animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              Convert your currency to Kenyan Shillings instantly and pay local businesses with ease. No more exchange
              rate hassles or carrying cash.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <Link href="/signup">
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700 text-white border-none transition-transform hover:scale-105"
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button
                variant="outline"
                size="lg"
                className="transition-transform hover:scale-105 border-green-600/50 hover:border-green-600"
              >
                Learn More
              </Button>
            </Link>
          </div>
          <div
            className="mt-8 w-full max-w-[900px] overflow-hidden rounded-xl border border-green-200 bg-white shadow-xl animate-fade-in dark:bg-gray-900 dark:border-green-900"
            style={{ animationDelay: "0.7s" }}
          >
            <div className="relative aspect-video w-full overflow-hidden">
              <img
                src="/placeholder.svg?height=500&width=900"
                alt="KenyaPay App Demo"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-full bg-gradient-to-r from-green-600 to-amber-600 p-4 animate-pulse">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 text-white"
                  >
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating elements animation */}
        <div className="absolute top-1/4 left-10 w-12 h-12 rounded-full bg-green-500/10 animate-float"></div>
        <div className="absolute top-1/3 right-10 w-8 h-8 rounded-full bg-amber-500/10 animate-float-delay"></div>
        <div className="absolute bottom-1/4 left-1/4 w-16 h-16 rounded-full bg-green-500/10 animate-float-delay-2"></div>
        <div className="absolute bottom-1/3 right-1/4 w-10 h-10 rounded-full bg-amber-500/10 animate-float"></div>
      </section>

      {/* Currency Converter Widget */}
      <section className="py-12 bg-gradient-to-r from-green-50 to-amber-50 dark:from-gray-900 dark:to-gray-900">
        <div className="container">
          <div className="mx-auto max-w-[800px]">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Try Our Currency Converter</h2>
              <p className="text-muted-foreground">See how much your currency is worth in Kenyan Shillings</p>
            </div>
            <CurrencyConverter />
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="border-y bg-white dark:bg-gray-900">
        <div className="container py-8 md:py-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <h2 className="text-center text-sm font-medium uppercase tracking-wider text-green-700 dark:text-green-500">
              Trusted by tourists from around the world
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-8">
              <div className="flex h-8 items-center justify-center opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0">
                <span className="text-xl font-bold">🇺🇸 USA</span>
              </div>
              <div className="flex h-8 items-center justify-center opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0">
                <span className="text-xl font-bold">🇬🇧 UK</span>
              </div>
              <div className="flex h-8 items-center justify-center opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0">
                <span className="text-xl font-bold">🇨🇦 Canada</span>
              </div>
              <div className="flex h-8 items-center justify-center opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0">
                <span className="text-xl font-bold">🇩🇪 Germany</span>
              </div>
              <div className="flex h-8 items-center justify-center opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0">
                <span className="text-xl font-bold">🇯🇵 Japan</span>
              </div>
              <div className="flex h-8 items-center justify-center opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0">
                <span className="text-xl font-bold">🇦🇺 Australia</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container py-16 md:py-24 lg:py-32">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <div className="inline-block rounded-full bg-gradient-to-r from-green-600/20 to-amber-600/20 px-3 py-1 text-sm font-medium text-green-700 dark:text-green-400">
            Features
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Everything You Need for Your Kenyan Adventure
          </h2>
          <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Enjoy your safari without currency hassles. KenyaPay makes payments simple and secure.
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 md:gap-12 pt-12">
          <div className="relative flex flex-col items-center gap-4 text-center rounded-xl border border-green-200 bg-gradient-to-b from-green-50 to-white p-6 shadow-sm transition-all hover:shadow-md dark:from-green-950 dark:to-gray-950 dark:border-green-800 group hover:-translate-y-1 duration-300">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-600/20 to-amber-600/20 group-hover:from-green-600/30 group-hover:to-amber-600/30 transition-all duration-300">
              <Wallet className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold mt-2">Digital Wallet</h3>
            <p className="text-muted-foreground">
              Securely store your converted Kenyan Shillings in your digital wallet. Top up anytime with multiple
              currencies.
            </p>
          </div>
          <div className="relative flex flex-col items-center gap-4 text-center rounded-xl border border-green-200 bg-gradient-to-b from-green-50 to-white p-6 shadow-sm transition-all hover:shadow-md dark:from-green-950 dark:to-gray-950 dark:border-green-800 group hover:-translate-y-1 duration-300">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-600/20 to-amber-600/20 group-hover:from-green-600/30 group-hover:to-amber-600/30 transition-all duration-300">
              <QrCode className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold mt-2">QR Code Payments</h3>
            <p className="text-muted-foreground">
              Pay local businesses instantly by scanning their QR code. Fast, secure, and contactless transactions.
            </p>
          </div>
          <div className="relative flex flex-col items-center gap-4 text-center rounded-xl border border-green-200 bg-gradient-to-b from-green-50 to-white p-6 shadow-sm transition-all hover:shadow-md dark:from-green-950 dark:to-gray-950 dark:border-green-800 group hover:-translate-y-1 duration-300">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-600/20 to-amber-600/20 group-hover:from-green-600/30 group-hover:to-amber-600/30 transition-all duration-300">
              <ShieldCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold mt-2">Secure Transactions</h3>
            <p className="text-muted-foreground">
              Bank-level security protects your money and personal information. Every transaction is encrypted and
              verified.
            </p>
          </div>
          <div className="relative flex flex-col items-center gap-4 text-center rounded-xl border border-green-200 bg-gradient-to-b from-green-50 to-white p-6 shadow-sm transition-all hover:shadow-md dark:from-green-950 dark:to-gray-950 dark:border-green-800 group hover:-translate-y-1 duration-300">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-600/20 to-amber-600/20 group-hover:from-green-600/30 group-hover:to-amber-600/30 transition-all duration-300">
              <Globe className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold mt-2">Multi-Currency Support</h3>
            <p className="text-muted-foreground">
              Convert from USD, EUR, GBP, JPY, AUD and more to Kenyan Shillings at competitive exchange rates.
            </p>
          </div>
          <div className="relative flex flex-col items-center gap-4 text-center rounded-xl border border-green-200 bg-gradient-to-b from-green-50 to-white p-6 shadow-sm transition-all hover:shadow-md dark:from-green-950 dark:to-gray-950 dark:border-green-800 group hover:-translate-y-1 duration-300">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-600/20 to-amber-600/20 group-hover:from-green-600/30 group-hover:to-amber-600/30 transition-all duration-300">
              <CreditCard className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold mt-2">Easy Top-Ups</h3>
            <p className="text-muted-foreground">
              Add funds to your wallet using credit cards, PayPal, or bank transfers. Instant crediting to your account.
            </p>
          </div>
          <div className="relative flex flex-col items-center gap-4 text-center rounded-xl border border-green-200 bg-gradient-to-b from-green-50 to-white p-6 shadow-sm transition-all hover:shadow-md dark:from-green-950 dark:to-gray-950 dark:border-green-800 group hover:-translate-y-1 duration-300">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-600/20 to-amber-600/20 group-hover:from-green-600/30 group-hover:to-amber-600/30 transition-all duration-300">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold mt-2">Verified Businesses</h3>
            <p className="text-muted-foreground">
              All businesses on our platform are verified to ensure safe and legitimate transactions for tourists.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="bg-gradient-to-r from-green-50 to-amber-50 py-16 md:py-24 lg:py-32 dark:from-gray-900 dark:to-gray-900"
      >
        <div className="container">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <div className="inline-block rounded-full bg-gradient-to-r from-green-600/20 to-amber-600/20 px-3 py-1 text-sm font-medium text-green-700 dark:text-green-400">
              How It Works
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Simple Steps to Start Using KenyaPay
            </h2>
            <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Get started in minutes and enjoy your Kenyan adventure without currency hassles
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="relative flex flex-col items-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-amber-600 text-white font-bold text-2xl">
                1
              </div>
              <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] h-0.5 w-[calc(100%-4rem)] bg-gradient-to-r from-green-600 to-amber-600"></div>
              <h3 className="text-xl font-bold mt-2">Sign Up</h3>
              <p className="text-muted-foreground">
                Create an account with your details and verify your identity. It only takes a few minutes to get
                started.
              </p>
              <div className="mt-4 rounded-lg border border-green-200 bg-white p-4 shadow-md transition-all hover:shadow-lg dark:bg-gray-900 dark:border-green-800">
                <img
                  src="/placeholder.svg?height=200&width=300"
                  alt="Sign Up Process"
                  className="mx-auto h-32 w-full rounded-md object-cover"
                />
              </div>
            </div>
            <div className="relative flex flex-col items-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-amber-600 text-white font-bold text-2xl">
                2
              </div>
              <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] h-0.5 w-[calc(100%-4rem)] bg-gradient-to-r from-green-600 to-amber-600"></div>
              <h3 className="text-xl font-bold mt-2">Top Up Your Wallet</h3>
              <p className="text-muted-foreground">
                Add funds to your wallet using your credit card, PayPal, or bank transfer. Convert to Kenyan Shillings
                instantly.
              </p>
              <div className="mt-4 rounded-lg border border-green-200 bg-white p-4 shadow-md transition-all hover:shadow-lg dark:bg-gray-900 dark:border-green-800">
                <img
                  src="/placeholder.svg?height=200&width=300"
                  alt="Top Up Process"
                  className="mx-auto h-32 w-full rounded-md object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-amber-600 text-white font-bold text-2xl">
                3
              </div>
              <h3 className="text-xl font-bold mt-2">Pay With Ease</h3>
              <p className="text-muted-foreground">
                Scan business QR codes to make payments in Kenyan Shillings. Get instant confirmation and receipts.
              </p>
              <div className="mt-4 rounded-lg border border-green-200 bg-white p-4 shadow-md transition-all hover:shadow-lg dark:bg-gray-900 dark:border-green-800">
                <img
                  src="/placeholder.svg?height=200&width=300"
                  alt="Payment Process"
                  className="mx-auto h-32 w-full rounded-md object-cover"
                />
              </div>
            </div>
          </div>
          <div className="mt-12 flex justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700 text-white border-none"
              >
                <QrCode className="h-4 w-4" />
                Try KenyaPay Today
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Security Features Section */}
      <section className="container py-16 md:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <div className="inline-block rounded-full bg-gradient-to-r from-green-600/20 to-amber-600/20 px-3 py-1 text-sm font-medium text-green-700 dark:text-green-400">
            Security First
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Your Money Is Safe With Us</h2>
          <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            We implement multiple layers of security to protect your funds and personal information
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-center gap-4 text-center p-6 rounded-xl border border-green-200 bg-white dark:bg-gray-900 dark:border-green-800 hover:shadow-md transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-green-600/20 to-amber-600/20">
              <Lock className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-bold">End-to-End Encryption</h3>
            <p className="text-sm text-muted-foreground">
              All transactions and personal data are encrypted using industry-standard protocols
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 text-center p-6 rounded-xl border border-green-200 bg-white dark:bg-gray-900 dark:border-green-800 hover:shadow-md transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-green-600/20 to-amber-600/20">
              <ShieldCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-bold">Fraud Detection</h3>
            <p className="text-sm text-muted-foreground">
              Advanced AI systems monitor transactions to detect and prevent fraudulent activity
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 text-center p-6 rounded-xl border border-green-200 bg-white dark:bg-gray-900 dark:border-green-800 hover:shadow-md transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-green-600/20 to-amber-600/20">
              <CreditCardIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-bold">Secure Payments</h3>
            <p className="text-sm text-muted-foreground">
              PCI-DSS compliant payment processing with tokenization for all card transactions
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 text-center p-6 rounded-xl border border-green-200 bg-white dark:bg-gray-900 dark:border-green-800 hover:shadow-md transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-green-600/20 to-amber-600/20">
              <Smartphone className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-bold">Two-Factor Authentication</h3>
            <p className="text-sm text-muted-foreground">
              Additional security layer for account access and high-value transactions
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="bg-gradient-to-r from-green-50 to-amber-50 py-16 md:py-24 dark:from-gray-900 dark:to-gray-900"
      >
        <div className="container">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <div className="inline-block rounded-full bg-gradient-to-r from-green-600/20 to-amber-600/20 px-3 py-1 text-sm font-medium text-green-700 dark:text-green-400">
              Testimonials
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What Our Users Say</h2>
            <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Hear from tourists and businesses who use KenyaPay every day
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-green-200 dark:border-green-800 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-lg font-bold text-green-600 dark:text-green-400">
                  JD
                </div>
                <div>
                  <h4 className="font-bold">John Davis</h4>
                  <p className="text-sm text-muted-foreground">Tourist from USA</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "KenyaPay made my safari trip so much easier! I didn't have to worry about carrying cash or finding
                currency exchange places. Just scan and pay!"
              </p>
              <div className="mt-4 flex text-amber-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-green-200 dark:border-green-800 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-lg font-bold text-green-600 dark:text-green-400">
                  SR
                </div>
                <div>
                  <h4 className="font-bold">Savanna Restaurant</h4>
                  <p className="text-sm text-muted-foreground">Business in Nairobi</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "As a restaurant owner, KenyaPay has increased our tourist customers by 30%. The instant payments and
                easy withdrawal system have transformed our business."
              </p>
              <div className="mt-4 flex text-amber-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-green-200 dark:border-green-800 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-lg font-bold text-green-600 dark:text-green-400">
                  EW
                </div>
                <div>
                  <h4 className="font-bold">Emma Wilson</h4>
                  <p className="text-sm text-muted-foreground">Tourist from Australia</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "The exchange rates are fantastic and the app is so intuitive! I saved so much money compared to
                traditional currency exchange services. Highly recommended!"
              </p>
              <div className="mt-4 flex text-amber-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App Preview Section */}
      <section className="container py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block rounded-full bg-gradient-to-r from-green-600/20 to-amber-600/20 px-3 py-1 text-sm font-medium text-green-700 dark:text-green-400 mb-4">
              Mobile Experience
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">Take KenyaPay Wherever You Go</h2>
            <p className="text-muted-foreground mb-6">
              Our mobile app makes it easy to manage your wallet, scan QR codes, and track your spending while exploring
              Kenya. Available for iOS and Android devices.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600/20 mt-0.5">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <span>Offline functionality for areas with limited connectivity</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600/20 mt-0.5">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <span>Real-time transaction notifications</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600/20 mt-0.5">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <span>Built-in map of partnered businesses</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600/20 mt-0.5">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <span>Expense tracking and categorization</span>
              </li>
            </ul>
            <div className="mt-8 flex gap-4">
              <Button className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.21 2.33-.91 3.57-.84 1.5.09 2.63.68 3.35 1.76-3.03 1.67-2.34 5.38.59 6.47-.5 1.3-1.13 2.6-2.59 4.78zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                App Store
              </Button>
              <Button className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2" fill="currentColor">
                  <path d="M17.9 5c.9.49 1.5 1.46 1.5 2.7v8.7c0 1.24-.6 2.21-1.5 2.7l-5.6 3.2c-.9.49-1.9.49-2.8 0l-5.6-3.2c-.9-.49-1.5-1.46-1.5-2.7V7.7c0-1.24.6-2.21 1.5-2.7l5.6-3.2c.9-.49 1.9-.49 2.8 0L17.9 5zm-7.9 4v6.5l6-3.25-6-3.25z" />
                </svg>
                Google Play
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-64 h-64 bg-green-400/10 rounded-full filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-amber-400/10 rounded-full filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="relative bg-white dark:bg-gray-900 border-8 border-gray-100 dark:border-gray-800 rounded-[3rem] shadow-xl overflow-hidden max-w-[280px] mx-auto">
              <div className="h-12 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <div className="w-32 h-6 bg-black dark:bg-gray-700 rounded-full"></div>
              </div>
              <img src="/placeholder.svg?height=550&width=280" alt="KenyaPay Mobile App" className="w-full h-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="faq"
        className="bg-gradient-to-r from-green-50 to-amber-50 py-16 md:py-24 dark:from-gray-900 dark:to-gray-900"
      >
        <div className="container">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <div className="inline-block rounded-full bg-gradient-to-r from-green-600/20 to-amber-600/20 px-3 py-1 text-sm font-medium text-green-700 dark:text-green-400">
              FAQ
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Frequently Asked Questions</h2>
            <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Find answers to common questions about KenyaPay
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-4xl gap-6">
            <div className="rounded-lg border border-green-200 bg-white p-6 dark:bg-gray-900 dark:border-green-800">
              <h3 className="text-lg font-bold mb-2">How do I sign up for KenyaPay?</h3>
              <p className="text-muted-foreground">
                Signing up is easy! Download our app or visit our website, click on "Sign Up", select whether you're a
                tourist or business, and follow the verification steps. The whole process takes less than 5 minutes.
              </p>
            </div>
            <div className="rounded-lg border border-green-200 bg-white p-6 dark:bg-gray-900 dark:border-green-800">
              <h3 className="text-lg font-bold mb-2">What currencies can I use to top up my wallet?</h3>
              <p className="text-muted-foreground">
                We support multiple currencies including USD, EUR, GBP, JPY, AUD, CAD, and many more. Our competitive
                exchange rates ensure you get the best value when converting to Kenyan Shillings.
              </p>
            </div>
            <div className="rounded-lg border border-green-200 bg-white p-6 dark:bg-gray-900 dark:border-green-800">
              <h3 className="text-lg font-bold mb-2">How do businesses receive their money?</h3>
              <p className="text-muted-foreground">
                Businesses receive payments instantly in their KenyaPay wallet. They can then withdraw funds to their
                M-Pesa account or bank account whenever they want, with a small 1% service fee.
              </p>
            </div>
            <div className="rounded-lg border border-green-200 bg-white p-6 dark:bg-gray-900 dark:border-green-800">
              <h3 className="text-lg font-bold mb-2">Is KenyaPay secure?</h3>
              <p className="text-muted-foreground">
                We use bank-level encryption, two-factor authentication, and continuous security monitoring. All
                businesses are verified before joining our platform, and all transactions are protected against fraud.
              </p>
            </div>
            <div className="rounded-lg border border-green-200 bg-white p-6 dark:bg-gray-900 dark:border-green-800">
              <h3 className="text-lg font-bold mb-2">What if I don't have internet connection?</h3>
              <p className="text-muted-foreground">
                Our mobile app has offline functionality that allows you to make payments even in areas with limited
                connectivity. Transactions will sync once you're back online.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-16 md:py-24">
        <div className="rounded-2xl bg-gradient-to-r from-green-600 to-amber-600 p-8 md:p-12 lg:p-16 text-white">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
              Ready to Simplify Your Kenyan Adventure?
            </h2>
            <p className="mb-8 text-lg opacity-90">
              Join thousands of tourists and businesses already using KenyaPay for seamless currency exchange and
              payments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-white text-green-700 hover:bg-gray-100 hover:text-green-800 border-none w-full sm:w-auto"
                >
                  Sign Up Now
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/20 w-full sm:w-auto"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer with Legal Content */}
      <footer className="border-t bg-gradient-to-r from-green-50 to-amber-50 dark:from-gray-900 dark:to-gray-900">
        <div className="container py-12 md:py-16">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 font-bold text-xl mb-4">
                <Globe className="h-6 w-6 text-green-600" />
                <span>KenyaPay</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Making currency exchange and payments simple for tourists visiting Kenya.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-green-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                  <span className="sr-only">Facebook</span>
                </a>
                <a href="#" className="text-muted-foreground hover:text-green-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                  <span className="sr-only">Twitter</span>
                </a>
                <a href="#" className="text-muted-foreground hover:text-green-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                  </svg>
                  <span className="sr-only">Instagram</span>
                </a>
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-medium">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#features" className="text-muted-foreground hover:text-green-600">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="text-muted-foreground hover:text-green-600">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="#testimonials" className="text-muted-foreground hover:text-green-600">
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="text-muted-foreground hover:text-green-600">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-medium">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <TermsOfService />
                </li>
                <li>
                  <PrivacyPolicy />
                </li>
                <li>
                  <CookiePolicy />
                </li>
                <li>
                  <RefundPolicy />
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-medium">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-muted-foreground"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span className="text-muted-foreground">+254 700 123 456</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-muted-foreground"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                  <span className="text-muted-foreground">support@kenyapay.com</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-muted-foreground"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span className="text-muted-foreground">Nairobi, Kenya</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-green-200 dark:border-green-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} KenyaPay. All rights reserved.</p>
            <p className="text-sm text-muted-foreground mt-4 md:mt-0">Designed with ❤️ for tourists visiting Kenya</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
