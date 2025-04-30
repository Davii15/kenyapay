"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Camera, X, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface QRScannerProps {
  onScan: (data: string) => void
  onClose?: () => void
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [hasCamera, setHasCamera] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cameraPermission, setCameraPermission] = useState<"granted" | "denied" | "prompt">("prompt")

  // Start camera and QR scanning
  const startScanner = async () => {
    setError(null)
    setIsScanning(true)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setCameraPermission("granted")
        scanQRCode()
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setIsScanning(false)
      setHasCamera(false)

      if ((err as any).name === "NotAllowedError") {
        setCameraPermission("denied")
        setError("Camera access denied. Please allow camera access to scan QR codes.")
      } else {
        setError("Could not access camera. Please make sure your device has a camera and try again.")
      }
    }
  }

  // Stop camera
  const stopScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setIsScanning(false)
  }

  // Scan QR code from video feed
  const scanQRCode = async () => {
    if (!isScanning || !videoRef.current || !canvasRef.current) return

    // Import QR code scanner library dynamically
    const jsQR = (await import("jsqr")).default

    const canvas = canvasRef.current
    const video = videoRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Function to scan a single frame
    const scanFrame = () => {
      if (!isScanning || !context || !video.videoWidth) {
        return
      }

      // Draw current video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Get image data for QR code detection
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

      // Detect QR code
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      })

      if (code) {
        // QR code detected
        stopScanner()
        onScan(code.data)
      } else {
        // Continue scanning
        requestAnimationFrame(scanFrame)
      }
    }

    // Start scanning frames
    scanFrame()
  }

  // Start scanner on component mount
  useEffect(() => {
    startScanner()

    // Clean up on unmount
    return () => {
      stopScanner()
    }
  }, [])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Scan QR Code</CardTitle>
            <CardDescription>Point your camera at a business QR code</CardDescription>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
          {isScanning ? (
            <>
              <video ref={videoRef} className="absolute inset-0 h-full w-full object-cover" playsInline muted />
              <canvas ref={canvasRef} className="absolute inset-0 h-full w-full object-cover opacity-0" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-48 w-48 border-2 border-primary/50 rounded-lg" />
              </div>
            </>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center p-4">
              <Camera className="mb-4 h-12 w-12 text-muted-foreground" />
              {error ? (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : (
                <p className="text-center text-sm text-muted-foreground">
                  {hasCamera ? "Camera is not active" : "No camera detected"}
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {!isScanning && (
          <Button className="w-full" onClick={startScanner} disabled={cameraPermission === "denied" && !hasCamera}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {hasCamera ? "Start Scanner" : "Try Again"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
